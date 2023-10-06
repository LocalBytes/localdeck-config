import {Configuration} from "esphome-config-ts/dist/config.js";
import {Esphome} from "esphome-config-ts/dist/components/esphome.js";
import {Esp32} from "esphome-config-ts/dist/components/esp32.js";
import {Wifi} from "esphome-config-ts/dist/components/wifi.js";
import {Esp32RmtLedStripLight} from "esphome-config-ts/dist/components/esp32_rmt_led_strip.js";
import {MatrixKeypad, MatrixKeypadBinarySensor} from "esphome-config-ts/dist/components/matrix_keypad.js";
import {GpioBinarySensor} from "esphome-config-ts/dist/components/gpio.js";
import {Script} from "esphome-config-ts/dist/components/script.js";
import {lambda} from "esphome-config-ts/dist/lambda.js";

import {FollowerButton, KEYS} from "./followerButton.js";
import {PINS_COLS, PINS_ROWS} from "./esphome-macropad-consts.js";

let config = new Configuration();

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

config.addComponent(new Esp32({
    board: "esp32-c3-devkitm-1",
    framework: {
        type: "esp-idf",
        sdkconfig_options: {}
    }
}));

config.updateComponent(new Wifi({
    ap: {ssid: "LocalBytes MacroPad"}
}))

let ledstrip = new Esp32RmtLedStripLight({
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
})
config.addComponent(ledstrip);

let keypad = new MatrixKeypad({
    id: "keypad",
    keys: KEYS,
    rows: PINS_ROWS.map(pin => ({pin: `GPIO${pin}`})),
    columns: PINS_COLS.map(pin => ({pin: `GPIO${pin}`})),
});
config.addComponent(keypad);

config.addComponent([...PINS_COLS,...PINS_ROWS].map((pin) => new GpioBinarySensor({
    id: `keypad_col_${pin.toString().padStart(2, "0")}`,
    pin: `GPIO${pin}`,
})));


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
        keypad_id: keypad.config.id,
        key: KEYS[idx],
        // on_click: [
        on_press: [
            {'script.execute': {id: 'blip_light', led_index: idx}},
        ]
    }))
}
console.log(config.synthYaml());
