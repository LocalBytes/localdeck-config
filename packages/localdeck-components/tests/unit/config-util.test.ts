import {describe, expect, it} from 'vitest';
import ConfigUtil, {ObjectUtil} from "../../utils/config-util";
import type {DeepPartial} from "../../utils/types";
import {newPadEditor} from "../../utils/PadCfg";

describe("ObjectUtil", () => {

    it("should return the value at the given path", () => {
        const obj = {a: {b: {c: 1}}};
        const path = ['a', 'b', 'c'];
        const result = ObjectUtil.get(obj, path);
        expect(result).toEqual(1);
    });

    it("should return undefined if the path does not exist", () => {
        const obj = {a: {b: {c: 1}}};
        const path = ['a', 'b', 'd'];
        const result = ObjectUtil.get(obj, path);
        expect(result).toBeUndefined();
    });

    it("should set the value at the given path", () => {
        const obj = {a: {b: {c: 1}}};
        const path = ['a', 'b', 'c'];
        ObjectUtil.set(obj, path, 2);
        expect(obj.a.b.c).toEqual(2);
    });

    it("should create the path if it does not exist when setting a value", () => {
        const obj = {a: {b: {c: 1}}} as DeepPartial<{ a: { b: { c: number, d: { e: number } } } }>;
        const path = ['a', 'b', 'd', 'e'];
        ObjectUtil.set(obj, path, 2);

        expect(obj?.a?.b?.d?.e).toEqual(2);
    });

    it("should handle symbol keys when getting a value", () => {
        const key = Symbol('key');
        const obj = {[key]: 1};
        const path = [key];
        const result = ObjectUtil.get(obj, path);
        expect(result).toEqual(1);
    });

    it("should handle symbol keys when setting a value", () => {
        const key = Symbol('key');
        const obj: Record<symbol, number> = {};
        const path = [key];
        ObjectUtil.set(obj, path, 2);

        expect(obj[key]).toEqual(2);
    });

    it("should remove the value at the given path", () => {
        const obj = {a: {b: {c: 1}}};
        const path = ['a', 'b', 'c'];
        ObjectUtil.unset(obj, path);
        expect(obj).toEqual({});
    });

});

describe("ConfigUtil", () => {

    it("should give a default config", () => {
        let util = new ConfigUtil();

        let editor = util.editor();
        expect(editor).toEqual(newPadEditor());
    });

    it("should give a default config with changes", () => {
        let util = new ConfigUtil();

        util.setChanges({title: "test"});

        let editor = util.editor();
        expect(editor.title).toEqual("test");
        expect(editor.buttons).toEqual(newPadEditor().buttons);
    });

    it("should smartly merge changes", () => {
        let util = new ConfigUtil();
        let editor = util.editor();

        editor.buttons[1].label.text = "test";
        expect(util['changes']).toEqual({buttons: {1: {label: {text: "test"}}}});

        let expectedOutput = newPadEditor();
        expectedOutput.buttons[1].label.text = "test";

        expect(editor).toEqual(expectedOutput);
    });

    it("should reset all changes", () => {
        let util = new ConfigUtil();
        let editor = util.editor();
        editor.buttons[1].label.text = "test";
        util.resetChanges();
        expect(util['changes']).toEqual({});
    });

    it("should handle nulls that have been changed", () => {
        let util = new ConfigUtil();
        let editor = util.editor();
        editor.buttons[1].component.ha_entity = "test";

        expect(util['changes']).toEqual({buttons: {1: {component: {ha_entity: "test"}}}});

        let expectedOutput = newPadEditor();
        expectedOutput.buttons[1].component.ha_entity = "test";
        expect(editor).toEqual(expectedOutput);
    })

    it("should reset changes at a path", () => {
        let util = new ConfigUtil();
        let editor = util.editor();

        expect(editor.buttons[1].label.text).toEqual("");

        editor.buttons[1].label.text = "test";
        util.resetChanges("buttons.1.label");

        expect(editor.buttons[1].label.text).toEqual("");
    })

    it("should allow setting changes", () => {
        let util = new ConfigUtil();
        let editor = util.editor();

        util.setChanges({buttons: {1: {label: {text: "test"}}}});

        expect(util.getChanges()).toEqual({buttons: {1: {label: {text: "test"}}}});

        editor.buttons[1].component.ha_entity = "foobar";

        expect(util.getChanges()).toEqual({
            buttons: {
                1: {
                    label: {text: "test"},
                    component: {ha_entity: "foobar"},
                }
            }
        });
    });
});
