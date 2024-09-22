import * as path from 'node:path';
import * as fs from 'node:fs/promises';

import { beforeEach, describe, expect, test } from 'vitest';
import { createPage } from '@nuxt/test-utils/e2e';
import { setButton, setupNuxt } from '~~/tests/utils';

const FILENAME = 'test-resetting.yaml';

describe('Resetting Workflow', async () => {
  await setupNuxt();

  beforeEach(async () => {
    const runtimeConfig = useRuntimeConfig();
    const filePath = path.join(runtimeConfig.filesDir, FILENAME);
    await fs.writeFile(filePath, '');
  });

  test('Resetting the configuration', async () => {
    // Load the page
    console.log('Loading Page');
    const page = await createPage('/');
    await page.getByText(FILENAME).click();

    console.log('Setting Buttons');
    await setButton(page, 1, { name: 'Livingroom Bulb', entity: 'light.livingroom_bulb' });
    await setButton(page, 2, { name: 'Kitchen Bulb', entity: 'light.kitchen_bulb' });

    console.log('Saving & Resetting');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.locator('.modal', { hasText: 'Saving' }).getByText('✕').click();

    await page.getByRole('button', { name: 'Reset' }).click();

    const reset = page.locator('.modal', { hasText: 'Are you sure?' }).getByRole('button', { name: 'Reset' });
    await reset.waitFor({ state: 'visible' });
    await reset.click();

    await page.getByRole('button', { name: 'Save' }).click();

    console.log('Checking Reset in Network');
    await page.reload();
    const rawData = await page.getByTestId('editor-data').innerText();
    expect(JSON.parse(rawData ?? '').config).toMatchObject({ title: 'LocalDeck', buttons: {} });
  });
});
