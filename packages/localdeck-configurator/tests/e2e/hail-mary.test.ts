// @vitest-environment nuxt

import * as path from 'node:path';
import * as fs from 'node:fs/promises';

import { beforeEach, describe, test } from 'vitest';
import { createPage } from '@nuxt/test-utils/e2e';
import { setupNuxt } from '~~/tests/utils';

const FILENAME = 'test-hailmary.yaml';
type NuxtPage = Awaited<ReturnType<typeof createPage>>;

async function setButton(page: NuxtPage, keynum: number, { name, entity }) {
  console.log(`Setting Button ${keynum} to ${name} (${entity})`);
  await page.click(`div[data-keynum="${keynum}"]`);

  await page.getByRole('textbox', { name: 'Entity' }).fill(entity);
  await page.getByPlaceholder('Type here').fill(name);
}

describe('Hail Mary', async () => {
  await setupNuxt();

  beforeEach(async () => {
    const runtimeConfig = useRuntimeConfig();
    const filePath = path.join(runtimeConfig.filesDir, FILENAME);
    await fs.writeFile(filePath, '');
  });

  test('Set All the buttons', async () => {
    // Load the page
    console.log('Loading Page');
    const page = await createPage('/');
    await page.getByText(FILENAME).click();

    console.log('Setting Buttons');
    await setButton(page, 1, { name: 'Livingroom Bulb', entity: 'light.livingroom_bulb' });
    await setButton(page, 2, { name: 'Kitchen Bulb', entity: 'light.kitchen_bulb' });
    await setButton(page, 3, { name: 'Bedroom Bulb', entity: 'light.bedroom_bulb' });
    await setButton(page, 4, { name: 'Bathroom Bulb', entity: 'light.bathroom_bulb' });
    await setButton(page, 5, { name: 'Hallway Bulb', entity: 'light.hallway_bulb' });
    await setButton(page, 6, { name: 'Porch Bulb', entity: 'light.porch_bulb' });
    await setButton(page, 7, { name: 'Garage Bulb', entity: 'light.garage_bulb' });
    await setButton(page, 8, { name: 'Backyard Bulb', entity: 'light.backyard_bulb' });
    await setButton(page, 9, { name: 'Frontyard Bulb', entity: 'light.frontyard_bulb' });
    await setButton(page, 10, { name: 'Basement Bulb', entity: 'light.basement_bulb' });
    await setButton(page, 11, { name: 'Attic Bulb', entity: 'light.attic_bulb' });
    await setButton(page, 12, { name: 'Office Bulb', entity: 'light.office_bulb' });
    await setButton(page, 13, { name: 'Library Bulb', entity: 'light.library_bulb' });
    await setButton(page, 14, { name: 'Study Bulb', entity: 'light.study_bulb' });
    await setButton(page, 15, { name: 'Lab Bulb', entity: 'light.lab_bulb' });
    await setButton(page, 16, { name: 'Classroom Bulb', entity: 'light.classroom_bulb' });
    await setButton(page, 17, { name: 'Gym Bulb', entity: 'light.gym_bulb' });
    await setButton(page, 18, { name: 'Pool Bulb', entity: 'light.pool_bulb' });
    await setButton(page, 19, { name: 'Spa Bulb', entity: 'light.spa_bulb' });
    await setButton(page, 20, { name: 'Sauna Bulb', entity: 'light.sauna_bulb' });
    await setButton(page, 21, { name: 'Cinema Bulb', entity: 'light.cinema_bulb' });
    await setButton(page, 22, { name: 'Bar Bulb', entity: 'light.bar_bulb' });
    await setButton(page, 23, { name: 'Kitchenette Bulb', entity: 'light.kitchenette_bulb' });
    await setButton(page, 24, { name: 'Diningroom Bulb', entity: 'light.diningroom_bulb' });

    console.log('Saving');
    await page.getByRole('button', { name: 'Save' }).click();
  });
});
