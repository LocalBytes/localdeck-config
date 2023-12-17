import {VirtualComponent} from "esphome-config-ts/lib/base";
import {lambda} from "esphome-config-ts/lib/lambda";
import {HomeassistantSensor, HomeassistantTextSensor} from "esphome-config-ts/lib/components/homeassistant";
import {MatrixKeypadBinarySensor} from "esphome-config-ts/lib/components/matrix_keypad";

export const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWX";

export class FollowerButton extends VirtualComponent<{
    id: string;
    keypad_id: string;
    ledstrip_id: string;
    hass_entity: string;
    button_id: number;
}> {
    synth() {
        let lambdaBright = lambda('return (x/255) * id(brightness);');


        return [
            new HomeassistantTextSensor({
                id: `${this.config.id}_hass`,
                entity_id: this.config.hass_entity,
                on_value: [{
                    "light.addressable_set": {
                        id: this.config.ledstrip_id,
                        range_from: this.config.button_id,
                        range_to: this.config.button_id,
                        red: lambda('return (x == "on")?id(brightness):0;'),
                        green: lambda('return (x == "on")?id(brightness):0;'),
                        blue: lambda('return (x == "on")?id(brightness):0;'),
                    }
                }]
            }),
            new HomeassistantSensor({
                id: `${this.config.id}_hass_brightness`,
                entity_id: this.config.hass_entity,
                attribute: "brightness",
                on_value: [{
                    "light.addressable_set": {
                        id: this.config.ledstrip_id,
                        range_from: this.config.button_id,
                        range_to: this.config.button_id,
                        red: lambdaBright,
                        green: lambdaBright,
                        blue: lambdaBright,
                    }
                }]
            }),
            new MatrixKeypadBinarySensor({
                id: `${this.config.id}_bs`,
                keypad_id: this.config.keypad_id,
                key: KEYS[this.config.button_id],
                on_click: [{
                    "homeassistant.service": {
                        service: "homeassistant.toggle",
                        data: {
                            entity_id: this.config.hass_entity,
                        }
                    }
                }]
            })
        ]
    }
}
