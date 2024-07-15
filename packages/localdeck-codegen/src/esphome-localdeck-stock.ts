import newConfig from "@/esphome-localdeck.js";
import {BUTTON_NUMBERS, ConfiguredButton, newConfiguredButtonOpts} from "@/virtuals/index.js";
import {DashboardImport} from "esphome-config-ts/dist/components/index.js";

import _ from "lodash";

const {config} = newConfig();

config.updateComponent(new DashboardImport({
    package_import_url: "github://LocalBytes/localdeck-config/packages/localdeck-codegen/esphome-localdeck.yaml"
}));

const esphomeComponent = config.components.filter((c) => c.componentName === "esphome")[0];
esphomeComponent.config = _.merge(esphomeComponent.config, {
    name_add_mac_suffix: true,
    project: {
        name: "localbytes.localdeck",
        version: "0.0.1",
    },
    on_boot: [
        {'light.turn_on': {id: 'ledstrip', brightness: '25%', effect: 'Addressable Rainbow'}}
    ]
});

BUTTON_NUMBERS.sort().forEach((num) => {
    config.addComponent(new ConfiguredButton({
        component: newConfiguredButtonOpts({num}),
        keyNum: num,
        label: {icon: "", text: "", fontSize: 12},
    }));
})

console.log(config.synthYaml());
