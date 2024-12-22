import * as path from 'node:path';

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
  ],

  srcDir: "./src",
  compatibilityDate: '2024-11-01',

  // https://github.com/nuxt/nuxt/discussions/26739
  // nitro: { experimental: { legacyExternals: true } },

  // eslint: { config: { stylistic: { semi: true } } },

});
