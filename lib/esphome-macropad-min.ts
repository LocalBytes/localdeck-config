import {Script} from "esphome-config-ts/lib/components/script";
import {MatrixKeypadBinarySensor} from "esphome-config-ts/lib/components/matrix_keypad";
import {lambda} from "esphome-config-ts/lib/lambda";

import {KEYS} from "./virtuals/follower-button.js";
import newConfig from "./esphome-macropad-base.js";

const {config, keypad, ledstrip} = newConfig();

config.addComponent(new Script({
    id: "blip_light",
    parameters: {led_index: 'int'},
    mode: "restart",
    then:
        Array.from({length: 21}, (_, i) => i).map(i => Math.max(100 - (i * 5), 0)).flatMap(brightness => {
            return [{
                'light.addressable_set': {
                    id: ledstrip.config.id,
                    range_from: lambda('return led_index;'),
                    range_to: lambda('return led_index;'),
                    red: `${brightness}%`, green: `${brightness}%`, blue: `${brightness}%`, white: `${brightness}%`
                },
            }, {
                'delay': '25ms'
            }];
        }),

}));

for (let i = 1; i <= 24; i++) {
    let idx = i - 1;

    config.addComponent(new MatrixKeypadBinarySensor({
        id: `keypad_button_${i.toString().padStart(2, "0")}`,
        name: "Button " + i.toString().padStart(2, "0"),
        keypad_id: 'keypad',
        key: KEYS[idx],
        on_press: [
            {'script.execute': {id: 'blip_light', led_index: idx}},
        ]
    }))
}
console.log(config.synthYaml());
