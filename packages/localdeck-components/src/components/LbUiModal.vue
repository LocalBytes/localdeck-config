<template>
  <dialog
    ref="dialogEl"
    class="modal"
    @cancel="onCancel"
    @close="onClose"
  >
    <div class="modal-box">
      <div>
        <button
          v-if="isDismissible"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          @click="requestClose"
        >
          ✕
        </button>
        <slot
          :title="title"
          name="title"
        >
          <h2 class="text-xl">
            {{ title }}
          </h2>
        </slot>
        <slot />
      </div>
    </div>
    <form
      v-if="isDismissible"
      class="modal-backdrop"
      method="dialog"
    >
      <button
        aria-label="Close"
        type="submit"
      >
        Close
      </button>
    </form>
  </dialog>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: { type: String, default: null },
  isDismissible: { type: Boolean, default: true },
});

defineSlots<{
  default(): unknown;
  title(props: { title: string }): unknown;
}>();

const isOpen = defineModel({
  type: Boolean,
  default: false,
});

const dialogEl = ref<HTMLDialogElement | null>(null);

watch(isOpen, (open) => {
  const dialog = dialogEl.value;
  if (!dialog) return;

  if (open && !dialog.open) {
    dialog.show();
    return;
  }

  if (!open && dialog.open) {
    dialog.close();
  }
}, { immediate: true });

const requestClose = () => {
  if (!props.isDismissible) return;
  isOpen.value = false;
};

const onCancel = (event: Event) => {
  if (!props.isDismissible) {
    event.preventDefault();
    return;
  }

  isOpen.value = false;
};

const onClose = () => {
  if (isOpen.value) isOpen.value = false;
};
</script>
