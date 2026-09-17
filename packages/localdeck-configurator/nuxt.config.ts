// https://nuxt.com/docs/api/configuration/nuxt-config

// import.meta.env isn't typed in this node-context config file, so narrow it explicitly.
const isTest = Boolean((import.meta as { env?: { TEST?: boolean } }).env?.TEST);

export default defineNuxtConfig({
  extends: ['@localbytes/localdeck-components'],
  modules: [
    // @nuxtjs/color-mode is conditionally loaded for test workaround (see https://github.com/nuxt-modules/color-mode/issues/335)
    ...(!isTest ? ['@nuxtjs/color-mode'] : []),
  ],
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

  css: ['~/assets/main.css'],

  colorMode: {
    dataValue: 'theme',
  },

  runtimeConfig: {
    esphomeDir: '/homeassistant/esphome',

    haUrl: '',
    haToken: '',

    public: { baseUrl: '' },

    nitro: { envPrefix: 'LB_' },
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
});
