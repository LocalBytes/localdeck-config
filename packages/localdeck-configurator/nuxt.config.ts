import rollupPluginTs from 'rollup-plugin-typescript2'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    srcDir: './src',

    devtools: {enabled: true},

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

    vite: {
        vue: {
            script: {
                defineModel: true,
            }
        },
    },

    nitro: {
        rollupConfig: {
            // @ts-ignore
            plugins: [rollupPluginTs()]
        }
    },

    typescript: {
        tsConfig: {
            compilerOptions: {
                verbatimModuleSyntax: false //Remove when we convert esphome-ts to verbatimModuleSyntax
            }
        }
    },
})
