import {describe, expect, it} from 'vitest'
import ButtonItem from "~/components/ButtonItem.vue";
import {mount} from "@vue/test-utils";
import {newButton} from "~/lib/PadCfg";
import {isPrintingSymbol} from "~/lib/hooks";

describe('Button Item', () => {
    it("Shows relevant labels", async () => {
        const wrapper = mount(ButtonItem, {
            props: {container: newButton(1, {label: {text: "Button"}})}
        });

        expect(wrapper.text()).toContain("1");
        expect(wrapper.text()).toContain("Button")
    });

    it("Hides label in print mode", async () => {
        const wrapper = mount(ButtonItem, {
            global: {provide: {[isPrintingSymbol]: true}},
            props: {container: newButton(1, {label: {text: "Button"}})}
        });

        expect(wrapper.text()).not.toContain("1");
        expect(wrapper.text()).toContain("Button")
    });
});
