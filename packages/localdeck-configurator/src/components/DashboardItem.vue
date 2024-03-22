<template>
  <div class="card border">
    <div class="card-body">
      <h2 class="card-header">{{ file.filename }}</h2>
      <div class="card-footer text-right">
        <NuxtLink :to="link" class="btn btn-primary">Edit</NuxtLink>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  file: IndexFile
}>()

const link = computed(() => ({
  name: 'editor',
  query: {
    filename: props.file.filename
  }
}))
</script>
