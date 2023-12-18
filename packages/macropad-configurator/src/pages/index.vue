<template>
  <div class="container py-5 mx-auto">
    <h1>Macropad Files</h1>
    <div class="grid grid-cols-6">
      <ProjectItem v-for="file in data.files" :key="file.filename" :file="file"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
const {data} = await useFetch("/api/index-files")
</script>
