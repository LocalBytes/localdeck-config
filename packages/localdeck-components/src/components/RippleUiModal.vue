<template>
  <div>
    <input
      :id="id"
      :ref="id"
      v-model="isOpen"
      :disabled="!isDismissible"
      class="modal-state"
      type="checkbox"
    >
    <div class="modal">
      <label
        :for="id"
        class="modal-overlay"
      />
      <div class="modal-content flex flex-col gap-5">
        <label
          v-if="isDismissible"
          :for="id"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >✕</label>
        <slot name="title">
          <h2 class="text-xl">
            {{ title }}
          </h2>
        </slot>
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, default: null },
  isDismissible: { type: Boolean, default: true },
})

defineSlots<{
  default(): any
  title(props: { title: string }): any
}>()

const isOpen = defineModel({
  type: Boolean,
  default: true,
})

const id = useId()
</script>
