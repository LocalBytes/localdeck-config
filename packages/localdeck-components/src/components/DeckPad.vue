<template>
  <div ref="gridRef" :class="{'printmode':isPrinting}" class="pad-grid">
    <DeckButtonItem
        v-for="container in orderedButtons"
        :key="container.keyNum"
        :container="container"
        :editing="editing?.keyNum === container.keyNum && !isPrinting"
        class="pad-grid-item"
        @click="click(container)">
    </DeckButtonItem>
  </div>
</template>
<script lang="ts" setup>
import {BUTTON_NUMBERS} from "@localbytes/localdeck-codegen/lib/virtuals/configured-button";
import type {EditContainer, PadEditor} from "../utils/PadCfg";
import {useResizeObserver} from "@vueuse/core";
import {fontSizesSymbol} from "../utils/hooks";

const gridRef = ref<HTMLDivElement>();

const editor = defineModel<PadEditor>({type: Object, required: true});
const editing = defineModel<EditContainer>("editing", {type: Object});

const isPrinting = useIsPrinting();

if (!editor.value) throw new Error("Pad model is required");

const orderedButtons = computed(() => {
  const buttons = Object.values(editor.value.buttons);
  buttons.sort((a, b) => BUTTON_NUMBERS.indexOf(a.keyNum) - BUTTON_NUMBERS.indexOf(b.keyNum));
  return buttons;
});

const click = (container: EditContainer | null) => {
  if (!container || editing.value?.keyNum === container.keyNum) return editing.value = undefined;
  editing.value = container;
}

const sizes = reactive({
  devicePixelRatio: 1,
  rootFontSize: 14,
});

useResizeObserver(gridRef, () => {
  sizes.devicePixelRatio = window?.devicePixelRatio ?? 1;
  sizes.rootFontSize = Number(window?.getComputedStyle(document.body).getPropertyValue('font-size').replace('px', '')) ?? 14;
});
provide(fontSizesSymbol, sizes);


</script>
<style scoped>
.pad-grid {
  display: grid;
  grid-template-columns: repeat(6, 4rem);
  grid-template-rows: repeat(4, 4rem);
  gap: 1rem;
}

.printmode.pad-grid {
  grid-template-columns: repeat(6, min-content);
  grid-template-rows: repeat(4, min-content);
  gap: 0.25mm;
}

.printmode.pad-grid-item {
  border: 1px solid rgba(0, 0, 0, 0.25);

  border-radius: 0;
}

.pad-grid-item {
  @apply bg-gray-200 rounded-lg text-black;
}
</style>
