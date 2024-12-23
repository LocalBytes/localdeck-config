export default defineNuxtConfig({
  srcDir: 'src',
  modules: ['@vueuse/nuxt', '@nuxt/eslint', '@nuxt/test-utils/module'],

  eslint: { config: { stylistic: { semi: true } } },

  compatibilityDate: '2024-12-01',
});
