import * as fs from "fs/promises";
import _ from "lodash";
import {FileType, type IndexFile} from "~/utilities/types";


export default defineEventHandler(async (event) => {
    const {filesDir} = useRuntimeConfig(event) as unknown as { filesDir: string };
    const fileNames = await fs.readdir(filesDir)

    if (!fileNames) {
        throw createError({
            statusCode: 400,
            statusMessage: "No files found",
        });
    }

    const filesPromise = fileNames
        .filter((filename) => filename.endsWith(".yaml") || filename.endsWith(".yml"))
        .map(async (filename) => {
            const path = `${filesDir}/${filename}`;
            const content = await fs.readFile(path, "utf8");
            let name = filename
                .replace(".yaml", "")
                .replace(".yml", "");

            let type = FileType.Other;

            if (
                content.includes("packages:")
                && content.includes("localbytes.localdeck")
            ) type = FileType.Import;

            if (content.includes("localdeck-configurator?config=")) type = FileType.LocalDeck;

            const matchName = content.match(/name: (.*)/);
            if (matchName) name = matchName[1];
            const matchFriendly = content.match(/friendly_name: (.*)/);
            if (matchFriendly) name = matchFriendly[1];

            return {path, filename, type, name} satisfies IndexFile;
        });


    return {
        files: _(await Promise.all(filesPromise))
            .sortBy("type")
            .groupBy("type"),
    }

});

