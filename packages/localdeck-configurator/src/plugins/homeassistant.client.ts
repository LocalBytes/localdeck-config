import { notifyHARouteChange } from "~/utils/homeassistant";

export default defineNuxtPlugin(() => {
  const router = useRouter();
  const config = useRuntimeConfig();

  const referrerPath = document.referrer ? new URL(document.referrer).pathname : "";
  const ingressPrefix = config.public.baseUrl;
  const outerPrefix =
    referrerPath && !(ingressPrefix && referrerPath.startsWith(ingressPrefix)) ? referrerPath : "";

  const nuxtApp = useNuxtApp();

  router.afterEach((to) => {
    if (nuxtApp.isHydrating) return;

    notifyHARouteChange(outerPrefix, to.fullPath);
  });
});
