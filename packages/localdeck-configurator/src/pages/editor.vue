<template>
  <div class="container py-5 mx-auto">
    <div class="my-2 text-sm">
      <nuxt-link to="/">
        Configurator
      </nuxt-link> &rarr; {{ route.query.filename }}
    </div>

    <h1 class="mb-2">
      LocalDeck Configurator
    </h1>
    <div class="form-control my-2">
      <input
        v-model="editor.title"
        class="input border-secondary inline-block"
        pattern="[a-zA-Z0-9]+"
        placeholder="Project Name"
        type="text"
      >
      <button
        class="btn btn-primary"
        type="button"
        @click="save"
      >
        Save
      </button>
      <button
        class="btn btn-secondary"
        type="button"
        @click="resetting=true"
      >
        Reset
      </button>
      <button
        class="btn btn-outline-primary"
        type="button"
        @click="print"
      >
        Print
      </button>
    </div>
    <div class="flex flex-wrap justify-center gap-10 py-2">
      <div>
        <h2>GUI</h2>
        <DeckPad
          v-if="editor"
          v-model="editor"
          v-model:editing="editing"
          class="mx-auto"
        />
      </div>

      <DeckButtonConfig
        v-if="editing"
        v-model="editing"
        :typeahead="entities"
      />
      <div
        v-else
        class="basis-2 grow"
      />
    </div>

    <RippleUiModal
      v-model="resetting"
      title="Are you sure?"
    >
      <p>
        This will reset all button configurations to their default values.<br>
        It will <b>not</b> save your changes by itself, so you will need to click the save button after resetting!
      </p>
      <div class="flex justify-end gap-2">
        <button
          class="btn btn-outline-error"
          @click="reset"
        >
          Reset
        </button>
        <button
          class="btn btn-primary"
          @click="resetting=false"
        >
          Cancel
        </button>
      </div>
    </RippleUiModal>
    <RippleUiModal
      :is-dismissible="saving==SavingStatus.DONE"
      :model-value="saving!=SavingStatus.IDLE"
      title="Saving..."
      @update:model-value="(value: boolean) => saving = value ? SavingStatus.DONE : SavingStatus.IDLE"
    >
      <div v-if="saving==SavingStatus.SAVING">
        <div class="spinner-simple" />
        <p>
          Please wait while your changes are being saved.
        </p>
      </div>
      <div v-else>
        <p>
          Your changes have been saved, please go to ESPHome to install!
        </p>
      </div>
    </RippleUiModal>
    <pre
      v-if="isDev"
      data-testid="editor-data"
      class="hidden"
    >{{ data }}</pre>
  </div>
</template>

<script lang="ts" setup>
import Fuse from 'fuse.js';

const isDev = import.meta.dev;
const router = useRouter();
const route = useRoute();
const { data, status } = await useFetch('/api/editor', { query: { filename: route.query.filename as string } });
const { data: entities } = await useFetch('/api/entities', {
  server: false,
  transform: data => new Fuse(data, { keys: ['id', { name: 'name', weight: 2 }] }),
});

enum SavingStatus {
  SAVING, DONE, IDLE,
}

const config = new ConfigUtil();

const saving = ref(SavingStatus.IDLE);
const resetting = ref(false);
const editor = ref(config.editor());
const editing = ref<EditContainer>();

config.notify = () => triggerRef(editor);

watch(status, () => {
  if (status.value !== 'success') return;
  if (data.value?.config) config.setChanges(data.value.config);
}, { immediate: true });

const save = async () => {
  saving.value = SavingStatus.SAVING;
  await $fetch('/api/editor', {
    method: 'POST',
    body: { editor: config.getChanges() },
    query: { filename: route.query.filename as string },
  }).finally(() => saving.value = SavingStatus.DONE);
};

const print = async () => {
  await save();
  saving.value = SavingStatus.IDLE;
  await router.push({ name: 'print', query: { filename: route.query.filename as string } });
};

const reset = () => {
  config.resetChanges();
  resetting.value = false;
};
</script>
