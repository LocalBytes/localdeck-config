import * as fs from 'fs/promises';

import { decompress } from '@localbytes/localdeck-components/src/utils/compression';

export default defineEventHandler(async (event) => {
  const { filesDir } = useRuntimeConfig();
  const { filename } = getQuery(event);
  const content = await fs.readFile(`${filesDir}/${filename}`, 'utf8');
  const configMatch = content.match(/configurator\?config=(.*)/);
  const configStr = configMatch ? decodeURIComponent(configMatch[1]) : null;

  const config = configStr
    ? decompress(configStr, zPadEditor)
    : { title: 'LocalDeck', buttons: {} };

  const matchName = content.match(/name: (.*)/);
  if (matchName) config.title = matchName[1];

  const matchFriendly = content.match(/friendly_name: (.*)/);
  if (matchFriendly) config.title = matchFriendly[1];

  config.buttons ??= {};

  return { configStr, config, content };
});
