import newConfig from "./esphome-macropad-base.js";
import {BUTTON_NUMBERS, ConfiguredButton, newConfiguredButtonOpts} from "./virtuals/configured-button";

let {config} = newConfig();
BUTTON_NUMBERS.sort().forEach((num) => {
    config.addComponent(new ConfiguredButton({
        component: newConfiguredButtonOpts({num}),
        keyNum: num,
        label: {icon: "", text: "", fontSize: 12},
    }));
})

console.log(config.synthYaml());
