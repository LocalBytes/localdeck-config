import {VirtualComponent} from "esphome-config-ts/lib/base";
import {MatrixKeypadBinarySensor} from "esphome-config-ts/lib/components/matrix_keypad";
import {PartitionLight} from "esphome-config-ts/lib/components/partition";
import {HomeassistantSensor, HomeassistantTextSensor} from "esphome-config-ts/lib/components/homeassistant";
import {lambda} from "esphome-config-ts/lib/yaml/lambda";


export const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWX";
export const BUTTON_NUMBERS = [
    19, 20, 21, 22, 23, 24,
    13, 14, 15, 16, 17, 18,
    7, 8, 9, 10, 11, 12,
    1, 2, 3, 4, 5, 6,
];

export const lambdaBright = lambda('return (x/255) * id(brightness);');

export interface ConfiguredButtonOptsComponent {
    num: number;

    expose: boolean;
    blip_on_press: boolean;

    ha_entity: string | null;
    toggle: boolean;
    follow_state: boolean;
    follow_brightness: boolean;
    follow_color: boolean;
}

type newConfiguredButtonOptsOpts = Partial<ConfiguredButtonOptsComponent> & Pick<ConfiguredButtonOptsComponent, 'num'>
export const newConfiguredButtonOpts = (opts: newConfiguredButtonOptsOpts): ConfiguredButtonOptsComponent => ({
    num: opts.num,

    expose: opts.expose ?? true,
    blip_on_press: opts.blip_on_press ?? true,

    ha_entity: opts.ha_entity ?? null,
    toggle: opts.toggle ?? true,
    follow_state: opts.toggle ?? true,
    follow_brightness: opts.follow_brightness ?? true,
    follow_color: opts.follow_color ?? true,
});


export interface ConfiguredButtonOpts {
    keyNum: number;
    component: ConfiguredButtonOptsComponent;
    label: ConfiguredButtonOptsLabel;
}

export interface ConfiguredButtonOptsLabel {
    text: string;
    icon: string | null;
    fontSize: number;
}

export class ConfiguredButton extends VirtualComponent<ConfiguredButtonOpts> {
    synth() {

        const c = this.config.component;
        const stack = [];

        let label = "";
        if (this.config.label.text) {
            label = " " + this.config.label.text.replace(/[\n_]+/g, ' ');
        }

        let sensor = new MatrixKeypadBinarySensor({
            id: `keypad_button_${c.num.toString().padStart(2, "0")}`,
            name: `Button ${c.num.toString().padStart(2, "0")}`,
            internal: !c.expose,
            keypad_id: 'keypad',
            key: KEYS[c.num - 1],
            on_press: [],
            on_click: [],
            on_double_click: [],
        });
        stack.push(sensor);

        if (c.expose) {
            stack.push(new PartitionLight({
                id: `keypad_button_${c.num.toString().padStart(2, "0")}_light`,
                name: `Button ${c.num.toString().padStart(2, "0")} Light`,
                // @ts-ignore - Segments expects single light id for some reason
                segments: [{
                    id: "ledstrip",
                    from: c.num - 1,
                    to: c.num - 1,
                }],
            }));
        }


        if (c.ha_entity && c.toggle) {
            let service = "homeassistant.toggle";
            if (c.ha_entity.startsWith("scene.")) {
                service = "scene.turn_on";
            }

            sensor.config.on_press?.push({
                "homeassistant.service": {
                    service: service,
                    data: {entity_id: c.ha_entity}
                }
            });
        }
        if (c.ha_entity && c.follow_state) {
            stack.push(new HomeassistantTextSensor({
                id: `keypad_button_${c.num}_hass`,
                entity_id: c.ha_entity,
                on_value: [{
                    "light.addressable_set": {
                        id: "ledstrip",
                        range_from: c.num - 1,
                        range_to: c.num - 1,
                        red: lambda('return (x == "on")?id(brightness):0;'),
                        green: lambda('return (x == "on")?id(brightness):0;'),
                        blue: lambda('return (x == "on")?id(brightness):0;'),
                        white: lambda('return (x == "on")?id(brightness):0;'),
                    }
                }]
            }));
        } else if (c.blip_on_press) {
            sensor.config.on_press?.push({'script.execute': {id: 'blip_light', led_index: c.num - 1}});
        }

        if (c.ha_entity && c.follow_brightness) {
            stack.push(new HomeassistantSensor({
                id: `keypad_button_${c.num}_hass_brightness`,
                entity_id: c.ha_entity,
                attribute: "brightness",
                on_value: [{
                    "light.addressable_set": {
                        id: "ledstrip",
                        range_from: c.num - 1,
                        range_to: c.num - 1,
                        red: lambdaBright,
                        green: lambdaBright,
                        blue: lambdaBright,
                        white: lambdaBright,
                    }
                }]
            }));
        }

        const lambdaIeee = lambda('return id(wifi_info_mac_address).state;');

        const eventData = {
            "button": c.num.toString(),
            "ieee_address": lambdaIeee,
            "label": this.config.label.text,
        };

        sensor.config.on_multi_click ??= [];
        sensor.config.on_multi_click.push({
            timing: [
                "ON for at most 1s",
                "OFF for at least 0.5s"
            ],
            then: [
                {
                    "homeassistant.event": {
                        "event": "esphome.localdeck_button",
                        "data": {...eventData, "type": "single"},
                    }
                }
            ]
        });
        sensor.config.on_multi_click.push({
            timing: [
                "ON for at most 1s",
                "OFF for at most 0.5s",
                "ON for at most 1s",
            ],
            then: [
                {
                    "homeassistant.event": {
                        "event": "esphome.localdeck_button",
                        "data": {...eventData, "type": "double"},
                    }
                }
            ]
        });

        return stack;
    }

}
