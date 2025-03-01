<template>
  <div
    ref="padGridItem"
    :aria-label="`DeckButton ${container.keyNum.toFixed(0).padStart(2, '0')}`"
    :class="{ 'shadow-lg shadow-yellow-300': editing, 'printmode': print }"
    :data-keynum="container.keyNum"
    role="button"
    class="pad-grid-item"
  >
    <p
      v-if="!print"
      class="position-fixed keynum"
    >
      {{ container.keyNum }}
    </p>
    <p
      v-if="container.label.icon"
      :class="{ 'material-symbols-outlined': container.label.icon.startsWith('mdi:') }"
      class="text-center icon"
    >
      {{ container.label.icon.replace("mdi:", "") }}
    </p>
    <p
      ref="labelRef"
      :style="{ fontSize: (print?fontSize:fontSizeScaled) + 'px' }"
      class="label-bottom"
    >
      {{ container.label.text }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useFontSizes, useIsPrinting } from '~/utils/hooks';
import type { EditContainer } from '~/utils/PadCfg';

const padGridItem = ref<HTMLDivElement>();
const print = useIsPrinting();

const props = defineProps({
  container: { required: true, type: Object as PropType<EditContainer> },
  editing: { type: Boolean, default: false },
});

const sizes = useFontSizes();

const fontSize = computed(() => props.container?.label.fontSize ?? 14);
const fontSizeScaled = computed(() => fontSize.value * sizes.scaleFactor);
</script>

<style scoped>
.printmode {
  margin: 0;

  height: 14mm;
  width: 14mm;

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
  bottom: 2px;
  content: attr(data-font-size);

  white-space: pre-wrap;
  text-wrap: balance;
}
</style>
