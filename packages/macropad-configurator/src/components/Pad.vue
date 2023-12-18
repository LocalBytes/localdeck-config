<template>
  <div class="pad-grid">
    <ButtonItem
        v-for="container in orderedButtons"
        :key="container.keyNum"
        :container="container"
        :editing="editing?.keyNum === container.keyNum"
        class="pad-grid-item"
        @click="click(container)">
    </ButtonItem>
  </div>
</template>
<script lang="ts" setup>

import type {EditContainer, PadEditor} from "~/lib/PadCfg";
import {BUTTON_NUMBERS} from "@localbytes/macropad-codegen/lib/virtuals/configured-button";

const editor = defineModel<PadEditor>({type: Object, required: true});
const editing = defineModel<EditContainer>("editing", {type: Object});

if (!editor.value) throw new Error("Pad model is required");

const orderedButtons = computed(() => {
  const buttons = [...editor.value.buttons];
  buttons.sort((a, b) => BUTTON_NUMBERS.indexOf(a.keyNum) - BUTTON_NUMBERS.indexOf(b.keyNum));
  return buttons;
});

const click = (container: EditContainer | null) => {
  if (!container || editing.value?.keyNum === container.keyNum) return editing.value = undefined;
  editing.value = container;
}

</script>
<style scoped>
.pad-grid {
  display: grid;
  grid-template-columns: repeat(6, 4rem);
  grid-template-rows: repeat(4, 4rem);
  gap: 1rem;
}

.pad-grid-item {
  @apply bg-gray-200 rounded-lg text-black;
}
</style>
