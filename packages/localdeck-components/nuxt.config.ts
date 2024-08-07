export default defineNuxtConfig({
  srcDir: 'src',
  modules: ['@vueuse/nuxt', '@nuxt/eslint', '@nuxt/test-utils/module'],
  compatibilityDate: '2024-07-15',

  eslint: { config: { stylistic: { semi: true } } },

  // https://github.com/nuxt/nuxt/discussions/26739
  nitro: { experimental: { legacyExternals: true } },

});
