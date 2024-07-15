<template>
  <div class="container py-5 mx-auto printmode">
    <div class="my-2 text-sm">
      <nuxt-link to="/">
        Configurator
      </nuxt-link> &rarr;
      <nuxt-link :to="{ name: 'editor', query: { filename: route.query.filename as string } }">
        {{ route.query.filename }}
      </nuxt-link> &rarr;
      Print
    </div>
    <h1>LocalDeck Configurator</h1>
    <h2>{{ editor.title }} - Printable Version</h2>
    <a
      href="/"
      @click.prevent="router.go(-1)"
    >Back</a>

    <DeckPad v-model="editor" />
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const route = useRoute();
const { data, status } = await useFetch('/api/editor', { query: { filename: route.query.filename as string } });

const editor = reactive(newPadEditor());

provide(isPrintingSymbol, true);

watch(status, () => {
  if (status.value !== 'success') return;
  if (!data.value?.config) return;

  Object.assign(editor, data.value.config);
  if (import.meta.client) setTimeout(() => window.print(), 1000);
}, { immediate: true });
</script>
