<template>
  <div class="container py-5 mx-auto">
    <h1>LocalDeck Files</h1>
    <div class="grid grid-cols-6">
      <DashboardItem v-for="file in data.files" v-if="data" :key="file.filename" :file="file"/>
    </div>
    <div>
      {{ error }}
    </div>
  </div>
</template>
<script lang="ts" setup>
const {data, error} = await useFetch("/api/index-files")
</script>
