// https://nuxt.com/docs/api/configuration/nuxt-config

// import.meta.env isn't typed in this node-context config file, so narrow it explicitly.
const isTest = Boolean((import.meta as { env?: { TEST?: boolean } }).env?.TEST);

export default defineNuxtConfig({
  extends: ['@localbytes/localdeck-components'],
  modules: [
    '@nuxt/eslint',

    // @nuxtjs/color-mode is conditionally loaded for test workaround (see https://github.com/nuxt-modules/color-mode/issues/335)
    ...(!isTest ? ['@nuxtjs/color-mode'] : []),
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

  css: ['~/assets/main.css'],

  router: {
    options: {
      hashMode: true,
    },
  },

  colorMode: {
    dataValue: 'theme',
  },

  /** @see ./src/server/plugins/startup-warnings.ts */
  runtimeConfig: {
    esphomeDir: process.env.LB_ESPHOME_DIR ?? process.env.NUXT_FILES_DIR ?? '/homeassistant/esphome',

    haUrl: process.env.LB_HA_URL ?? process.env.NUXT_API_URL ?? '',
    haToken: process.env.LB_HA_TOKEN ?? process.env.NUXT_API_TOKEN ?? '',

    public: { baseUrl: process.env.LB_BASE_URL ?? process.env.NUXT_PUBLIC_BASE_URL ?? '' },
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

  eslint: { config: { stylistic: { semi: true }, typescript: { tsconfigPath: './tsconfig.json' } } },

});
