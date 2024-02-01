import {VirtualComponent} from "esphome-config-ts/lib/base";
import {Globals} from "esphome-config-ts/lib/components/globals";
import {TemplateNumber} from "esphome-config-ts/lib/components/template";
import {lambda} from "esphome-config-ts/lib/yaml/lambda";

export class SliderNumber extends VirtualComponent<
    {
        id: string,
        min: string,
        max: string,
        step: string,
        initial_value: string,
        name: string,
        type: string,
        restore_value?: boolean;
    }
> {

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
