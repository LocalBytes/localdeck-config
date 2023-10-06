import {Esphome} from "esphome-config-ts/lib/components/esphome.js";
import {Esp32} from "esphome-config-ts/lib/components/esp32.js";
import {Wifi} from "esphome-config-ts/lib/components/wifi.js";
import {Esp32RmtLedStripLight} from "esphome-config-ts/lib/components/esp32_rmt_led_strip.js";
import {MatrixKeypad} from "esphome-config-ts/lib/components/matrix_keypad.js";
import {GpioBinarySensor} from "esphome-config-ts/lib/components/gpio.js";

import {Configuration} from "esphome-config-ts/lib/config.js";
import {lambda} from "esphome-config-ts/lib/lambda";

import {KEYS} from "./virtuals/follower-button.js";

export const PINS_ROWS = [21, 20, 3, 7];
export const PINS_COLS = [0, 1, 10, 4, 5, 6];

export function rgb(r: any, g: any, b: any, w: any = 0) {
    return {red: r, green: g, blue: b, white: w};
}

export const bright = (pct: number) => {
    return lambda(`return ${pct} * id(brightness);`);
}


function newConfig() {
    const config = new Configuration();

    config.addDefaults();

    config.addComponent(new Esphome({
        name: "macropad",
        build_path: "./.esphome/build",
        platformio_options: {
            "board_build.flash_mode": "dio",
        },
        on_boot: [
            {'light.turn_off': 'ledstrip'}
        ],
    }))
        .addComponent(new Esp32({
            board: "esp32-c3-devkitm-1",
            framework: {
                type: "esp-idf",
                sdkconfig_options: {}
            }
        }))

        .updateComponent(new Wifi({ap: {ssid: "LocalBytes MacroPad"}}))

    let ledstrip = (new Esp32RmtLedStripLight({
        name: "Ledstrip",
        id: "ledstrip",
        rgb_order: "GRB",
        pin: "GPIO8",
        // @ts-ignore
        rmt_channel: 0,
        num_leds: 24,
        chipset: "SK6812",
        restore_mode: "ALWAYS_ON",
        effects: undefined,
    })).addTo(config);

    let keypad = (new MatrixKeypad({
        id: "keypad",
        keys: KEYS,
        rows: PINS_ROWS.map(pin => ({pin: `GPIO${pin}`})),
        columns: PINS_COLS.map(pin => ({pin: `GPIO${pin}`})),
    })).addTo(config);

    config.addComponent([...PINS_COLS, ...PINS_ROWS].map((pin) => new GpioBinarySensor({
        id: `keypad_col_${pin.toString().padStart(2, "0")}`,
        pin: `GPIO${pin}`,
    })));

    return {config, keypad, ledstrip};

}

export default newConfig;
