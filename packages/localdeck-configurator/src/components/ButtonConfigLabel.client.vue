<template>
  <div class="rounded p-2 shadow grow flex flex-col gap-2 ">
    <h3 class="pb-2">Label</h3>

    <div class="flex">
      <div class="dropdown-container">
        <div class="dropdown">
          <label
              ref="dropdownButton"
              class="btn btn-solid-primary"
              tabindex="0"
          >{{ modelValue.label.icon || "+ Emoji" }}</label>
          <EmojiPicker
              :native="true"
              :theme="colorMode.value as ('light'|'dark')"
              class="dropdown-menu dropdown-menu-bottom-center"
              @select="onSelectEmoji"/>
        </div>

      </div>
      <button v-if="modelValue.label.icon" class="btn btn-outline-danger" type="button"
              @click="modelValue.label.icon=null">
        X
      </button>
    </div>
    <textarea
        v-model="modelValue.label.text"
        class="textarea" placeholder="Type here"
        rows="3"
        type="text"
    />


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

    <label>
      Size
      <span class="flex gap-2">
      <input v-model="modelValue.label.fontSize" :disabled="!modelValue.label.text"
             class="input"
             max="20"
             min="4"
             type="range"/>
      <input v-model="modelValue.label.fontSize" :disabled="!modelValue.label.text"
             class="input w-[5rem]" max="20" min="4"

             type="number"
      />
        </span>
    </label>

  </div>
</template>
<script lang="ts" setup>

import type {EmojiExt} from 'vue3-emoji-picker';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import type {EditContainer} from "~/lib/PadCfg";

const colorMode = useColorMode();
const modelValue = defineModel<EditContainer>({required: true});

const dropdownButton = ref<HTMLDivElement>();

const onSelectEmoji = (emoji: EmojiExt) => modelValue.value.label.icon = emoji.i
</script>
