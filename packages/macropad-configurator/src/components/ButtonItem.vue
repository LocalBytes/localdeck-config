<template>
  <div ref="padGridItem" :class="{'shadow-lg shadow-yellow-300':editing, 'printmode':print}" class="pad-grid-item">
    <p v-if="!print" class="position-fixed keynum">{{ container.keyNum }}</p>
    <p v-if="container.label.icon" class="text-center icon">{{ container.label.icon }}</p>
    <p
        ref="labelRef"
        :style="{fontSize: (print?fontSize:fontSizeScaled) + 'px'}"
        class="label-bottom"
    >{{ container.label.text }}</p>
  </div>
</template>
<script lang="ts" setup>
import type {EditContainer} from "../../../../../macropad-config/packages/macropad-configurator/src/lib/PadCfg";
import type {PropType} from "vue";

const padGridItem = ref<HTMLDivElement>();

const props = defineProps({
  container: {required: true, type: Object as PropType<EditContainer>},
  editing: {type: Boolean, default: false},
  print: {type: Boolean, default: false},
});

const fontSize = computed(() => props.container?.label.fontSize ?? 14);
const fontSizeScaled = computed(() => {
  const dpi = ((typeof window !== "undefined" ? window?.devicePixelRatio : null) ?? 1);
  return fontSize.value * dpi;
});

</script>

<style scoped>
.printmode {
  margin: 0;

  .icon {
  }
}


.pad-grid-item {
  position: relative;
}

.keynum {
  position: absolute;
  opacity: 0.8;
  top: -2px;
  margin: 0;
  padding: 0;
}

.icon {
  font-size: 1.5em;
  text-align: center;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.label-bottom {
  text-align: center;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1.2em;
  content: attr(data-font-size);
}

</style>
