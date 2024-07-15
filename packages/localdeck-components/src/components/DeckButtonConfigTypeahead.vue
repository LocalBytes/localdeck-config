<template>
  <div
    ref="inputRef"
    :class="{ 'dropdown dropdown-open': isOpen }"
    class="w-full"
    @focusout="isOpen=false"
    @focusin.once="isOpen=true"
  >
    <input
      v-model="modelValue"
      class="input w-full"
      type="text"
      @input="isOpen=true"
    >
    <div class="dropdown-menu dropdown-menu-bottom-right gap-1 w-auto max-h-[400px] overflow-y-auto">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="dropdown-item"
        @click="select(item)"
      >
        <component
          :is="renderString(item.name, modelValue)"
          class="text-lg"
        />
        <component :is="renderString(item.id, modelValue)" />
      </div>
      <div
        v-if="filtered.length==0"
        class="dropdown-item disabled"
      >
        <span class="text-lg">No results</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { HassEntity } from '~/utils/types';

const props = defineProps<{
  typeahead: HassEntity[];
}>();

const inputRef = ref();
const isOpen = ref(false);
const modelValue = defineModel<string>();

const filtered = computed(() => props.typeahead?.filter(e =>
  e.id.includes(modelValue.value ?? '')
  || e.name.includes(modelValue.value ?? ''),
));

const select = (item: HassEntity) => {
  modelValue.value = item.id;
  isOpen.value = false;
};

const renderString = (item: string, query: string) => {
  const text = item?.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  })[m] ?? m);

  if (!text || !query) return text;

  const index = text.toLowerCase().indexOf(query?.toLowerCase());
  if (index < 0) return text;

  return h('div', [
    text.substring(0, index),
    h('span', { class: 'font-extrabold' }, text.substring(index, index + query.length)),
    text.substring(index + query.length),
  ]);
};
</script>
