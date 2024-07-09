#!/usr/bin/with-contenv bashio
set +u

export NUXT_FILES_DIR=$(bashio::config 'esphome_dir')
export NUXT_PUBLIC_BASE_URL="$(bashio::addon.ingress_entry)"
export NUXT_APP_BUILD_ASSETS_DIR="$(bashio::addon.ingress_entry)/_nuxt"

export NUXT_API_TOKEN=${SUPERVISOR_TOKEN}

export NUXT_API_URL="http://supervisor/core/api"

node ./server/index.mjs
