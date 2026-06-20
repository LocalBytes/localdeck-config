import * as path from 'node:path';
import * as fs from 'node:fs/promises';

import { beforeEach, describe, expect, test } from 'vitest';

import { createPage } from '@nuxt/test-utils/e2e';

import { buttonLabel, getTestFilesDir, setButton } from '../utils';

const FILENAME = 'test-resetting.yaml';
const filesDir = getTestFilesDir();

describe('Resetting Workflow', () => {
  beforeEach(async () => {
    const filePath = path.join(filesDir, FILENAME);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
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

    expect(await page.getByLabel(buttonLabel(1)).getByText('Livingroom Bulb').isVisible()).toBe(true);
    expect(await page.getByLabel(buttonLabel(2)).getByText('Kitchen Bulb').isVisible()).toBe(true);

    await page.getByRole('button', { name: 'Reset' }).click();

    const reset = page.locator('.modal', { hasText: 'Are you sure?' }).getByRole('button', { name: 'Reset' });
    await reset.waitFor({ state: 'visible' });
    await reset.click();

    await page.getByRole('button', { name: 'Save' }).click();
    await page.reload();

    expect(await page.getByLabel(buttonLabel(1)).getByText('Livingroom Bulb').isVisible()).toBe(false);
    expect(await page.getByLabel(buttonLabel(2)).getByText('Kitchen Bulb').isVisible()).toBe(false);
  });
});
