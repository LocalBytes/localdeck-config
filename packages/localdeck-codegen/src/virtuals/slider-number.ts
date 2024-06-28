import {VirtualComponent} from "esphome-config-ts/dist/lib/index.js";
import {Globals, TemplateNumber} from "esphome-config-ts/dist/components/index.js";
import {lambda} from "esphome-config-ts/dist/yaml/index.js";


type SliderNumberOpts = {
    id: string,
    min: string,
    max: string,
    step: string,
    initial_value: string,
    name: string,
    type: string,
    restore_value?: boolean;
};

export class SliderNumber extends VirtualComponent<SliderNumberOpts> {

    synth() {
        return [
            new Globals({
                id: this.config.id,
                type: this.config.type,
                initial_value: this.config.initial_value.toString(),
                restore_value: this.config.restore_value ?? true,
            }),
            new TemplateNumber({
                name: "Brightness",
                set_action: [
                    {'globals.set': {id: this.config.id, value: lambda('return x;')}},
                ],
                max_value: this.config.max, min_value: this.config.min, step: this.config.step,
                lambda: lambda('return id(brightness);'),
            })
        ];
    }
}
