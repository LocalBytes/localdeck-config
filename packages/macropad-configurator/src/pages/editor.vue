<template>

</template>
<script lang="ts" setup>
const route = useRoute()
const {data} = await useFetch('/api/editor', {query: {filename: route.query.filename as string}});

const editor = reactive(data.config ?? newPadEditor());
</script>
