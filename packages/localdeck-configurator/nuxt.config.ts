// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  extends: ["@localbytes/localdeck-components"],
  modules: ["@nuxtjs/color-mode"],
  devtools: {
    enabled: false, // Conflicts with devtools for chrome
  },

  app: {
    head: {
      link: [{ rel: "icon", type: "image/svg", href: "/favicon.svg" }],
    },
  },

  css: ["~/assets/main.css"],

  colorMode: {
    dataValue: "theme",
  },

  runtimeConfig: {
    esphomeDir: "/homeassistant/esphome",

    haUrl: "",
    haToken: "",

    public: { baseUrl: "" },

    nitro: { envPrefix: "LB_" },
  },

  // // https://github.com/nuxt/nuxt/issues/32965
  dir: {
    public: "src/public",
    modules: "src/modules",
    shared: "src/shared",
  },
  srcDir: "src",
  serverDir: "src/server",

  compatibilityDate: "2026-01-01",
});
