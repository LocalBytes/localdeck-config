import { newPadEditor, type PadEditor } from './PadCfg';
import type { DeepPartial } from './types';

export const configUtilSymbol = Symbol('configUtil');

type DynamicObject = Record<PropertyKey, unknown>;

export const ObjectUtil = {
  get: (obj: DynamicObject, path: (string | symbol)[]): unknown => {
    let val: unknown = obj;
    for (const p of path) {
      if (typeof val !== 'object' || val === null) return undefined;
      val = (val as DynamicObject)[p];
      if (typeof val === 'undefined') return;
    }
    return val;
  },

  set: (obj: DynamicObject, path: (string | symbol)[], value: unknown) => {
    let val = obj;
    for (const p of path.slice(0, -1)) {
      if (typeof val[p] == 'undefined' || val[p] == null) val[p] = {};
      val = val[p] as DynamicObject;
    }
    const key = path.at(-1);
    if (key !== undefined) val[key] = value;
  },

  unset: (obj: DynamicObject, path: (string | symbol)[]) => {
    const key = path[0];
    if (key === undefined) return;

    if (path.length === 1) {
      delete obj[key];
    }
    else {
      ObjectUtil.unset(obj[key] as DynamicObject, path.slice(1));

      if (Object.keys(obj[key] as DynamicObject).length === 0) delete obj[key];
    }
  },
};

const proxyHandler = (
  path: (string | symbol)[] = [],
  configUtil: ConfigUtil,
  notify: ((path: (string | symbol)[]) => void),
) => ({
  path,
  get(target: DynamicObject, key: string | symbol) {
    if (key == 'isProxy') return true;

    const prop = target[key];

    // return if property not found
    if (typeof prop == 'undefined') return;

    // set value as proxy if object
    if (typeof prop === 'object' && prop != null && !(prop as DynamicObject).isProxy) target[key] = new Proxy(prop, proxyHandler([...path, key], configUtil, notify));

    if (typeof prop === 'object' && prop != null) return target[key];

    return ObjectUtil.get(configUtil.changes, [...path, key]) ?? target[key];
  },

  set(target: DynamicObject, key: string | symbol, value: unknown) {
    ObjectUtil.set(configUtil.changes, [...path, key], value);
    notify(path);
    return true;
  },
} as ProxyHandler<object>);

export const useConfigUtil = () => inject(configUtilSymbol) as ConfigUtil;

export class ConfigUtil {
  changes: DeepPartial<PadEditor> = {};
  private defaultConfig = newPadEditor();

  public notify: ((path: (string | symbol)[]) => void) = () => {
    //
  };

  editor(): PadEditor {
    return new Proxy(this.defaultConfig, proxyHandler([], this, this.notify));
  }

  getChanges() {
    return this.changes;
  }

  setChanges(changes: typeof this.changes) {
    this.changes = changes;
    this.notify([]);
  }

  resetChanges(path = '') {
    if (path === '') {
      this.changes = {};
      return true;
    }

    ObjectUtil.unset(this.changes, path.split('.'));
    return true;
  }
}
