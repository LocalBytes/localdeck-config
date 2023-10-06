import {Script} from "esphome-config-ts/lib/components/script";
import {lambda} from "esphome-config-ts/lib/lambda";
import {MatrixKeypadBinarySensor} from "esphome-config-ts/lib/components/matrix_keypad";
import newConfig from "./esphome-macropad-base.js";

import {SliderNumber} from "./virtuals/slider-number";
import {FollowerButton, KEYS} from "./virtuals/follower-button";


const {config, ledstrip, keypad} = newConfig();

config.addComponent(new SliderNumber({
    id: "brightness",
    name: "Brightness",
    min: "0",
    max: "1",
    step: "0.01",
    initial_value: "1",
    type: "float"
}))

config.addComponent(new Script({
    id: "blip_light",
    parameters: {led_index: 'int'},
    mode: "restart",
    then:
        Array.from({length: 21}, (_, i) => i)
            .map(i => Math.max(100 - (i * 5), 0))
            .flatMap(brightness => [{
                'light.addressable_set': {
                    id: ledstrip.config.id,
                    range_from: lambda('return led_index;'),
                    range_to: lambda('return led_index;'),
                    red: `${brightness}%`, green: `${brightness}%`, blue: `${brightness}%`, white: `${brightness}%`
                },
            }, {
                'delay': '25ms'
            }]),

}));

let blipButton = (i: number) => {
    return new MatrixKeypadBinarySensor({
        id: `keypad_button_${i.toString().padStart(2, "0")}`,
        name: "Button " + i.toString().padStart(2, "0"),
        keypad_id: keypad.config.id,
        key: KEYS[i - 1],
        on_press: [
            {'script.execute': {id: 'blip_light', led_index: i - 1}},
        ]
    })
}
let followerButton = (config: { button_id: number, hass_entity: string }) => new FollowerButton({
    id: `follow_button_${config.button_id}`,
    keypad_id: "keypad",
    hass_entity: config.hass_entity,
    ledstrip_id: ledstrip.config.id,
    button_id: config.button_id,
});

config.addComponent([
    followerButton({button_id: 0, hass_entity: "light.livingroom_bulb"}),
    followerButton({button_id: 1, hass_entity: "light.livingroom_spot"}),
    followerButton({button_id: 2, hass_entity: "fan.fan"}),
    ...Array.from({length: 24 - 3}, (_, i) => i + 4).map(i => blipButton(i)),
])

console.log(config.synthYaml());
