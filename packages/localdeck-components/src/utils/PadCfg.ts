import {
  BUTTON_NUMBERS,
  type ConfiguredButtonOpts,
  newConfiguredButtonOpts,
} from '@localbytes/localdeck-codegen/dist/virtuals';
import type { DeepPartial } from './types';

export interface PadEditor {
  title: string;
  buttons: Record<number, ConfiguredButtonOpts>;
}

export type EditContainer = ConfiguredButtonOpts;

export const newButton = (
  num: number,
  options: DeepPartial<EditContainer> = {},
): EditContainer => Object.assign({
  keyNum: num,
  component: newConfiguredButtonOpts({ num }),
  label: { icon: '', text: '', fontSize: 12 },
}, options);

export const newPadEditor = (): PadEditor => ({
  title: 'LocalDeck',
  buttons: BUTTON_NUMBERS.reduce((acc, num) => {
    acc[num] = newButton(num);
    return acc;
  }, {} as Record<number, ConfiguredButtonOpts>,
  ),
});
