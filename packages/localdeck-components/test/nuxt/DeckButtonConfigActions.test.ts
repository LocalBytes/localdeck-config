import { describe, expect, test } from "vitest";
import { reactive } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { zConfiguredButtonOpts } from "@localbytes/localdeck-codegen/virtuals/configured-button";
import DeckButtonConfigActions from "../../src/components/DeckButtonConfigActions.vue";

const newButton = (componentOverrides: Record<string, unknown> = {}) =>
  zConfiguredButtonOpts.parse({
    keyNum: 1,
    label: {},
    component: { num: 1, ...componentOverrides },
  });

describe("DeckButtonConfigActions", () => {
  test("Flash LED on press is enabled after clearing ha_entity", async () => {
    // The real app always holds this container in a ref/reactive (editor.vue's
    // `editing` ref), which is what makes nested mutations like clearing
    // ha_entity trigger a re-render. Match that here, not a plain object.
    const container = reactive(newButton({ ha_entity: "light.living_room", follow_state: true }));

    const wrapper = await mountSuspended(DeckButtonConfigActions, {
      props: { modelValue: container, typeahead: null as unknown as never },
    });

    // Clear the entity via the input
    const entityInput = wrapper.find('input[type="text"]');
    await entityInput.setValue("");

    const flashCheckbox = wrapper
      .findAll('input[type="checkbox"]')
      .find((w) => w.element.closest("label")?.textContent.includes("Flash LED on press"));

    expect(flashCheckbox?.element.disabled).toBe(false);
  });
});
