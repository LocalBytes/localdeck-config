<template>
  <nuxt-link
    class="link-unstyled card bg-base-100 shadow-sm border border-primary"
    :to="{ name: 'editor', query: { filename: file.filename } }"
  >
    <div class="card-body">
      <h2 class="card-title">
        {{ file.name }}
      </h2>
      <p>{{ file.filename }}</p>
    </div>
  </nuxt-link>
</template>

<script lang="ts" setup>
import type { IndexFile } from '~/utilities/types';

defineProps<{
  file: IndexFile;
}>();
</script>
