#!/usr/bin/with-contenv bashio
set +u

if _val=$(bashio::config 'esphome_dir' 2>/dev/null); then
  export LB_ESPHOME_DIR=${LB_ESPHOME_DIR:-$_val}
fi

export LB_HA_URL=${LB_HA_URL:-http://supervisor/core/api}
export LB_HA_TOKEN=${LB_HA_TOKEN:-${SUPERVISOR_TOKEN}}

if _val=$(bashio::addon.ingress_entry 2>/dev/null); then
  export LB_BASE_URL=${LB_BASE_URL:-$_val}
  export NUXT_APP_BUILD_ASSETS_DIR=${NUXT_APP_BUILD_ASSETS_DIR:-${_val}/_nuxt}
fi

node ./server/index.mjs
