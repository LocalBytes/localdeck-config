import * as fs from 'node:fs';
import * as readline from 'node:readline';

import { decompress } from '@localbytes/localdeck-components/src/utils/compression';
import { zPadEditor } from '@localbytes/localdeck-components/src/utils/PadCfg';

export default defineEventHandler(async (event) => {
  const { filesDir } = useRuntimeConfig();
  const { filename } = getQuery(event);
  const content = fs.createReadStream(`${filesDir}/${filename}`, 'utf8');
  const rl = readline.createInterface({ input: content, crlfDelay: Infinity });

  let configMatch = null;
  let matchName = null;
  let matchFriendly = null;

  for await (const line of rl) {
    configMatch ??= line.match(/localdeck-configurator\?config=(.*)/);
    matchName ??= line.match(/name: "?(.*)"?/);
    matchFriendly ??= line.match(/friendly_name: "?(.*)"?/);

    // noinspection PointlessBooleanExpressionJS
    if (configMatch) break;
  }

  const configStr = configMatch ? decodeURIComponent(configMatch[1]) : null;

  const config = configStr
    ? decompress(configStr, zPadEditor)
    : zPadEditor.parse({});

  config.title = matchFriendly?.[1] ?? matchName?.[1] ?? config.title ?? 'My LocalDeck';
  config.buttons ??= {};

  return { configStr, config };
});
