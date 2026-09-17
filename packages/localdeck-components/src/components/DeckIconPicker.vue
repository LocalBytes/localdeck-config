<template>
  <div>
    <button
      :class="{ 'material-symbols-outlined': modelValue.icon?.startsWith('mdi:') }"
      class="btn btn-solid-primary"
      :popovertarget="popoverId"
      :style="{ 'anchor-name': anchorName }"
      type="button"
    >
      {{ modelValue.icon?.replace("mdi:", "") || "+ Emoji" }}
    </button>
    <div :id="popoverId" :style="{ 'position-anchor': anchorName }" class="dropdown z-1" popover>
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

// Render the (large, hidden) emoji grid off the initial mount path so the button
// itself appears instantly; it's still ready well before a user can click it.
const ready = ref(false);
onMounted(() => setTimeout(() => (ready.value = true)));

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
