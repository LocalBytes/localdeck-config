import * as fs from "fs/promises";


export interface IndexFile {
    path: string,
    filename: string,
    islocaldeck: boolean,
}

export default defineEventHandler(async (event) => {
    const {filesDir} = useRuntimeConfig();
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
            const islocaldeck = content.includes("localdeck Configurator");

            return {path, filename: filename, islocaldeck} satisfies IndexFile;
        });

    const files = (await Promise.all(filesPromise))
        .sort((a, b) =>
            a.islocaldeck !== b.islocaldeck
                ? (a.islocaldeck ? -1 : 1)
                : a.filename.localeCompare(b.filename));

    return {files};
});
