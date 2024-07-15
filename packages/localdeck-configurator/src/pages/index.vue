<template>
  <div class="container py-5 mx-auto">
    <h1>LocalDeck Files</h1>
    <div
      v-for="(files, group) in data?.files"
      class="my-5"
    >
      <div class="my-1">
        <h2 v-if="group == FileType.Import">
          Ready for Import!
        </h2>
        <h2 v-else-if="group == FileType.LocalDeck">
          Your LocalDeck's
        </h2>
        <h2 v-else>
          Other files
        </h2>
      </div>

      <div class="grid md:grid-cols-3 lg:grid-cols-5 gap-2">
        <DashboardItem
          v-for="file in files"
          v-if="data"
          :key="file.filename"
          :file="file"
        />
      </div>
    </div>
    <div>
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FileType } from '~/utilities/types'

const { data, error } = await useFetch('/api/index-files')
</script>
