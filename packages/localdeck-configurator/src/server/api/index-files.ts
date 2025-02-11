import * as fs from 'node:fs/promises';
import _ from 'lodash';
import { FileType, type IndexFile } from '~/utilities/types';

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
      let matchConfig: RegExpMatchArray | null = null;
      let matchName: RegExpMatchArray | null = null;
      let matchFriendly: RegExpMatchArray | null = null;
      let matchPackage: RegExpMatchArray | null = null;

      for await (const line of fileHandle.readLines()) {
        matchConfig ??= line.match(/localdeck-configurator\?config=(.*)/);
        matchName ??= line.match(/name: ?("?)(.*)\1/);
        matchFriendly ??= line.match(/friendly_name: ?("?)(.*)\1/);
        matchPackage ??= line.match(/localbytes.localdeck: github:\/\//);

        // noinspection PointlessBooleanExpressionJS
        if (matchConfig && matchName && matchFriendly && matchPackage) break;
      }

      const name = matchFriendly?.[2] ?? matchName?.[2] ?? (filename.replace(/\.ya?ml/, ''));
      if (matchPackage) type = FileType.Import;
      if (matchConfig) type = FileType.LocalDeck;

      return { path, filename, type, name } satisfies IndexFile;
    });

  return {
    files: _(await Promise.all(filesPromise))
      .sortBy('type')
      .groupBy('type'),
  };
});
