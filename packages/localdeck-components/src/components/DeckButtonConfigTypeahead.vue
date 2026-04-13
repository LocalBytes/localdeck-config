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
      @focus="openDropdown"
      @input="openDropdown"
      @keydown.esc="closeDropdown"
    >
    <div
      v-show="isOpen"
      class="dropdown-content z-1 mt-1 max-h-100 w-full overflow-y-auto bg-base-100 menu flex flex-col flex-nowrap p-0"
    >
      <button
        v-for="item in filtered"
        :key="item.id"
        class="w-full px-3 py-2 text-left hover:bg-base-200"
        type="button"
        @mousedown.prevent
        @click="select(item)"
      >
        <component
          :is="renderString(item.name, modelValue)"
          class="block"
        />
        <component
          :is="renderString(item.id, modelValue)"
          class="block"
        />
      </button>
      <div
        v-if="filtered.length === 0"
        class="px-3 py-2"
      >
        No results
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type Fuse from 'fuse.js';
import type { HassEntity } from '~/utils/types';

const props = defineProps<{
  typeahead: Fuse<HassEntity>;
}>();

const container = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const modelValue = defineModel<string>({
  required: true,
});

const filtered = computed(() => {
  if (!modelValue.value) return props.typeahead?.getIndex().docs ?? [];
  return props.typeahead?.search(modelValue.value).map(({ item }) => item) ?? [];
});

const closeDropdown = () => {
  isOpen.value = false;
};

const openDropdown = () => {
  isOpen.value = true;
};

const select = (item: HassEntity) => {
  modelValue.value = item.id;
  closeDropdown();
};

const onFocusOut = (event: FocusEvent) => {
  const nextTarget = event.relatedTarget as Node | null;
  if (!nextTarget || !container.value?.contains(nextTarget)) {
    closeDropdown();
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

  if (!text || !query) return h('span', [text]);

  const index = text.toLowerCase().indexOf(query?.toLowerCase());
  if (index < 0) return h('span', [text]);

  return h('span', [
    h('span', text.substring(0, index)),
    h('span', { class: 'font-extrabold' }, text.substring(index, index + query.length)),
    h('span', text.substring(index + query.length)),
  ]);
};
</script>
