import { type createPage, setup, type TestOptions } from '@nuxt/test-utils/e2e';

type NuxtPage = Awaited<ReturnType<typeof createPage>>;

export function buttonLabel(keynum: number) {
  return `DeckButton ${keynum.toFixed(0).padStart(2, '0')}`;
}

export async function setButton(page: NuxtPage, keynum: number, { name, entity }: { name: string; entity: string }) {
  console.log(`Setting Button ${keynum} to ${name} (${entity})`);

  await page.getByLabel(buttonLabel(keynum)).click();
  await page.getByRole('textbox', { name: 'Entity' }).fill(entity);
  await page.getByRole('textbox', { name: 'Label Text' }).fill(name);
}

export const setupNuxt = (options?: Partial<TestOptions>) => {
  if (process.env.CI) return setup();
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
