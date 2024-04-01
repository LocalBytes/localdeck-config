import newConfig from "./esphome-localdeck";
import {BUTTON_NUMBERS, ConfiguredButton, newConfiguredButtonOpts} from "./virtuals/configured-button";
import {DashboardImport} from "esphome-config-ts/lib/components/dashboard_import";

let {config} = newConfig();

config.updateComponent(new DashboardImport({
    package_import_url: "github://LocalBytes/localdeck-config/packages/localdeck-codegen/esphome-localdeck.yaml"
}));

BUTTON_NUMBERS.sort().forEach((num) => {
    config.addComponent(new ConfiguredButton({
        component: newConfiguredButtonOpts({num}),
        keyNum: num,
        label: {icon: "", text: "", fontSize: 12},
    }));
})

console.log(config.synthYaml());
