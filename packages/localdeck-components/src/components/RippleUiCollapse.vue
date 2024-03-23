<template>
  <div :class="isOpen && 'overflow-visible'" class="accordion shadow ">
    <input :id="id" v-model="isOpen" class="accordion-toggle" type="checkbox"/>
    <label :for="id" class="accordion-title px-4 bg-transparent">
      <slot name="title">{{ title }}</slot>
    </label>
    <div :class="isOpen && 'overflow-visible'" class="accordion-content">
      <div class="min-h-0">
        <slot/>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

defineProps({
  title: {type: String, default: null},
});

defineSlots<{
  default(): any,
  title(props: { title: string }): any
}>();


const model = defineModel({
  type: Boolean,
  default: false
})
const isOpen = ref(model.value);

watch(model, v => isOpen.value = v);
watch(isOpen, v => model.value = v);

const id = useId();
</script>
