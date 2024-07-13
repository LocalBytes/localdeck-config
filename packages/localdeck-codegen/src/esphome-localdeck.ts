import {Configuration} from "esphome-config-ts/dist/lib/index.js";
import {lambda} from "esphome-config-ts/dist/yaml/index.js";
import {KEYS, SliderNumber, Substitutions} from "@/virtuals/index.js";
import {
    Esp32,
    Esp32Improv,
    Esp32RmtLedStripLight,
    Esphome,
    GpioBinarySensor,
    ImprovSerial,
    MatrixKeypad,
    Script,
    TemplateOutput,
    Wifi,
    WifiInfoTextSensor
} from "esphome-config-ts/dist/components/index.js";

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
    return {pin: {number: `GPIO${pin}`, allow_other_uses: true,}};
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

        // @ts-ignore
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

    let ledstrip = (new Esp32RmtLedStripLight({
        name: "Ledstrip",
        id: "ledstrip",
        rgb_order: "GRB",
        pin: "GPIO8",
        //@ts-ignore
        rmt_channel: 0,
        num_leds: 24,
        chipset: "SK6812",
        restore_mode: "RESTORE_AND_OFF",
        effects: [
            {'addressable_rainbow': {name: "Addressable Rainbow"}},
        ]
    })).addTo(config);

    let keypad = (new MatrixKeypad({
        id: "keypad",
        keys: KEYS,
        //@ts-ignore
        rows: PINS_ROWS.map(pin => ({pin: {number: `GPIO${pin}`, allow_other_uses: true}})),
        columns: PINS_COLS.map(pin => ({pin: `GPIO${pin}`})),
    })).addTo(config);

    config.addComponent([
        ...PINS_ROWS
    ].map((pin) => new GpioBinarySensor({
        id: `keypad_row_${pin.toString().padStart(2, "0")}`,
        //@ts-ignore
        pin: {number: `GPIO${pin}`, allow_other_uses: true,},
    })));

    const blip_light = ((new Script({
        id: "blip_light",
        parameters: {led_index: 'int'},
        mode: "parallel",
        then:
            Array.from({length: 20}, (_, i) => i)
                .map(i => Math.max(100 - (i * 5), 0))
                .flatMap(brightness => [{
                    'light.addressable_set': {
                        id: ledstrip.config.id,
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
    }))).addTo(config);

    ((new Script({
        id: "set_led_rgb",
        parameters: {led_index: 'int', color: 'string'},
        mode: "queued",
        then: [{
            lambda: `ESP_LOGD("set_led_rgb", "Index %d, Input: %s", led_index, color.c_str());

int firstComma = color.find(',');
int secondComma = color.find(',', firstComma + 1);

ESP_LOGD("set_led_rgb", "Commas are: %d, %d", firstComma, secondComma);

auto rs = color.substr(1, firstComma);
auto gs = color.substr(firstComma + 1, secondComma);
auto bs = color.substr(secondComma + 1, color.length() - 1);

ESP_LOGD("set_led_rgb", "%s-%s-%s", rs.c_str(), gs.c_str(), bs.c_str());
ESP_LOGD("set_led_rgb", "%d, %d, %d", stoi(rs), stoi(gs), stoi(bs));

auto light = ((AddressableLight*)id(ledstrip).get_output());
light->get(led_index).set(Color(stoi(rs), stoi(gs), stoi(bs)));
light->schedule_show();
`
        }]
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
