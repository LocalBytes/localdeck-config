<template>
  <div class="dropdown-container">
    <div class="dropdown">
      <label
        ref="dropdownButton"
        :class="{ 'material-symbols-outlined': modelValue.icon?.startsWith('mdi:') }"
        class="btn btn-solid-primary"
        tabindex="0"
      >{{ modelValue.icon?.replace("mdi:", "") || "+ Emoji" }}</label>
      <EmojiPicker
        :additional-groups="{ material: mdIconsGroups }"
        :native="true"
        :theme="emojiTheme"
        class="dropdown-menu dropdown-menu-bottom-center picker"
        @select="onSelectEmoji"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { EmojiExt } from 'vue3-emoji-picker';
import EmojiPicker from 'vue3-emoji-picker';
import type { ConfiguredButtonOptsLabel } from '@localbytes/localdeck-codegen/dist/virtuals';
import 'vue3-emoji-picker/css';
import { mdIconsGroups } from '~/utils/material';
import '../assets/material.css';

const modelValue = defineModel<ConfiguredButtonOptsLabel>({ required: true });

// See: https://github.com/nuxt-modules/color-mode/issues/335
let colorMode: ReturnType<typeof useColorMode> | null = null;
if (!import.meta.env.TEST) colorMode = useColorMode();

const emojiTheme = computed(() => {
  if (!colorMode) return 'light';
  return colorMode.value === 'dark' ? 'dark' : 'light';
});

const onSelectEmoji = (emoji: EmojiExt) => {
  const MdIcon = emoji.n.find(s => s.startsWith('mdi:'));
  return modelValue.value.icon = MdIcon ?? emoji.i;
};
</script>
