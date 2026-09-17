# List available recipes.
default:
    @just --list

local-version := trim_start_match(`git describe --tags`, "v") + "." + datetime("%Y-%m-%dT%H-%M-%S")

# Build the configurator and deploy it into ./dist/localdeck-configurator.
configurator: build-configurator deploy-configurator

build-configurator:
    pnpm run build:configurator

deploy-configurator:
    pnpm exec shx rm -rf ./dist/localdeck-configurator
    pnpm exec shx mkdir -p ./dist/localdeck-configurator
    pnpm exec shx cp -r ./packages/localdeck-configurator/{.output,homeassistant}/* ./dist/localdeck-configurator
    pnpm exec shx sed -i "VERSION" "{{local-version}}" ./dist/localdeck-configurator/config.yaml
    pnpm exec shx sed -i '"LocalDeck Configurator"' '"LocalDeck Configurator (Local)"' ./dist/localdeck-configurator/config.yaml
    pnpm exec shx sed -i '"localdeck-configurator"' '"localdeck-configurator-local"' ./dist/localdeck-configurator/config.yaml
    pnpm exec shx sed -i "stage: stable" "stage: experimental" ./dist/localdeck-configurator/config.yaml
    pnpm exec shx sed -i "image:.*" "" ./dist/localdeck-configurator/config.yaml

# Regenerate esphome-localdeck.yaml and esphome-localdeck-test.yaml, then compile-check both.
make: make-test make-prod

[working-directory: 'packages/localdeck-codegen']
make-test:
    node ./dist/esphome-localdeck-test.mjs > ./esphome-localdeck-test.yaml
    esphome compile ./esphome-localdeck-test.yaml

[working-directory: 'packages/localdeck-codegen']
make-prod:
    node ./dist/esphome-localdeck-stock.mjs > ./esphome-localdeck.yaml
    esphome compile ./esphome-localdeck.yaml
