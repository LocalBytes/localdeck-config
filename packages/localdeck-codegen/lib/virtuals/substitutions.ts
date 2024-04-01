import {BaseComponent} from "esphome-config-ts/lib/base";

//TODO: Move to core
export class Substitutions extends BaseComponent<Record<string, any>> {
    componentName = "substitutions";
}
