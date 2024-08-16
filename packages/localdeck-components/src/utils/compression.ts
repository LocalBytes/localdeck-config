import pako from 'pako';
import type { z } from 'zod';

export function encode(uint8array: Uint8Array) {
  const output = [];
  for (let i = 0, { length } = uint8array; i < length; i++) {
    output.push(String.fromCharCode(uint8array[i]));
  }
  return btoa(output.join(''));
}

export function decode(encoded: string) {
  const chars = atob(encoded);
  return Uint8Array.from(chars, c => c.charCodeAt(0));
}

export function compress<T extends object>(editor: T) {
  const deflated = pako.deflate(JSON.stringify(editor));
  return encode(deflated);
}

export function decompress<T extends z.ZodTypeAny>(
  chars: string, schema?: T,
): T extends z.ZodTypeAny ? z.infer<T> : object {
  const deflated = decode(chars);
  const inflated = pako.inflate(deflated, { to: 'string' });
  const parsed = JSON.parse(inflated);
  console.log({ parsed });
  return schema ? schema.parse(parsed) as z.infer<T> : parsed;
}

export function getEditorUrl(editor: object, printmode: boolean = false) {
  return `https://blog.mylocalbytes.com/tools/localdeck-configurator?config=${encodeURIComponent(compress(editor))}${printmode ? '&print=1' : ''}`;
}
