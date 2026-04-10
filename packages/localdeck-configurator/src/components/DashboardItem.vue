<template>
  <nuxt-link
    class="link-unstyled card bg-base-100 shadow-sm border border-primary"
    :to="link"
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

const props = defineProps<{
  file: IndexFile;
}>();

const router = useRouter();

const link = computed(() => ({
  name: 'editor',
  query: {
    filename: props.file.filename,
  },
}));
</script>
