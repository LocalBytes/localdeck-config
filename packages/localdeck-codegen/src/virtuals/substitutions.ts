import {EsphomeComponent} from "esphome-config-ts/dist/lib";

//TODO: Move to core

export class Substitutions extends EsphomeComponent<Record<string, any>> {
    componentName = "substitutions";
}
