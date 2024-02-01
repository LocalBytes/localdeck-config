export default defineNuxtPlugin(({vueApp,}) => {
    let config = useRuntimeConfig();
    globalThis.$fetch = $fetch.create({baseURL: config.public.baseUrl});
});
