import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import tailwindcss from '@tailwindcss/vite';

const srcDir = join(dirname(fileURLToPath(import.meta.url)), './src');

export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', '@nuxt/eslint'],

  css: [join(srcDir, './assets/main.css')],

  srcDir: 'src', // https://github.com/nuxt/nuxt/issues/32965

  compatibilityDate: '2026-01-01',

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  eslint: { config: { stylistic: { semi: true } } },
});
