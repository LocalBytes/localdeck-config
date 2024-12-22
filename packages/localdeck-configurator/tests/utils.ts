import { type createPage, setup, type TestOptions } from '@nuxt/test-utils/e2e';

type NuxtPage = Awaited<ReturnType<typeof createPage>>;

export async function setButton(page: NuxtPage, keynum: number, { name, entity }: { name: string; entity: string }) {
  console.log(`Setting Button ${keynum} to ${name} (${entity})`);
  await page.click(`div[data-keynum="${keynum}"]`);

  await page.getByRole('textbox', { name: 'entity' }).fill(entity);
  await page.getByRole('textbox', { name: 'label_text' }).fill(name);
}

export const setupNuxt = (options?: Partial<TestOptions>) => {
  if (1 || process.env.CI) return setup();
  else return setup({
    host: 'http://localhost:3000',
    build: false,
    buildDir: '.output',
    nuxtConfig: {
      nitro: {
        output: {
          dir: '.output',
        },
      },
    },
    ...(options ?? {}),
  });
};
