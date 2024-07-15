import * as fs from 'fs/promises'
import _ from 'lodash'

import { decompress } from '@localbytes/localdeck-components/src/utils/compression'
import type { PadEditor } from '@localbytes/localdeck-components/src/utils/PadCfg'
import { newPadEditor } from '@localbytes/localdeck-components/src/utils/PadCfg'

export default defineEventHandler(async (event) => {
  const { filesDir } = useRuntimeConfig()
  const { filename } = getQuery(event)
  const content = await fs.readFile(`${filesDir}/${filename}`, 'utf8')
  const configMatch = content.match(/configurator\?config=(.*)/)
  const configStr = configMatch ? decodeURIComponent(configMatch[1]) : null

  const config = configStr ? decompress<PadEditor>(configStr) : newPadEditor()

  const matchName = content.match(/name: (.*)/)
  if (matchName) config.title = matchName[1]

  const matchFriendly = content.match(/friendly_name: (.*)/)
  if (matchFriendly) config.title = matchFriendly[1]

  config.buttons = _(config.buttons)
    .sortBy('keyNum')
    .keyBy('keyNum')
    .value()

  return { configStr, config, content }
})
