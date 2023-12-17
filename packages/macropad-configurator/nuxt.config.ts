// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: './src',

  modules:[
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
  ],

  devtools: { enabled: true },

  typescript: {
    tsConfig: {
      compilerOptions: {
        verbatimModuleSyntax: false //TODO: Remove this when we update the codegen
      }
    }
  },

})
