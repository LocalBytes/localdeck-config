import * as fs from 'node:fs';
import * as readline from 'node:readline';

import { decompress } from '@localbytes/localdeck-components/src/utils/compression';
import { zPadEditor } from '@localbytes/localdeck-components/src/utils/PadCfg';

export default defineEventHandler(async (event) => {
  const { filesDir } = useRuntimeConfig();
  const { filename } = getQuery(event);
  const content = fs.createReadStream(`${filesDir}/${filename}`, 'utf8');
  const rl = readline.createInterface({ input: content });

  let configStr: null | string = null;

  for await (const line of rl) {
    const configMatch = line.match(/configurator\?config=(.*)/);
    configStr = configMatch ? decodeURIComponent(configMatch[1]) : null;
    if (configStr) break;
  }

  const config = configStr
    ? decompress(configStr, zPadEditor)
    : zPadEditor.parse({});

  config.buttons ??= {};

  return { configStr, config };
});
