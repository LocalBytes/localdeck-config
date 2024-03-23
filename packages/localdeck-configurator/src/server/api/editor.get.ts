import * as fs from "fs/promises";
import {decompress} from "@localbytes/localdeck-components/src/utils/utils";
import type {PadEditor} from "@localbytes/localdeck-components/src/utils/PadCfg";

export default defineEventHandler(async (event) => {
    const {filesDir} = useRuntimeConfig();
    const {filename} = getQuery(event)
    const content = await fs.readFile(`${filesDir}/${filename}`, "utf8");
    const configMatch = content.match(/configurator\?config=(.*)/)
    const configStr = configMatch ? decodeURIComponent(configMatch[1]) : null;

    return {
        configStr,
        config: configStr ? decompress<PadEditor>(configStr) : null,
        content
    };
});
