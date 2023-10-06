import {Script} from "esphome-config-ts/lib/components/script";
import {MatrixKeypadBinarySensor} from "esphome-config-ts/lib/components/matrix_keypad";
import {lambda} from "esphome-config-ts/lib/lambda";

import {KEYS} from "./virtuals/follower-button.js";
import newConfig from "./esphome-macropad-base.js";

const {config, keypad, ledstrip} = newConfig();

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
