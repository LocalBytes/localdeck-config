export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', '@nuxt/eslint'],

  srcDir: 'src', // https://github.com/nuxt/nuxt/issues/32965

  compatibilityDate: '2026-01-01',

  eslint: { config: { stylistic: { semi: true } } },
});
