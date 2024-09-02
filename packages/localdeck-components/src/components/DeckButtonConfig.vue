<template>
  <div class="grow">
    <h3 class="pb-2">
      Editing button {{ modelValue.keyNum }}
    </h3>
    <DeckButtonConfigActions
      v-model="input"
      :typeahead="typeahead"
    />
  </div>

  <DeckButtonConfigLabel v-model="input" />
</template>

<script lang="ts" setup>
import type Fuse from 'fuse.js';
import type { HassEntity } from '~/utils/types';
import type { EditContainer } from '~/utils/PadCfg';

const input = defineModel<EditContainer>({
  required: true,
});

defineProps<{
  typeahead: Fuse<HassEntity>;
}>();
</script>
