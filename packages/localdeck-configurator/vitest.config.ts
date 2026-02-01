
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
// There's a frustrating issue somewhere which means nuxt is loading incredibly slow during tests.
// As such, we keep running into timeout issues
  test: {
    testTimeout: 300_000,
    environment: 'nuxt',
  },
})