export default defineNitroPlugin(() => {
  const legacyUsage = Object.entries({
    NUXT_FILES_DIR: 'LB_ESPHOME_DIR',
    NUXT_API_URL: 'LB_HA_URL',
    NUXT_API_TOKEN: 'LB_HA_TOKEN',
    NUXT_PUBLIC_BASE_URL: 'LB_BASE_URL',
  })
    .filter(([old]) => process.env[old]);

  if (legacyUsage.length > 0) {
    // TODO(#22 / LB-192): Write KB Article
    console.warn(
      '[configurator] We have renamed multiple undocumented ENV variables. They will be removed in the future!\n'
      + 'See: https://blog.mylocalbytes.com/kb/xxxx-xx-xx/localdeck-configurator ',
    );
    console.group();
    legacyUsage.forEach(([old, replace]) => {
      console.warn(`\`${old}\` is replaced with \`${replace}\`.`);
    });
    console.groupEnd();
  }

  if (!useRuntimeConfig().haUrl || !useRuntimeConfig().haToken) {
    console.warn('[configurator] Missing LB_HA_URL, or LB_HA_TOKEN. Entity autocomplete will be unavailable');
  }
});
