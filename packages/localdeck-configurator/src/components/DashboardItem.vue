<template>
  <div class="card border h-full text-start">
    <div class="text-start card-body cursor-pointer" role="link" @click="router.push(link)">
      <div class="card-header">
        {{ file.name }}
      </div>

      <p>{{ file.filename }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>

import type {IndexFile} from "~/utilities/types";

const props = defineProps<{
  file: IndexFile
}>()

const router = useRouter();

const link = computed(() => ({
  name: 'editor',
  query: {
    filename: props.file.filename
  }
}))
</script>
