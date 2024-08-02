<template>
  <div class="container py-5 mx-auto">
    <h1>Debugger</h1>

    <label>
      Config URL
      <input
        v-model="configUrl"
        class="input border-secondary inline-block"
        type="text"
      >

    </label>

    <div>
      <h2>Decompressed</h2>
      <pre>{{ decompressed }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { decompress } from '@localbytes/localdeck-components/src/utils/compression';

const configUrl = ref<string>('');

const decompressed = computed(() => {
  try {
    const url: URL = new URL(configUrl.value);
    const extracted = url.searchParams.get('config');
    return decompress(extracted);
  }
  catch (e) {
    return e;
  }
});
</script>
