<template>
  <div class="rounded p-2 shadow">
    <p>Label</p>

    <details class="dropdown">
      <summary ref="contentEl" class="btn btn-primary">{{ modelValue.label.icon || "Emoji" }}</summary>
      <div class="dropdown-content pt-2">

        <EmojiPicker
            :native="true"
            :theme="colorMode.value as ('light'|'dark')"
            class="dropdown-content"
            @select="onSelectEmoji"/>
      </div>
    </details>

    <div class="form-control">
      <!--      <label class="label">-->
      <!--        <span class="label-text">Label</span>-->
      <!--      </label>-->
      <textarea
          v-model="modelValue.label.text"
          class="input input-bordered" placeholder="Type here" type="text"
      />
    </div>


    <!--    <div class="form-control">-->
    <!--      <label class="label">-->
    <!--        <span class="label-text">Alignment</span>-->

    <!--      <div class="flex">-->
    <!--        <label v-for="(v,k) in {s:'Start',c:'Center',e: 'End'}" :key="k" class="label cursor-pointer">-->
    <!--          <span class="label-text">{{v}}</span>-->
    <!--          <input :value="k" checked class="radio ml-1" name="alignment" type="radio"/>-->
    <!--        </label>-->

    <!--      </div>-->
    <!--      </label>-->
    <!--    </div>-->

    <div class="form-control">
      <label class="size">
        <span class="label-text">Size</span>

      </label>
      <div class="join join-horizontal">
        <input v-model="modelValue.label.fontSize" class="input" max="20" min="4" type="range"/>
        <input v-model="modelValue.label.fontSize" class="input" max="20" min="4" type="number"/>
      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import type {EditContainer} from "../../../../../macropad-config/packages/macropad-configurator/src/lib/PadCfg";
import type {EmojiExt} from 'vue3-emoji-picker';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';

const colorMode = useColorMode();
const contentEl = ref<HTMLDetailsElement>();
const modelValue = defineModel<EditContainer>({required: true});

const onSelectEmoji = (emoji: EmojiExt) => {
  console.log(emoji);
  modelValue.value.label.icon = emoji.i;
  contentEl.value?.click();
}
</script>
