import {EsphomeComponent} from "esphome-config-ts/dist/lib/index.js";

//TODO: Move to core

export class Substitutions extends EsphomeComponent<Record<string, string | number>> {
    componentName = "substitutions";
}
