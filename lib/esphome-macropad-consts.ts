import {lambda} from "esphome-config-ts/dist/lambda.js";

export const PINS_ROWS = [21, 20, 3, 7];
export const PINS_COLS = [0, 1, 10, 4, 5, 6];

export function rgb(r: any, g: any, b: any, w: any = 0) {
    return {red: r, green: g, blue: b, white: w};
}

export const bright = (pct: number) => {
    return lambda(`return ${pct} * id(brightness);`);
}
