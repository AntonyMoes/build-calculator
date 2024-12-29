<script setup lang="ts">
import {useTemplateRef} from "vue";
import {isEmpty} from "@/utils/stringUtils.ts";

const props = defineProps<{
  src?: string | undefined;
  alt?: string | undefined;
  canSelect?: boolean;
  disableHover?: boolean;
}>();

const emit = defineEmits<{
  (name: "selectImage", image: File): void;
}>();

const imageInput = useTemplateRef("imageInput");
const emptyInput = useTemplateRef("emptyInput");

function onImageClick() {
  if (props.canSelect) {
    imageInput.value!.click();
  }
}

async function onImageSelected() {
  const file = imageInput.value!.files![0];
  imageInput.value!.files = emptyInput.value!.files;

  emit("selectImage", file);
}
</script>

<template>
  <div
      :class="{'selected-image': true, 'selected-image-hover': !disableHover}"
      @click="onImageClick"
  >
    <img
        class="selected-image-image"
        :src="isEmpty(src) ? '/src/assets/image-placeholder.svg' : src"
        :alt="isEmpty(alt) ? 'Image goes here' : alt"
    >
    <input
        class="selected-image-secret"
        type="file"
        accept="image/*"
        ref="imageInput"
        @change="onImageSelected"
    >
    <input
        class="selected-image-secret"
        type="file"
        ref="emptyInput"
    />
  </div>
</template>

<style scoped>
.selected-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.selected-image-hover:hover,
.selected-image-hover:focus {
  filter: brightness(70%);
  cursor: pointer;
}

.selected-image-image {
  max-width: 100%;
  max-height: 100%;
}

.selected-image-secret {
  display: none;
}
</style>