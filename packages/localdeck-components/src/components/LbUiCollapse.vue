<template>
  <div
    class="collapse collapse-arrow border border-base-300 bg-base-100 shadow"
  >
    <input
      v-model="isOpen"
      type="checkbox"
    >
    <div class="collapse-title px-4 font-semibold">
      <slot
        name="title"
        :title="title"
      >{{ title }}</slot>
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

const model = defineModel({
  type: Boolean,
  default: false,
});
const isOpen = ref(model.value);

watch(model, v => isOpen.value = v);
watch(isOpen, v => model.value = v);
</script>
