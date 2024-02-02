<template>
  <div class="container py-5 mx-auto">
    <h1>LocalDeck Configurator</h1>
    <div class="form-control">
      <input v-model="editor.title"
             class="input border-secondary inline-block"
             pattern="[a-zA-Z0-9]+"
             placeholder="Project Name"
             type="text"
      />
      <button class="btn btn-primary" @click="save">Save</button>
      <button class="btn btn-secondary" @click="resetting=true">Reset</button>
      <button class="btn btn-outline-primary" @click="print">Print</button>
    </div>
    <div class="flex flex-wrap justify-center gap-10">

      <div>
        <h2>GUI</h2>
        <Pad v-if="editor" v-model="editor" v-model:editing="editing" class="mx-auto"/>
      </div>

      <ButtonConfig v-if="editing" v-model="editing" :typeahead="entities"/>
      <div v-else class="basis-2 grow"></div>
    </div>


    <RippleUiModal v-model="resetting" title="Are you sure?">
      <p>
        This will reset all button configurations to their default values.<br/>
        It will <b>not</b> save your changes by itself, so you will need to click the save button after resetting!
      </p>
      <div class="flex justify-end gap-2">
        <button class="btn btn-outline-error" @click="reset">Reset</button>
        <button class="btn btn-primary" @click="resetting=false">Cancel</button>
      </div>
    </RippleUiModal>
    <RippleUiModal
        :is-dismissible="saving==SavingStatus.DONE"
        :model-value="saving!=SavingStatus.IDLE"
        title="Saving..."
        @update:model-value="value => saving = value ? SavingStatus.DONE : SavingStatus.IDLE"
    >
      <div v-if="saving==SavingStatus.SAVING">
        <div class="spinner-simple"/>
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
  </div>
</template>
<script lang="ts" setup>
import {type EditContainer, newPadEditor} from "~/lib/PadCfg";

const router = useRouter();
const route = useRoute()
const {data, status} = await useFetch('/api/editor', {query: {filename: route.query.filename as string}});
const {data: entities} = await useFetch('/api/entities', {server: false});

enum SavingStatus {
  SAVING, DONE, IDLE
}

const saving = ref(SavingStatus.IDLE);
const resetting = ref(false);
const editor = reactive(newPadEditor());
const isNew = ref(false);
const editing = ref<EditContainer>();

watch(status, () => {
  if (status.value !== 'success') return;
  if (data.value?.config) {
    Object.assign(editor, data.value.config);
    isNew.value = false;
  } else {
    Object.assign(editor, newPadEditor());
    isNew.value = true;
  }
}, {immediate: true});

const save = async () => {
  saving.value = SavingStatus.SAVING;
  const response = await $fetch('/api/editor', {
    method: 'POST',
    body: {editor},
    query: {filename: route.query.filename as string}
  }).finally(() => saving.value = SavingStatus.DONE);

  console.log(response);
}

const print = async () => {
  await save();
  saving.value = SavingStatus.IDLE;
  await router.push({name: 'print', query: {filename: route.query.filename as string}});
}

const reset = () => {
  if (!confirm("Are you sure you want to reset?")) return;
  Object.assign(editor, newPadEditor());
  isNew.value = true;
  resetting.value = false;
}
</script>
