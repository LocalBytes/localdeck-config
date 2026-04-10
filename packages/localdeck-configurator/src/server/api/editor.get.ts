import * as fs from 'node:fs/promises';

import { decompress } from '@localbytes/localdeck-components/src/utils/compression';
import { zPadEditor } from '@localbytes/localdeck-components/src/utils/PadCfg';

function capture(line: string, pattern: RegExp, group = 1): string | null {
  return line.match(pattern)?.[group] ?? null;
}

export default defineEventHandler(async (event) => {
  const { filesDir } = useRuntimeConfig();
  const { filename } = getQuery(event);
  const file = await fs.open(`${filesDir}/${filename}`, 'r');

  let encodedConfig: string | null = null;
  let name: string | null = null;
  let friendlyName: string | null = null;

  for await (const line of file.readLines()) {
    encodedConfig ??= capture(line, /localdeck-configurator\?config=(.*)/);
    name ??= capture(line, /name: ?("?)(.*)\1/, 2);
    friendlyName ??= capture(line, /friendly_name: ?("?)(.*)\1/, 2);

    // noinspection PointlessBooleanExpressionJS
    if (encodedConfig) break;
  }
  await file.close();

  const configStr = encodedConfig ? decodeURIComponent(encodedConfig) : null;

  const config = configStr
    ? decompress(configStr, zPadEditor)
    : zPadEditor.parse({});

  config.title = friendlyName ?? name ?? config.title ?? 'My LocalDeck';
  config.buttons ??= {};

  return { configStr, config };
});
