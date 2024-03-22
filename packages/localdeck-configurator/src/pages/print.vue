<template>
  <div class="container py-5 mx-auto printmode">
    <h1>LocalDeck Configurator</h1>
    <h2>{{ editor.title }} - Printable Version</h2>


    <DeckPad v-model="editor"></DeckPad>
  </div>
</template>
<script lang="ts" setup>

const router = useRouter();
const route = useRoute()
const {data, status} = await useFetch('/api/editor', {query: {filename: route.query.filename as string}});

const editor = reactive(newPadEditor());

provide(isPrintingSymbol, true);

watch(status, () => {
  if (status.value !== 'success') return;
  if (!data.value?.config) return;


  Object.assign(editor, data.value.config);
  if (process.client) setTimeout(() => window.print(), 1000);
}, {immediate: true});

</script>
