import { VirtualComponent } from 'esphome-config-ts';
import { GlobalsPlatform, TemplateNumber } from 'esphome-config-ts/components';
import { lambda } from 'esphome-config-ts/yaml';

interface SliderNumberOpts {
  id: string;
  min: string;
  max: string;
  step: string;
  initial_value: string;
  name: string;
  type: string;
  restore_value?: boolean;
}

export class SliderNumber extends VirtualComponent<SliderNumberOpts> {
  synth(): (GlobalsPlatform | TemplateNumber)[] {
    return [
      new GlobalsPlatform({
        id: this.config.id,
        type: this.config.type,
        initial_value: this.config.initial_value,
        restore_value: this.config.restore_value ?? true,
      }),
      new TemplateNumber({
        name: 'Brightness',
        set_action: [
          { 'globals.set': { id: this.config.id, value: lambda('return x;') } },
        ],
        max_value: this.config.max, min_value: this.config.min, step: this.config.step,
        lambda: lambda('return id(brightness);'),
      }),
    ];
  }
}
