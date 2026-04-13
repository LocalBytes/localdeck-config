import * as fs from 'node:fs/promises';
import { FileType, type IndexFile } from '~~/src/utilities/types';
import _ from 'lodash';

function capture(line: string, pattern: RegExp, group = 1): string | null {
  return line.match(pattern)?.[group] ?? null;
}

export default defineEventHandler(async (event) => {
  const { filesDir } = useRuntimeConfig(event) as unknown as { filesDir: string };
  const fileNames = await fs.readdir(filesDir);

  if (!fileNames) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No files found',
    });
  }

  const filesPromise = fileNames
    .filter(filename => filename.endsWith('.yaml') || filename.endsWith('.yml'))
    .map(async (filename) => {
      const path = `${filesDir}/${filename}`;
      const fileHandle = await fs.open(path, 'r');

      let type = FileType.Other;
      let hasConfig = false;
      let name: string | null = null;
      let friendlyName: string | null = null;
      let hasPackage = false;

      for await (const line of fileHandle.readLines()) {
        hasConfig ||= capture(line, /localdeck-configurator\?config=(.*)/) !== null;
        name ??= capture(line, /name: ?("?)(.*)\1/, 2);
        friendlyName ??= capture(line, /friendly_name: ?("?)(.*)\1/, 2);
        hasPackage ||= capture(line, /localbytes.localdeck: github:\/\//) !== null;

        // noinspection PointlessBooleanExpressionJS
        if (hasConfig && name && friendlyName && hasPackage) break;
      }

      await fileHandle.close();

      const resolvedName = friendlyName ?? name ?? filename.replace(/\.ya?ml/, '');

      if (hasPackage) type = FileType.Import;
      if (hasConfig) type = FileType.LocalDeck;

      return { path, filename, type, name: resolvedName } satisfies IndexFile;
    });

  return {
    files: _(await Promise.all(filesPromise))
      .sortBy('type')
      .groupBy('type'),
  };
});
