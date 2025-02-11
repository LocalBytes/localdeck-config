import * as fs from 'node:fs/promises';

import { decompress } from '@localbytes/localdeck-components/src/utils/compression';
import { zPadEditor } from '@localbytes/localdeck-components/src/utils/PadCfg';

export default defineEventHandler(async (event) => {
  const { filesDir } = useRuntimeConfig();
  const { filename } = getQuery(event);
  const file = await fs.open(`${filesDir}/${filename}`, 'r');

  let configMatch = null;
  let matchName = null;
  let matchFriendly = null;

  for await (const line of file.readLines()) {
    configMatch ??= line.match(/localdeck-configurator\?config=(.*)/);
    matchName ??= line.match(/name: ?("?)(.*)\1/);
    matchFriendly ??= line.match(/friendly_name: ?("?)(.*)\1/);

    // noinspection PointlessBooleanExpressionJS
    if (configMatch) break;
  }

  const configStr = configMatch ? decodeURIComponent(configMatch[1]) : null;

  const config = configStr
    ? decompress(configStr, zPadEditor)
    : zPadEditor.parse({});

  config.title = matchFriendly?.[2] ?? matchName?.[2] ?? config.title ?? 'My LocalDeck';
  config.buttons ??= {};

  return { configStr, config };
});
