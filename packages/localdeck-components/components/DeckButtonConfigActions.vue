<template>
  <div class="p-2 gap-2 flex flex-col">
    <p>Actions</p>

    <label class="flex gap-2">
      <input v-model="modelValue.component.expose" class="checkbox" type="checkbox"/>
      <span>Expose to HomeAssistant</span>
    </label>

    <label class="flex gap-2">
      <input v-model="modelValue.component.blip_on_press"
             :disabled="modelValue.component.ha_entity && modelValue.component.follow_state"
             class="checkbox" type="checkbox"
      />
      <span>Flash LED on press</span>
    </label>

    <RippleUiCollapse v-model="hassOpen" title="HomeAssistant Integration">
      <div class="flex flex-col gap-2">
        <label class="form-field">
          <span class="label-text">Entity</span>
          <DeckButtonConfigTypeahead
              v-if="typeahead" v-model="modelValue.component.ha_entity" :typeahead="typeahead"
          />
          <input v-else v-model="modelValue.component.ha_entity"
                 v-maska class="input input-bordered" data-maska="D.E"
                 data-maska-tokens="D:[a-zA-Z0-9]:multiple|E:[a-zA-Z0-9_]:multiple"
                 placeholder="eg: light.livingroom_light" type="text"
          />

        </label>

        <label class="flex gap-2">
          <input v-model="modelValue.component.toggle"
                 :disabled="!modelValue.component.ha_entity"
                 :checked="true" class="checkbox" type="checkbox"
          />
          <span>Toggle Entity</span>
        </label>

        <label class="flex gap-2">
          <input v-model="modelValue.component.follow_state"
                 :disabled="!modelValue.component.ha_entity"
                 :checked="true" class="checkbox" type="checkbox"
          />
          <span>Follow State (On/Off)</span>
        </label>

        <label class="flex gap-2">
          <input v-model="modelValue.component.follow_brightness"
                 :disabled="!modelValue.component.ha_entity || !modelValue.component.follow_state"
                 :checked="true" class="checkbox" type="checkbox"
          />
          <span>Follow Brightness</span>
        </label>

        <label class="flex gap-2">
          <input v-model="modelValue.component.follow_color"
                 :disabled="!modelValue.component.ha_entity || !modelValue.component.follow_state"
                 :checked="true" class="checkbox" type="checkbox"
          />
          <span>Follow Color <span class="italic">(Coming Soon)</span></span>
        </label>
      </div>
    </RippleUiCollapse>
  </div>
</template>
<script lang="ts" setup>
import type {EditContainer} from "../utils/PadCfg";
import type {HassEntity} from "../utils/types";

defineModel<EditContainer>({
  required: true,
});

defineProps({
  typeahead: {
    type: Array as PropType<HassEntity[]>,
    default: null
  },
})

const hassOpen = ref(true);

</script>
