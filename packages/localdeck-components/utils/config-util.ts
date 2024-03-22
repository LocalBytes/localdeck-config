import {newPadEditor, type PadEditor} from "./PadCfg";
import type {DeepPartial} from "./types";

export const configUtilSymbol = Symbol("configUtil");

export const ObjectUtil = {
    get: (obj: any, path: (string | symbol)[]) => {
        let val = obj;
        for (let p of path) {
            val = val[p];
            if (typeof val == 'undefined') return;
        }
        return val;
    },

    set: (obj: any, path: (string | symbol)[], value: any) => {
        let val = obj;
        for (let p of path.slice(0, -1)) {
            if (typeof val[p] == 'undefined' || val[p] == null) val[p] = {};
            val = val[p];
        }
        val[path[path.length - 1]] = value;
    },

    unset: (obj: any, path: (string | symbol)[]) => {
        const key = path[0];
        if (path.length === 1) {
            delete obj[key];
        } else {
            ObjectUtil.unset(obj[key], path.slice(1));
            if (Object.keys(obj[key]).length === 0) delete obj[key];
        }
    }
};

const proxyHandler = (
    path: (string | symbol)[] = [],
    configUtil: ConfigUtil,
    notify: ((path: (string | symbol)[]) => void),
) => ({
    path,
    get(target, key) {
        if (key == 'isProxy') return true;

        const prop = target[key];

        // return if property not found
        if (typeof prop == 'undefined') return;

        // set value as proxy if object
        if (typeof prop === 'object' && prop != null && !prop.isProxy) target[key] = new Proxy(prop, proxyHandler([...path, key], configUtil, notify));

        if (typeof prop === 'object' && prop != null) return target[key];

        return ObjectUtil.get(configUtil.changes, [...path, key]) ?? target[key];
    },

    set(target, key, value) {
        ObjectUtil.set(configUtil.changes, [...path, key], value);
        notify(path);
        return true;
    }
} as ProxyHandler<any>);


export const useConfigUtil = () => inject(configUtilSymbol) as ConfigUtil;

export default class ConfigUtil {
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
    }

    resetChanges(path = "") {
        if (path === "") {
            this.changes = {};
            return true;
        }

        ObjectUtil.unset(this.changes, path.split("."));
        return true;
    }

}
