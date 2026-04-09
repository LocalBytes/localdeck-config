<template>
  <div
    class="collapse collapse-arrow border border-primary shadow"
    :class="isOpen && 'overflow-visible'"
  >
    <input
      v-model="isOpen"
      type="checkbox"
    >
    <div class="collapse-title px-4 font-semibold">
      <slot
        name="title"
        :title="title"
      >
        {{ title }}
      </slot>
    </div>
    <div class="collapse-content">
      <div class="min-h-0">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, default: null },
});

defineSlots<{
  default(): unknown;
  title(props: { title: string }): unknown;
}>();

const isOpen = defineModel({
  type: Boolean,
  default: false,
});
</script>
