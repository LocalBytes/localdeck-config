import {Configuration} from "esphome-config-ts/dist/lib/index.js";
import {Esp32, Esp32RmtLedStripLight, Esphome} from "esphome-config-ts/dist/components/index.js";
import {Substitutions} from "@/virtuals/index.js";

const config = new Configuration();


config.updateComponent(new Substitutions({
    name: "localdeck-test",
    friendly_name: "LocalDeck TEST",
}));
config.updateComponent(new Esp32({
    board: "esp32-c3-devkitm-1",
    framework: {
        type: "esp-idf",
        sdkconfig_options: {}
    }
}));

config.updateComponent(new Esphome({
    name: "${name}",
    friendly_name: "${friendly_name}",
    name_add_mac_suffix: true,
    platformio_options: {
        "board_build.flash_mode": "dio",
    },
    on_boot: [
        {
            'light.turn_on': {
                id: 'ledstrip',
                brightness: '25%',
                effect: 'Addressable Rainbow'
            }
        },
    ]
}))

config.addComponent(new Esp32RmtLedStripLight({
    name: "Ledstrip",
    id: "ledstrip",
    rgb_order: "GRB",
    pin: "GPIO8",
    //@ts-expect-error - RMT channel is a string according to the schema
    rmt_channel: 0,
    num_leds: 24,
    chipset: "SK6812",
    restore_mode: "RESTORE_AND_OFF",
    effects: [
        {'addressable_rainbow': {name: "Addressable Rainbow"}},
    ]
}));

console.log(config.synthYaml());
