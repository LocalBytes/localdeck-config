import {BaseComponent, VirtualComponent} from "esphome-config-ts/dist/base.js";
import {Globals} from "esphome-config-ts/dist/components/globals.js";
import {TemplateNumber} from "esphome-config-ts/dist/components/template.js";
import {lambda} from "esphome-config-ts/dist/lambda.js";

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

    synth(): Array<BaseComponent | VirtualComponent> {
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
