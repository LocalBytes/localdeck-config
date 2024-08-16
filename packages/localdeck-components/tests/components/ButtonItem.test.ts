import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { zConfiguredButtonOpts } from '@localbytes/localdeck-codegen/dist/virtuals';
import { DeckButtonItem } from '#components';

const CLASS_PRINTMODE = 'printmode';

const newButton = (id: number, overrides: Record<string, any> = {}) => {
  return zConfiguredButtonOpts.parse({
    keyNum: id,
    component: { num: id },
    ...overrides,
  });
};

describe('Button Item', () => {
  it('Shows relevant labels', async () => {
    const wrapper = mount(DeckButtonItem, {
      props: { container: newButton(1, { label: { text: 'Button' } }) },
    });

    expect(wrapper.text()).toContain('1');
    expect(wrapper.element.classList).not.toContain(CLASS_PRINTMODE);
    expect(wrapper.text()).toContain('Button');
  });

  it('Hides label in print mode', async () => {
    const wrapper = mount(DeckButtonItem, {
      global: { provide: { [isPrintingSymbol]: true } },
      props: { container: newButton(1, { label: { text: 'Button' } }) },
    });

    expect(wrapper.text()).not.toContain('1');
    expect(wrapper.element.classList).toContain(CLASS_PRINTMODE);
    expect(wrapper.text()).toContain('Button');
  });
});
