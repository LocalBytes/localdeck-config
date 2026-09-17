export default defineNitroPlugin(() => {
  const config = useRuntimeConfig();
  if (!config.haUrl || !config.haToken) {
    console.warn('[configurator] Missing LB_HA_URL, or LB_HA_TOKEN. Entity autocomplete will be unavailable');
  }
});
