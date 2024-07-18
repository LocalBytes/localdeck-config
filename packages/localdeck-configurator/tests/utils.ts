import { setup } from '@nuxt/test-utils/e2e';
import type { TestOptions } from '@nuxt/test-utils';

export const setupNuxt = (options?: Partial<TestOptions>) => {
  return setup({
    build: false,
    buildDir: '.output',
    nuxtConfig: {
      nitro: {
        output: {
          dir: '.output',
        },
      },
    },
    ...options,
  });
};
