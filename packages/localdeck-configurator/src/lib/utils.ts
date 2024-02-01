import pako from "pako";
import type {PadEditor} from "~/lib/PadCfg";

export function encode(uint8array: Uint8Array) {
    const output = [];
    for (let i = 0, {length} = uint8array; i < length; i++) {
        output.push(String.fromCharCode(uint8array[i]));
    }
    return btoa(output.join(''));
}

export function decode(encoded: string) {
    const chars = atob(encoded);
    return Uint8Array.from(chars, c => c.charCodeAt(0));
}


export function compress<T extends {}>(editor: T) {
    const deflated = pako.deflate(JSON.stringify(editor));
    return encode(deflated);
}

export function decompress<T extends {}>(chars: string) {
    const deflated = decode(chars);
    const inflated = pako.inflate(deflated, {to: 'string'});
    return JSON.parse(inflated) as T;
}

export function getEditorUrl(editor: PadEditor, printmode: boolean = false) {
    return `https://feature-lb-32-firmware-confi.localbytes-blog.pages.dev/tools/localdeck-configurator${printmode ? '-print' : ''}?config=${encodeURIComponent(compress(editor))}`
}
