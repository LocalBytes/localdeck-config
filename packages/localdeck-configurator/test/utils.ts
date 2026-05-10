import type { createPage } from '@nuxt/test-utils/e2e';

type NuxtPage = Awaited<ReturnType<typeof createPage>>;

export function getTestFilesDir() {
  const filesDir = process.env.LOCALDECK_CONFIGURATOR_FILES_DIR;
  if (!filesDir) {
    throw new Error('Missing LOCALDECK_CONFIGURATOR_FILES_DIR');
  }

  return filesDir;
}

export function buttonLabel(keynum: number) {
  return `DeckButton ${keynum.toFixed(0).padStart(2, '0')}`;
}

export async function setButton(page: NuxtPage, keynum: number, { name, entity }: { name: string; entity: string }) {
  console.log(`Setting Button ${keynum} to ${name} (${entity})`);

  await page.getByLabel(buttonLabel(keynum)).click();
  await page.getByRole('textbox', { name: 'Entity' }).fill(entity);
  await page.getByRole('textbox', { name: 'Label Text' }).fill(name);
}
