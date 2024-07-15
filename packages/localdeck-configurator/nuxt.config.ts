// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@localbytes/localdeck-components"],
  ssr: false,

  router: {
      options: {
          hashMode: true
      }
  },

  devtools: {
      enabled: false, // Conflicts with devtools for chrome
  },

  srcDir: './src',

  runtimeConfig: {
      public: {baseUrl: ''},

      api_token: '',
      api_url: '', //Allow this to be overridden by env

      filesDir: '/homeassistant/esphome'
  },

  app: {
      head: {
          link: [
              {rel: 'icon', type: 'image/svg', href: '/favicon.svg'},
          ]
      }
  },

  // https://github.com/nuxt/nuxt/discussions/26739
  nitro: {experimental: {legacyExternals: true}},

  modules: [
      '@nuxt/test-utils/module',
      '@nuxtjs/tailwindcss',
      '@nuxtjs/color-mode',
      "@nuxt/eslint"
  ],

  css: ['~/assets/css/global.css'],
  compatibilityDate: '2024-07-13',
})