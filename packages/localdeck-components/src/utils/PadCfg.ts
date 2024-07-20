import {
  BUTTON_NUMBERS,
  type ConfiguredButtonOpts,
  newConfiguredButtonOpts,
  zConfiguredButtonOpts,
} from '@localbytes/localdeck-codegen/dist/virtuals';
import { z } from 'zod';
import type { DeepPartial } from './types';

export const zPadEditor = z.object({
  title: z.string(),
  buttons: z.record(z.number().positive().lte(Math.max(BUTTON_NUMBERS)), zConfiguredButtonOpts),
});

export type PadEditor = z.infer<typeof zPadEditor>;

export const zEditContainer = zConfiguredButtonOpts;
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
