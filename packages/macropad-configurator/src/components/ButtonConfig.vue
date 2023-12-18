<template>
  <div class="p-2 gap-2">
    <h3 class="pb-2">Editing button {{ modelValue.keyNum }}</h3>

    <div class="grid lg:grid-cols-2">
      <ButtonConfigActions v-model="modelValue"/>

      <ButtonConfigLabel v-model="modelValue"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type {EditContainer} from "~/lib/PadCfg";

const modelValue = defineModel<EditContainer>({required: true});
</script>
