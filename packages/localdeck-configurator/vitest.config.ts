import { defineVitestProject } from '@nuxt/test-utils/config';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, defineProject } from 'vitest/config';

const rootDir = path.resolve(fileURLToPath(import.meta.url), '..');
const filesDir = fs.mkdtempSync(path.join(os.tmpdir(), 'localdeck-configurator-'));
process.env.LOCALDECK_CONFIGURATOR_FILES_DIR = filesDir;
process.env.NUXT_FILES_DIR = filesDir;
process.env.NUXT_TEST_OPTIONS = JSON.stringify({ rootDir, dev: true, browser: false });

process.once('exit', () => {
  fs.rmSync(filesDir, { recursive: true, force: true });
});

const nuxtProject = await defineVitestProject({
  test: {
    name: 'nuxt',
    include: ['test/nuxt/*.{test,spec}.ts'],
    environment: 'nuxt',
    singleThread: true,
    hookTimeout: 30_000,
  },
});

export default defineConfig({
  test: {
    projects: [
      nuxtProject,
      defineProject({
        resolve: nuxtProject.resolve,
        test: {
          name: 'unit',
          include: ['test/unit/*.{test,spec}.ts'],
          environment: 'node',
        },
      }),
      defineProject({
        resolve: nuxtProject.resolve,
        test: {
          name: 'e2e',
          include: ['test/e2e/*.{test,spec}.ts'],
          environment: 'node',
          globalSetup: ['../../node_modules/@nuxt/test-utils/dist/runtime/global-setup.mjs'],
          setupFiles: ['./test/e2e/setup.ts'],
          fileParallelism: false,
          testTimeout: 300_000,
        },
      }),
    ],
  },
});
