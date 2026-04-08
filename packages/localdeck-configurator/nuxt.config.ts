// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@localbytes/localdeck-components'],
  modules: [
    '@nuxt/eslint',

    // @nuxtjs/color-mode is conditionally loaded for test workaround (see https://github.com/nuxt-modules/color-mode/issues/335)
    ...(!import.meta.env.TEST ? ['@nuxtjs/color-mode'] : []),
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

  css: ['./src/assets/main.css'],

  router: {
    options: {
      hashMode: true,
    },
  },

  colorMode: {
    classSuffix: '-mode',
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

  compatibilityDate: '2026-01-01',

  eslint: { config: { stylistic: { semi: true } } },

});
