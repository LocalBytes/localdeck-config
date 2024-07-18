// @vitest-environment nuxt

import * as path from 'node:path';
import * as fs from 'node:fs/promises';

import { describe, test } from 'vitest';
import { createPage } from '@nuxt/test-utils/e2e';
import { setupNuxt } from '~~/tests/utils';

const FILENAME = 'test-resetting.yaml';

describe('Resetting Workflow', async () => {
  await setupNuxt({});

  test('Resetting the configuration', async () => {
    const runtimeConfig = useRuntimeConfig();
    const filePath = path.join(runtimeConfig.filesDir, FILENAME);
    await fs.writeFile(filePath, '');

    // Load the page
    console.log('Loading Page');
    const page = await createPage('/');
    await page.getByText(FILENAME).click();

    // Set button 1 to be Livingroom Bulb (light.livingroom_bulb) and save
    console.log('Setting Button 1');
    await page.click('div[data-keynum="1"]');
  });
});
