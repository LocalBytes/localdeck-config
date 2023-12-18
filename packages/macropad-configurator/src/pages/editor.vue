<template>
  <div class="container">
    <h1>Macropad Configurator</h1>
    <div class="form-control">
      <input v-model="editor.title"
             class="input border-secondary inline-block"
             pattern="[a-zA-Z0-9]+"
             placeholder="Project Name"
             type="text"
      />
      <button class="btn btn-primary" @click="saving=SavingStatus.SAVING">Save</button>
      <button class="btn btn-secondary" @click="resetting=true">Reset</button>
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-3">

      <div class="py-2">
        <h2>GUI</h2>
        <Pad v-if="editor" v-model="editor" v-model:editing="editing" class="mx-auto"/>
      </div>

      <ButtonConfig v-if="editing" v-model="editing" class="col-span-2"/>

    </div>


    <RippleUiModal v-model="resetting" title="Are you sure?">
      <p>
        This will reset all button configurations to their default values.<br/>
        It will <b>not</b> save your changes by itself, so you will need to click the save button after resetting!
      </p>
      <div class="flex justify-end gap-2">
        <button class="btn btn-secondary" @click="resetting=false">Cancel</button>
        <button class="btn btn-primary" @click="reset">Reset</button>
      </div>
    </RippleUiModal>
    <RippleUiModal
        :is-dismissible="saving==SavingStatus.SUCCESS"
        :model-value="saving!=SavingStatus.IDLE"
        title="Saving..."
        @update:model-value="value => saving = value ? SavingStatus.SUCCESS : SavingStatus.IDLE"
    >
      <p>
        Please wait while your changes are being saved.
        <div class="spinner-simple"></div>
      </p>
    </RippleUiModal>
  </div>
</template>
<script lang="ts" setup>
import {type EditContainer, newPadEditor} from "~/lib/PadCfg";

const route = useRoute()
const {data, status} = await useFetch('/api/editor', {query: {filename: route.query.filename as string}});

enum SavingStatus {
  SAVING, SUCCESS, IDLE
}

const saving = ref(SavingStatus.IDLE);
const resetting = ref(false);
const editor = reactive(newPadEditor());
const isNew = ref(false);
const editing = ref<EditContainer>();

watch(status, () => {
  if (status.value !== 'success') return;
  if (data.value) {
    Object.assign(editor, data.value);
    isNew.value = false;
  } else {
    Object.assign(editor, newPadEditor());
    isNew.value = true;
  }
}, {immediate: true});

const reset = () => {
  if (!confirm("Are you sure you want to reset?")) return;
  Object.assign(editor, newPadEditor());
  isNew.value = true;
  resetting.value = false;
}
</script>
