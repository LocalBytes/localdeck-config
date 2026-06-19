import { afterAll, beforeAll } from 'vitest';
import { createBrowser, recoverContextFromEnv, useTestContext } from '@nuxt/test-utils/e2e';

beforeAll(async () => {
  recoverContextFromEnv();
  const ctx = useTestContext();
  if (!ctx.browser) {
    await createBrowser();
  }
});

afterAll(async () => {
  const ctx = useTestContext();
  if (ctx.browser) {
    await ctx.browser.close();
  }
});
