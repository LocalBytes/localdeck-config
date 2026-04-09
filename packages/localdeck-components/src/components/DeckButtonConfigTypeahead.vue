<template>
  <div
    ref="container"
    :class="{ 'dropdown-open': isOpen }"
    class="dropdown w-full"
    @focusout="onFocusOut"
  >
    <input
      v-model="modelValue"
      class="input w-full"
      type="text"
      @focus="isOpen=true"
      @input="isOpen=true"
    >
    <ul class="menu dropdown-content z-1 mt-1 w-full max-h-100 overflow-y-auto rounded-box bg-base-100 p-2 shadow-sm">
      <li
        v-for="item in filtered"
        :key="item.id"
      >
        <button
          type="button"
          @click="select(item)"
        >
          <component
            :is="renderString(item.name, modelValue)"
            class="text-lg"
          />
          <component :is="renderString(item.id, modelValue)" />
        </button>
      </li>
      <li
        v-if="filtered.length==0"
        class="disabled"
      >
        <span class="text-lg">No results</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type Fuse from 'fuse.js';
import type { HassEntity } from '~/utils/types';

const props = defineProps<{
  typeahead: Fuse<HassEntity>;
}>();

const isOpen = ref(false);
const container = ref<HTMLElement | null>(null);
const modelValue = defineModel<string>({
  required: true,
});

const filtered = computed(() => {
  if (!modelValue.value) return props.typeahead?.getIndex().docs ?? [];
  return props.typeahead?.search(modelValue.value).map(({ item }) => item) ?? [];
});

const select = (item: HassEntity) => {
  modelValue.value = item.id;
  isOpen.value = false;
};

const onFocusOut = (event: FocusEvent) => {
  const nextTarget = event.relatedTarget as Node | null;
  if (!nextTarget || !container.value?.contains(nextTarget)) {
    isOpen.value = false;
  }
};

const renderString = (item: string, query: string) => {
  const text = item?.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  })[m] ?? m);

  if (!text || !query) return h('div', [text]);

  const index = text.toLowerCase().indexOf(query?.toLowerCase());
  if (index < 0) return h('div', [text]);

  return h('div', [
    h('span', text.substring(0, index)),
    h('span', { class: 'font-extrabold' }, text.substring(index, index + query.length)),
    h('span', text.substring(index + query.length)),
  ]);
};
</script>
