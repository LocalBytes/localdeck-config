// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // @ts-ignore
    srcDir: './src',

    devtools: {enabled: true},

    runtimeConfig: {
        filesDir: '/esphome',
    },

    app: {
        head: {
            link: [
                {rel: 'icon', type: 'image/svg', href: '/favicon.svg'},
            ]
        }
    },

    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
    ],

    css: ['~/assets/css/global.css']
})
