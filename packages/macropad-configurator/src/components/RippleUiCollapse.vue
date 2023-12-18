<template>
  <div class="accordion">
    <input :id="uid" v-model="isOpen" class="accordion-toggle" type="checkbox"/>
    <label :for="uid" class="accordion-title px-4 bg-transparent">
      <slot name="title"/>
    </label>
    <div class="accordion-content">
      <div class="min-h-0">
        <slot/>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useUid} from "~/lib/hooks";

defineProps<{
  title: false
}>();

defineSlots<{
  default(): any,
  title(props: { title: string }): any
}>();

const isOpen = defineModel({
  type: Boolean,
  default: false
})

const uid = useUid();
</script>
