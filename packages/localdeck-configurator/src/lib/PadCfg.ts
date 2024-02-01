import {
    BUTTON_NUMBERS,
    type ConfiguredButtonOpts,
    newConfiguredButtonOpts
} from "@localbytes/localdeck-codegen/lib/virtuals/configured-button";

export interface PadEditor {
    title: string;
    buttons: ConfiguredButtonOpts[];
}

export type EditContainer = ConfiguredButtonOpts;

export const newPadEditor = (): PadEditor => ({
    title: "localdeck",
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


