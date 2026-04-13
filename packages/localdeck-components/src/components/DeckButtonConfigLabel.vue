<template>
  <div class="p-2 grow flex flex-col gap-2 ">
    <h3 class="pb-2">
      Label
    </h3>

    <div class="flex">
      <LazyDeckIconPicker
        v-model="modelValue.label"
        class="grow"
      />
      <button
        v-if="modelValue.label.icon"
        class="btn btn-outline-danger"
        type="button"
        @click="modelValue.label.icon=null"
      >
        X
      </button>
    </div>
    <textarea
      v-model="modelValue.label.text"
      class="textarea"
      name="label_text"
      placeholder="Type here"
      rows="3"
      title="Label text"
    />

    <label>
      Size
      <span class="flex gap-2">
        <input
          v-model="modelValue.label.fontSize"
          :disabled="!modelValue.label.text"
          class="input range"
          max="20"
          min="4"
          type="range"
        >
        <input
          v-model="modelValue.label.fontSize"
          :disabled="!modelValue.label.text"
          class="input w-20"
          max="20"
          min="4"

          type="number"
        >
      </span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import type { EditContainer } from '~/utils/PadCfg';

const modelValue = defineModel<EditContainer>({ required: true });
</script>
