import {
  BUTTON_NUMBERS,
  type ConfiguredButtonOpts,
  zButtonNumber,
  zConfiguredButtonOpts,
} from '@localbytes/localdeck-codegen/dist/virtuals';
import { z } from 'zod';

// Zod has deprecated the deepPartial method, with not replacement
// GH: https://github.com/colinhacks/zod/issues/2854
// noinspection JSDeprecatedSymbols
export const zPadEditor = z.object({
  title: z.string().default('LocalDeck'),
  buttons: z.preprocess(
    val => Object.fromEntries(Object.entries(val as Record<string, unknown>).filter(([key]) => zButtonNumber.safeParse(key).success)),
    z.record(zButtonNumber, zConfiguredButtonOpts.deepPartial()),
  ).default({}),
});

export type PadEditor = z.infer<typeof zPadEditor>;

export const zEditContainer = zConfiguredButtonOpts;
export type EditContainer = ConfiguredButtonOpts;

export const newPadEditor = (): PadEditor => {
  try {
    return ({
      title: 'LocalDeck',
      buttons: BUTTON_NUMBERS.reduce((acc, num) => {
        acc[num] = zEditContainer.parse({ keyNum: num, component: { num }, label: {} });
        return acc;
      }, {} as Record<number, ConfiguredButtonOpts>,
      ),
    });
  }
  catch (e) {
    if (e instanceof z.ZodError) console.error(e.issues);
    throw e;
  }
};
