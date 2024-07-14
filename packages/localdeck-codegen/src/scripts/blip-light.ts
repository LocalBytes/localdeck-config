import {Script} from "esphome-config-ts/dist/components/index.js";
import {lambda} from "esphome-config-ts/dist/yaml/index.js";

const fadeOut = Array.from({length: 20}, (_, i) => i)
    .map(i => Math.max(100 - (i * 5), 0))
    .flatMap(brightness => [{
        'light.addressable_set': {
            id: "ledstrip",
            range_from: lambda('return led_index;'),
            range_to: lambda('return led_index;'),
            red: `${brightness}%`,
            green: `${brightness}%`,
            blue: `${brightness}%`,
            white: `${brightness}%`
        },
    }, {
        'delay': '25ms'
    }])

export const scriptBlipLight = new Script({
    id: "blip_light",
    parameters: {led_index: 'int'},
    mode: "parallel",
    then: fadeOut
});
