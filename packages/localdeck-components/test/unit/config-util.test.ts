import { describe, expect, test } from "vitest";
import { ObjectUtil, ConfigUtil } from "../../src/utils/config-util";
import { newPadEditor } from "../../src/utils/PadCfg";
import type { DeepPartial } from "../../src/utils/types";

describe("ObjectUtil", () => {
  test("should return the value at the given path", () => {
    const obj = { a: { b: { c: 1 } } };
    const path = ["a", "b", "c"];
    const result = ObjectUtil.get(obj, path);
    expect(result).toEqual(1);
  });

  test("should return undefined if the path does not exist", () => {
    const obj = { a: { b: { c: 1 } } };
    const path = ["a", "b", "d"];
    const result = ObjectUtil.get(obj, path);
    expect(result).toBeUndefined();
  });

  test("should set the value at the given path", () => {
    const obj = { a: { b: { c: 1 } } };
    const path = ["a", "b", "c"];
    ObjectUtil.set(obj, path, 2);
    expect(obj.a.b.c).toEqual(2);
  });

  test("should create the path if it does not exist when setting a value", () => {
    const obj = { a: { b: { c: 1 } } } as DeepPartial<{
      a: { b: { c: number; d: { e: number } } };
    }>;
    const path = ["a", "b", "d", "e"];
    ObjectUtil.set(obj, path, 2);

    expect(obj.a?.b?.d?.e).toEqual(2);
  });

  test("should handle symbol keys when getting a value", () => {
    const key = Symbol("key");
    const obj = { [key]: 1 };
    const path = [key];
    const result = ObjectUtil.get(obj, path);
    expect(result).toEqual(1);
  });

  test("should handle symbol keys when setting a value", () => {
    const key = Symbol("key");
    const obj: Record<symbol, number> = {};
    const path = [key];
    ObjectUtil.set(obj, path, 2);

    expect(obj[key]).toEqual(2);
  });

  test("should remove the value at the given path", () => {
    const obj = { a: { b: { c: 1 } } };
    const path = ["a", "b", "c"];
    ObjectUtil.unset(obj, path);
    expect(obj).toEqual({});
  });
});

describe("ConfigUtil", () => {
  test("should give a default config", () => {
    const util = new ConfigUtil();

    const editor = util.editor();
    expect(editor).toEqual(newPadEditor());
  });

  test("should give a default config with changes", () => {
    const util = new ConfigUtil();

    util.setChanges({ title: "test" });

    const editor = util.editor();
    expect(editor.title).toEqual("test");
    expect(editor.buttons).toEqual(newPadEditor().buttons);
  });

  test("should smartly merge changes", () => {
    const util = new ConfigUtil();
    const editor = util.editor();

    editor.buttons[1].label.text = "test";
    expect(util["changes"]).toEqual({ buttons: { 1: { label: { text: "test" } } } });

    const expectedOutput = newPadEditor();
    expectedOutput.buttons[1].label.text = "test";

    expect(editor).toEqual(expectedOutput);
  });

  test("should reset all changes", () => {
    const util = new ConfigUtil();
    const editor = util.editor();
    editor.buttons[1].label.text = "test";
    util.resetChanges();
    expect(util["changes"]).toEqual({});
  });

  test("should handle nulls that have been changed", () => {
    const util = new ConfigUtil();
    const editor = util.editor();
    editor.buttons[1].component.ha_entity = "test";

    expect(util["changes"]).toEqual({ buttons: { 1: { component: { ha_entity: "test" } } } });

    const expectedOutput = newPadEditor();
    expectedOutput.buttons[1].component.ha_entity = "test";
    expect(editor).toEqual(expectedOutput);
  });

  test("should reset changes at a path", () => {
    const util = new ConfigUtil();
    const editor = util.editor();

    expect(editor.buttons[1].label.text).toEqual(null);

    editor.buttons[1].label.text = "test";
    util.resetChanges("buttons.1.label");

    expect(editor.buttons[1].label.text).toEqual(null);
  });

  test("should allow setting changes", () => {
    const util = new ConfigUtil();
    const editor = util.editor();

    util.setChanges({ buttons: { 1: { label: { text: "test" } } } });

    expect(util.getChanges()).toEqual({ buttons: { 1: { label: { text: "test" } } } });

    editor.buttons[1].component.ha_entity = "foobar";

    expect(util.getChanges()).toEqual({
      buttons: {
        1: {
          label: { text: "test" },
          component: { ha_entity: "foobar" },
        },
      },
    });
  });
});
