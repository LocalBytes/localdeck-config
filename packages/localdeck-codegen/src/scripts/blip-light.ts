import {Script} from "esphome-config-ts/dist/components/index.js";
import {lambda} from "esphome-config-ts/dist/yaml/index.js";

// How many steps to take when dimming the lights
const iterations = '20';

// Brightness calculation. Note "iteration" is a counter the repeat action provides.
// https://esphome.io/automations/actions.html#repeat-action
const brightness = lambda(`return 1.0 - ((float)iteration / ${iterations});`);

export const scriptBlipLight = new Script({
    id: "blip_light",
    parameters: { led_index: 'int' },
    mode: "parallel",
    then: [{
        'repeat': {
            'count': iterations,
            'then': [{
                'light.addressable_set': {
                    id: "ledstrip",
                    range_from: lambda('return led_index;'),
                    range_to: lambda('return led_index;'),
                    red: brightness,
                    green: brightness,
                    blue: brightness,
                    white: brightness,
                },
            }, {
                'delay': '25ms'
            }]
        }
    }]
});
