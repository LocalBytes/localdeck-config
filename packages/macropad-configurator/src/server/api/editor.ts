import * as fs from "fs/promises";
import {decompress} from "~/lib/utils";

export default defineEventHandler(async (event) => {
    const {filesDir} = useRuntimeConfig(event);
    const {filename} = getQuery(event,)
    const content = await fs.readFile(`${filesDir}/${filename}`, "utf8");
    const configMatch = content.match(/configurator\?config=(.*)/)
    const configStr = configMatch ? decodeURIComponent(configMatch[1]) : null;

    return {
        configStr,
        config: configStr ? decompress(configStr) : null,
        content
    }
});
