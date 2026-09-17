import { createMemoryHistory, createWebHistory } from "vue-router";
import type { RouterConfig } from "@nuxt/schema";

export default {
  history: (base) => {
    const prefix = import.meta.server
      ? process.env.LB_PUBLIC_BASE_URL
      : useNuxtApp().payload?.config?.public?.baseUrl;

    return import.meta.server
      ? createMemoryHistory(prefix || base)
      : createWebHistory(prefix || base);
  },
} satisfies RouterConfig;
