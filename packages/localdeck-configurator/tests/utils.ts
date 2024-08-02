import type { TestOptions } from '@nuxt/test-utils/e2e';
import { setup } from '@nuxt/test-utils/e2e';

export const setupNuxt = (options?: Partial<TestOptions>) => {
  if (process.env.CI) return setup();
  else return setup({
    host: 'http://localhost:3000',
    build: false,
    buildDir: '.output',
    nuxtConfig: {
      nitro: {
        output: {
          dir: '.output',
        },
      },
    },
    ...(options ?? {}),
  });
};
