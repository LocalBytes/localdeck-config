import {VirtualComponent} from "esphome-config-ts/dist/lib/index.js";
import {
    HomeassistantSensor,
    HomeassistantTextSensor,
    MatrixKeypadBinarySensor,
    PartitionLight
} from "esphome-config-ts/dist/components/index.js";
import {lambda} from "esphome-config-ts/dist/yaml/index.js";
import {z} from "zod";

export const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWX";
export const BUTTON_NUMBERS = [
    19, 20, 21, 22, 23, 24,
    13, 14, 15, 16, 17, 18,
    7, 8, 9, 10, 11, 12,
    1, 2, 3, 4, 5, 6,
];

export const zButtonNumber = z.coerce.number().min(1).max(24);

export const zConfiguredButtonOptsComponent = z.object({
    num: zButtonNumber,
    expose: z.boolean().default(true),
    blip_on_press: z.boolean().default(true),
    ha_entity: z.string().default(""),
    toggle: z.boolean().default(true),
    follow_state: z.boolean().default(true),
    follow_brightness: z.boolean().default(true),
    follow_color: z.boolean().default(true),
});

export const zConfiguredButtonOptsLabel = z.object({
    text: z.string().default(""),
    icon: z.string().default(""),
    fontSize: z.coerce.number().default(12),
});

export type ConfiguredButtonOptsLabel = z.infer<typeof zConfiguredButtonOptsLabel>;

export const zConfiguredButtonOpts = z.object({
    keyNum: zButtonNumber,
    component: zConfiguredButtonOptsComponent,
    label: zConfiguredButtonOptsLabel,
});

export type ConfiguredButtonOpts = z.infer<typeof zConfiguredButtonOpts>;

export class ConfiguredButton extends VirtualComponent<ConfiguredButtonOpts> {
    synth() {
        const c = this.config.component;
        const stack = [];

        const sensor = new MatrixKeypadBinarySensor({
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

        const lightId = `keypad_button_${c.num.toString().padStart(2, "0")}_light`;
        const lightName = `Button ${c.num.toString().padStart(2, "0")} Light`;
        stack.push(new PartitionLight({
            id: lightId,
            name: lightName,
            internal: !c.expose,
            // @ts-expect-error - Segments expects single light id for some reason
            segments: [{
                id: "ledstrip",
                from: c.num - 1,
                to: c.num - 1,
            }],
            effects: [
                {pulse: {}},
                {
                    pulse: {
                        name: "Fast Pulse",
                        transition_length: "0.5s",
                        update_interval: "0.5s",
                        min_brightness: 0,
                        max_brightness: 1,
                    }
                }, {
                    pulse: {
                        name: "Slow Pulse",
                        update_interval: "2s",
                    }
                },
                {random: {}},
                {flicker: {}},

            ],
        }));


        if (c.ha_entity && c.toggle) {
            let service = "homeassistant.toggle";
            if (c.ha_entity.startsWith("scene.")) {
                service = "scene.turn_on";
            }

            sensor.config.on_press?.push({
                "homeassistant.service": {service: service, data: {entity_id: c.ha_entity}}
            });
        }
        if (c.ha_entity && c.follow_state) {
            stack.push(new HomeassistantTextSensor({
                id: `keypad_button_${c.num}_hass`,
                entity_id: c.ha_entity,
                on_value: [{"light.control": {id: lightId, state: lambda('return x == "on";')}}]
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
                    "light.control": {
                        id: lightId,
                        brightness: lambda('if (x>=0) return (x/255) * id(brightness); else return 0;'),
                    }
                }]
            }));
        }

        if (c.ha_entity && c.follow_color) {
            stack.push(new HomeassistantTextSensor({
                id: `keypad_button_${c.num}_hass_color`,
                entity_id: c.ha_entity,
                attribute: "rgb_color",
                on_value: [{
                    "script.execute": {
                        id: "set_led_rgb",
                        color: lambda('return x;'),
                        entity: lightName.split(" ").join("_").toLowerCase(),
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
            then: [{
                "homeassistant.event": {
                    "event": "esphome.localdeck_button",
                    "data": {...eventData, "type": "single"},
                }
            }]
        });
        sensor.config.on_multi_click.push({
            timing: [
                "ON for at most 1s",
                "OFF for at most 0.5s",
                "ON for at most 1s",
            ],
            then: [{
                "homeassistant.event": {
                    "event": "esphome.localdeck_button",
                    "data": {...eventData, "type": "double"},
                }
            }]
        });

        return stack;
    }

}
