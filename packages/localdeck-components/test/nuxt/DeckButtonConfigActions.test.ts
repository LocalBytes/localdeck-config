import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { zConfiguredButtonOpts } from '@localbytes/localdeck-codegen/dist/virtuals';
import DeckButtonConfigActions from '../../src/components/DeckButtonConfigActions.vue';

const newButton = (componentOverrides: Record<string, unknown> = {}) =>
  zConfiguredButtonOpts.parse({ keyNum: 1, label: {}, component: { num: 1, ...componentOverrides } });

describe('DeckButtonConfigActions', () => {
  it('Flash LED on press is enabled after clearing ha_entity', async () => {
    const container = newButton({ ha_entity: 'light.living_room', follow_state: true });

    const wrapper = mount(DeckButtonConfigActions, {
      props: { modelValue: container, typeahead: null as unknown as never },
    });

    // Clear the entity via the input
    const entityInput = wrapper.find('input[type="text"]');
    await entityInput.setValue('');

    const flashCheckbox = wrapper
      .findAll('input[type="checkbox"]')
      .find(w => w.element.closest('label')?.textContent?.includes('Flash LED on press'));

    expect(flashCheckbox?.element.disabled).toBe(false);
  });
});
