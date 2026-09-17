#!/usr/bin/with-contenv bashio
set +u

if [ "$(env | grep -c '^NUXT_')" -gt 0 ]; then
  echo "[run.sh] \`NUXT_\`-prefixed env vars are no longer used have been renamed." >&2
  echo "[run.sh] See: https://github.com/LocalBytes/localdeck-config/blob/main/packages/localdeck-configurator/CHANGELOG.md" >&2
fi

for pair in \
  'LB_ESPHOME_DIR:NUXT_FILES_DIR' \
  'LB_HA_URL:NUXT_API_URL' \
  'LB_HA_TOKEN:NUXT_API_TOKEN' \
  'LB_PUBLIC_BASE_URL:NUXT_PUBLIC_BASE_URL' \
  'LB_APP_BUILD_ASSETS_DIR:NUXT_APP_BUILD_ASSETS_DIR'
do
  new_name=${pair%%:*}
  old_name=${pair##*:}
  old_value=${!old_name}
  if [ -n "${old_value}" ]; then
    echo "[run.sh] \`${old_name}\` has become \`${new_name}\`." >&2
    export "${new_name}=${!new_name:-${old_value}}"
  fi
done

if _val=$(bashio::config 'esphome_dir' 2>/dev/null); then
  export LB_ESPHOME_DIR=${LB_ESPHOME_DIR:-$_val}
fi

export LB_HA_URL=${LB_HA_URL:-http://supervisor/core/api}
export LB_HA_TOKEN=${LB_HA_TOKEN:-${SUPERVISOR_TOKEN}}

if _val=$(bashio::addon.ingress_entry 2>/dev/null); then
  export LB_PUBLIC_BASE_URL=${LB_PUBLIC_BASE_URL:-$_val}
  export LB_APP_BUILD_ASSETS_DIR=${LB_APP_BUILD_ASSETS_DIR:-${_val}/_nuxt}
fi

node ./server/index.mjs
