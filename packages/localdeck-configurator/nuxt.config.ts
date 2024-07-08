// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    extends: ["@localbytes/localdeck-components"],

    devtools: {
        enabled: false, // Conflicts with devtools for chrome
    },

    srcDir: './src',

    runtimeConfig: {
        public: {baseUrl: ''},

        api_token: '',
        api_url: 'http://supervisor/core/api',

        filesDir: '/homeassistant/esphome'
    },

    app: {
        head: {
            link: [
                {rel: 'icon', type: 'image/svg', href: '/favicon.svg'},
            ]
        }
    },

    modules: [
        '@nuxt/test-utils/module',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
    ],

    css: ['~/assets/css/global.css'],
})
