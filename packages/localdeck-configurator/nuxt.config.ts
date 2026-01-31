// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@localbytes/localdeck-components'],

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
  ],
  ssr: false,

  devtools: {
    enabled: false, // Conflicts with devtools for chrome
  },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg', href: '/favicon.svg' },
      ],
    },
  },

  css: ['~/assets/css/global.css'],

  router: {
    options: {
      hashMode: true,
    },
  },

  runtimeConfig: {
    public: { baseUrl: '' },

    api_token: '',
    api_url: '', // Allow this to be overridden by env

    filesDir: '/homeassistant/esphome',
  },

  // // https://github.com/nuxt/nuxt/issues/32965
  dir: {
    public: 'src/public',
    modules: 'src/modules',
    shared: 'src/shared',
  },
  srcDir: 'src',
  serverDir: 'src/server',

  compatibilityDate: '2024-12-01',

  eslint: { config: { stylistic: { semi: true } } },
});
