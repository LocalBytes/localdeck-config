import {Configuration} from "esphome-config-ts/dist/lib/index.js";
import {lambda} from "esphome-config-ts/dist/yaml/index.js";
import {KEYS, SliderNumber, Substitutions} from "@/virtuals/index.js";
import {
    Esp32,
    Esp32Improv,
    Esp32RmtLedStripLight,
    Esphome,
    ImprovSerial,
    MatrixKeypad,
    TemplateOutput,
    Wifi,
    WifiInfoTextSensor
} from "esphome-config-ts/dist/components/index.js";
import {scriptBlipLight, scriptSetLedRgb} from "@/scripts/index.js";

export const PINS_ROWS = [21, 20, 3, 7];
export const PINS_COLS = [0, 1, 10, 4, 5, 6];

export interface newConfigOpts {
    withDefaults?: boolean;
    stopBeforeCustom?: boolean;
}


function newConfig(opts: newConfigOpts = {
    withDefaults: true,
    stopBeforeCustom: false
}) {
    const config = new Configuration();

    if (opts.withDefaults) {

        config.addDefaults();
        config.updateComponent(new Substitutions({
            name: "localdeck",
            friendly_name: "LocalBytes LocalDeck",
        }));

        //@ts-expect-error - Build Path is claiming to be required, but it is not
        config.updateComponent(new Esphome({
            name: "${name}",
            friendly_name: "${friendly_name}",
            name_add_mac_suffix: false,
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
                {'delay': '5s'},
                {'light.turn_off': {id: 'ledstrip'}}
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
                ap: {ssid: "${friendly_name}"}
            }))
            .updateComponent(new TemplateOutput({
                id: "improv_status",
                type: "binary",
                write_action: [
                    {
                        'light.control': {
                            id: 'keypad_button_01_light',
                            state: lambda('return state;')
                        }
                    }
                ]
            }))
            .updateComponent(new Esp32Improv({
                status_indicator: "improv_status",
                authorizer: "keypad_button_01",
            }))
            .updateComponent(new ImprovSerial({}));

    }

    if (opts.stopBeforeCustom) {
        return {config};
    }

    config.addComponent(new WifiInfoTextSensor({
        mac_address: {
            id: "wifi_info_mac_address",
        }
    }));

    const ledstrip = (new Esp32RmtLedStripLight({
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
    })).addTo(config);

    const keypad = (new MatrixKeypad({
        id: "keypad",
        keys: KEYS,
        rows: PINS_ROWS.map(pin => ({pin:`GPIO${pin}`})),
        // @ts-expect-error - Pin doesn't allow object yet
        columns: PINS_COLS.map(pin => ({
            pin: {
                number: `GPIO${pin}`,
                drive_strength: "5mA",
            }
        })),
    })).addTo(config);

    config.addComponent([
        scriptBlipLight,
        scriptSetLedRgb
    ])

    const brightness = (new SliderNumber({
        id: "brightness",
        name: "Brightness",
        min: "0",
        max: "1",
        step: "0.01",
        initial_value: "1",
        type: "float"
    })).addTo(config);

    return {config, keypad, ledstrip, brightness};
}


export default newConfig;
