import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

const filesDir = fs.mkdtempSync(path.join(os.tmpdir(), 'localdeck-configurator-'));
process.env.LOCALDECK_CONFIGURATOR_FILES_DIR = filesDir;
process.env.NUXT_FILES_DIR = filesDir;

process.once('exit', () => {
  fs.rmSync(filesDir, { recursive: true, force: true });
});

// // https://github.com/nuxt/test-utils/issues/1490
// const bunFix = {
//   name: 'ignore-bun-test',
//   enforce: 'pre',
//   resolveId(id) {
//     if (id === 'bun:test') {
//       return { id: 'bun:test', external: true };
//     }
//   },
// } satisfies PluginOption;

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['test/e2e/*.{test,spec}.ts'],
          environment: 'node',
          singleThread: true,
          testTimeout: 300_000,
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
});
