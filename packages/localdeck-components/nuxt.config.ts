// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
  ],

  srcDir: "./src",
  compatibilityDate: '2024-11-01',

  // eslint: { config: { stylistic: { semi: true } } },

});
