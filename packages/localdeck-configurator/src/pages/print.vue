<template>
  <div class="container py-5 mx-auto printmode">
    <h1>LocalDeck Configurator</h1>
    <h2>{{ editor.title }} - Printable Version</h2>


    <Pad v-model="editor"></Pad>
  </div>
</template>
<script lang="ts" setup>

import {newPadEditor} from "~/lib/PadCfg";
import {isPrintingSymbol} from "~/lib/hooks";

const router = useRouter();
const route = useRoute()
const {data, status} = await useFetch('/api/editor', {query: {filename: route.query.filename as string}});

const editor = reactive(newPadEditor());

provide(isPrintingSymbol, true);

watch(status, () => {
  if (status.value !== 'success') return;
  if (!data.value?.config) return;


  Object.assign(editor, data.value.config);
  if (process.client) window.print();
}, {immediate: true});

</script>
