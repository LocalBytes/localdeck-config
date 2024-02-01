import {Esphome} from "esphome-config-ts/lib/components/esphome.js";
import {Esp32} from "esphome-config-ts/lib/components/esp32.js";
import {Wifi} from "esphome-config-ts/lib/components/wifi.js";
import {Esp32RmtLedStripLight} from "esphome-config-ts/lib/components/esp32_rmt_led_strip.js";
import {MatrixKeypad} from "esphome-config-ts/lib/components/matrix_keypad.js";
import {GpioBinarySensor} from "esphome-config-ts/lib/components/gpio.js";
import {Esp32Improv} from "esphome-config-ts/lib/components/esp32_improv.js";

import {Configuration} from "esphome-config-ts/lib/config.js";

import {KEYS} from "./virtuals/follower-button.js";
import {Script} from "esphome-config-ts/lib/components/script";
import {SliderNumber} from "./virtuals/slider-number";
import {WifiInfoTextSensor} from "esphome-config-ts/lib/components/wifi_info";
import {secret} from "esphome-config-ts/lib/yaml/secret.js";
import {lambda} from "esphome-config-ts/lib/yaml/lambda.js";

export const PINS_ROWS = [21, 20, 3, 7];
export const PINS_COLS = [0, 1, 10, 4, 5, 6];

export function rgb(r: any, g: any, b: any, w: any = 0) {
    return {red: r, green: g, blue: b, white: w};
}

export const bright = (pct: number) => {
    return lambda(`return ${pct} * id(brightness);`);
}

export interface newConfigOpts {
    withDefaults?: boolean;
    stopBeforeCustom?: boolean;
}

function makePin(pin: number) {
    return {
        pin: {
            number: `GPIO${pin}`,
            allow_other_uses: true,
            // mode: {
            //     input: true,
            //     pullup: true,
            // },
        },
    }
}

function newConfig(opts: newConfigOpts = {
    withDefaults: true,
    stopBeforeCustom: false
}) {
    const config = new Configuration();

    if (opts.withDefaults) {

        config.addDefaults();

        // @ts-ignore
        config.updateComponent(new Esphome({
            name: "localdeck",
            platformio_options: {
                "board_build.flash_mode": "dio",
            },
            on_boot: [
                {'light.turn_off': 'ledstrip'}
            ]
        }))
            .updateComponent(new Esp32({
                board: "esp32-c3-devkitm-1",
                framework: {
                    type: "esp-idf",
                    sdkconfig_options: {}
                }
            }))

            .updateComponent(new Wifi({
                ssid: secret("wifi_ssid"),
                password: secret("wifi_password"),
                ap: {ssid: "LocalBytes localdeck"}
            }))
            .updateComponent(new Esp32Improv({
                //@ts-ignore
                authorizer: false,
            }))

    }

    if (opts.stopBeforeCustom) {
        return {config};
    }

    config.addComponent(new WifiInfoTextSensor({
        mac_address: {
            id: "wifi_info_mac_address",
        }
    }));

    let ledstrip = (new Esp32RmtLedStripLight({
        name: "Ledstrip",
        id: "ledstrip",
        rgb_order: "GRB",
        pin: "GPIO8",
        // @ts-ignore
        rmt_channel: 0,
        num_leds: 24,
        chipset: "SK6812",
        restore_mode: "RESTORE_AND_OFF",
        effects: undefined,
    })).addTo(config);

    let keypad = (new MatrixKeypad({
        id: "keypad",
        keys: KEYS,
        //@ts-ignore
        rows: PINS_ROWS.map(pin => makePin(pin)),
        //@ts-ignore
        columns: PINS_COLS.map(pin => makePin(pin)),
    })).addTo(config);

    config.addComponent([
        ...PINS_COLS,
        ...PINS_ROWS
    ].map((pin) => new GpioBinarySensor({
        id: `keypad_col_${pin.toString().padStart(2, "0")}`,
        // @ts-ignore
        pin: {
            number: `GPIO${pin}`,
            allow_other_uses: true
        },
    })));

    const blip_light = ((new Script({
        id: "blip_light",
        parameters: {led_index: 'int'},
        mode: "parallel",
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

    }))).addTo(config);

    const brightness = (new SliderNumber({
        id: "brightness",
        name: "Brightness",
        min: "0",
        max: "1",
        step: "0.01",
        initial_value: "1",
        type: "float"
    })).addTo(config);

    return {config, keypad, ledstrip, blip_light, brightness};
}


export default newConfig;
