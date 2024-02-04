import {
    BUTTON_NUMBERS,
    type ConfiguredButtonOpts,
    newConfiguredButtonOpts
} from "@localbytes/localdeck-codegen/lib/virtuals/configured-button";
import {DeepPartial} from "~/lib/types";

export interface PadEditor {
    title: string;
    buttons: ConfiguredButtonOpts[];
}

export type EditContainer = ConfiguredButtonOpts;

export const newButton = (
    num: number,
    options: DeepPartial<EditContainer> = {}
): EditContainer => Object.assign({
    keyNum: num,
    component: newConfiguredButtonOpts({num}),
    label: {icon: "", text: "", fontSize: 12}
}, options);

export const newPadEditor = (): PadEditor => ({
    title: "LocalDeck",
    buttons: BUTTON_NUMBERS.map(num => newButton(num))
});
