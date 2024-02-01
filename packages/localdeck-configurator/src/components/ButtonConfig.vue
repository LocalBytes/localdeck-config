<template>

  <div class="grow">
    <h3 class="pb-2">Editing button {{ modelValue.keyNum }}</h3>
    <ButtonConfigActions v-model="modelValue" :typeahead="typeahead"/>

  </div>

  <ButtonConfigLabel v-model="modelValue"/>

</template>
<script lang="ts" setup>
import type {EditContainer} from "~/lib/PadCfg";
import type {HassEntity} from "~/server/api/entities";

defineProps({
  typeahead: {
    type: Array as PropType<HassEntity[]>,
    default: null
  },
})

const modelValue = defineModel<EditContainer>({required: true});
</script>
