import {
    BUTTON_NUMBERS,
    type ConfigurdButtonOpts,
    newConfiguredButtonOpts
} from "@localbytes/macropad-codegen/lib/virtuals/configured-button";

export interface PadEditor {
    title: string;
    buttons: ConfigurdButtonOpts[];
}

export type EditContainer = ConfigurdButtonOpts;

export const newPadEditor = (): PadEditor => ({
    title: "Macropad",
    buttons: BUTTON_NUMBERS.map(num => ({
        keyNum: num,
        component: newConfiguredButtonOpts({num}),
        label: {
            icon: "",
            text: "",
            fontSize: 12
        }
    }))
});


