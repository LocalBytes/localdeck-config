export default defineNuxtPlugin(({ vueApp }) => {
  const config = useRuntimeConfig() as unknown as { public: { baseUrl: string } };
  globalThis.$fetch = $fetch.create({ baseURL: config.public.baseUrl });
});
