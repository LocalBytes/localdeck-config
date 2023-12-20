<template>
  <div :class="isOpen && 'overflow-visible'" class="accordion">
    <input :id="uid" v-model="isOpen" class="accordion-toggle" type="checkbox"/>
    <label :for="uid" class="accordion-title px-4 bg-transparent">
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
import {useUid} from "~/lib/hooks";

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

const uid = useUid();
</script>
