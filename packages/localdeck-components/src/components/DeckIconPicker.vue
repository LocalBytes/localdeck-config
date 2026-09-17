<template>
  <div>
    <button
      :class="{ 'material-symbols-outlined': modelValue.icon?.startsWith('mdi:') }"
      class="btn btn-solid-primary"
      :popovertarget="popoverId"
      :style="{ 'anchor-name': anchorName }"
      type="button"
      @focus="ready = true"
      @mouseenter="ready = true"
    >
      {{ modelValue.icon?.replace("mdi:", "") || "+ Emoji" }}
    </button>
    <div
      :id="popoverId"
      :style="{ 'position-anchor': anchorName }"
      class="dropdown z-1"
      popover
      @toggle="onToggle"
    >
      <EmojiPicker
        v-if="ready"
        :additional-groups="{ material: mdIconsGroups }"
        :native="true"
        :theme="emojiTheme"
        class="picker"
        @select="onSelectEmoji"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { EmojiExt } from "vue3-emoji-picker";
import EmojiPicker from "vue3-emoji-picker";
import type { ConfiguredButtonOptsLabel } from "@localbytes/localdeck-codegen/virtuals/configured-button";
import "vue3-emoji-picker/css";
import { mdIconsGroups } from "~/utils/material";

const modelValue = defineModel<ConfiguredButtonOptsLabel>({ required: true });
const uid = useId();
const popoverId = `${uid}-popover`;
const anchorName = `--${uid}-anchor`;

// The emoji/icon grid is thousands of DOM nodes, so we don't mount it eagerly
// for every button's panel. Instead pre-warm it on hover/focus of the trigger
// (there's normally a beat before the actual click), falling back to mounting
// on toggle for keyboard/touch users who skip straight to opening it.
const ready = ref(false);
const onToggle = (e: ToggleEvent) => {
  if (e.newState === "open") ready.value = true;
};

const colorMode = useColorMode();

const emojiTheme = computed(() => (colorMode.value === "dark" ? "dark" : "light"));

const onSelectEmoji = (emoji: EmojiExt) => {
  const MdIcon = emoji.n.find((s) => s.startsWith("mdi:"));
  modelValue.value.icon = MdIcon ?? emoji.i;

  // Close popover after selection to match previous dropdown behavior.
  const popover = document.getElementById(popoverId);
  popover?.hidePopover();
};
</script>

<style scoped>
:deep(#material .v3-emojis > *:nth-child(n + 65)) {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px;
}
</style>
