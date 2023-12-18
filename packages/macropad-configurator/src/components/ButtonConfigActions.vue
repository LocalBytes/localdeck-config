<template>
  <div class="rounded p-2 shadow">
    <p>Actions</p>

    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">Expose to HomeAssistant</span>
        <input v-model="modelValue.component.expose" class="checkbox" type="checkbox"/>
      </label>
    </div>

    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">Blip Animation</span>
        <input v-model="modelValue.component.blip_on_press" class="checkbox" type="checkbox"/>
      </label>
    </div>

    <RippleUiCollapse title="HomeAssistant Integration">
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">Entity</span>
          <input v-model="modelValue.component.ha_entity"
                 v-maska class="input input-bordered" data-maska="D.E"
                 data-maska-tokens="D:[a-zA-Z0-9]:multiple|E:[a-zA-Z0-9_]:multiple"
                 placeholder="eg: light.livingroom_light" type="text"
          />

        </label>
      </div>

      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">Toggle Entity</span>
          <input v-model="modelValue.component.toggle"
                 :disabled="!modelValue.component.ha_entity"
                 checked="checked" class="checkbox" type="checkbox"
          />
        </label>
      </div>

      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">Follow State (on/off)</span>
          <input v-model="modelValue.component.follow_state"
                 :disabled="!modelValue.component.ha_entity"
                 checked="checked" class="checkbox" type="checkbox"
          />
        </label>
      </div>

      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">Follow Brightness</span>
          <input v-model="modelValue.component.follow_brightness"
                 :disabled="!modelValue.component.follow_state"
                 checked="checked" class="checkbox" type="checkbox"
          />
        </label>
      </div>

      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">Follow Color <i class="opacity-80">(coming soon)</i></span>
          <input v-model="modelValue.component.follow_color"
                 :disabled="!modelValue.component.follow_state"
                 checked="checked" class="checkbox" type="checkbox"
          />
        </label>
      </div>
    </RippleUiCollapse>
  </div>
</template>
<script lang="ts" setup>

import type {EditContainer} from "~/lib/PadCfg";

const modelValue = defineModel<EditContainer>({required: true});
</script>
