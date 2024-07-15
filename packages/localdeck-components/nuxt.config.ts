export default defineNuxtConfig({
  srcDir: 'src',
  modules: ['@vueuse/nuxt', '@nuxt/eslint'],
  compatibilityDate: '2024-07-15',

  eslint: { config: { stylistic: true } },

  // https://github.com/nuxt/nuxt/discussions/26739
  nitro: { experimental: { legacyExternals: true } },

})
