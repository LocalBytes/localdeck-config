import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
// There's a frustrating issue somewhere which means nuxt is loading increadably slow during tests.
// As such, we keep running into timout issues
  test: {
    testTimeout: 60_000,
  },
});
