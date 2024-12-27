<script setup lang="ts">
import {useTemplateRef} from "vue";
import {isEmpty} from "@/utils/stringUtils.ts";

const props = defineProps<{
  src?: string | undefined;
  alt?: string | undefined;
  canSelect?: boolean;
}>();

const emit = defineEmits<{
  (name: "selectImage", image: File): void;
  (name: "clickImage"): void;
}>();

const imageInput = useTemplateRef("imageInput");
const emptyInput = useTemplateRef("emptyInput");

function onImageClick() {
  emit("clickImage");

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
  <div class="image-with-selector">
    <img
        class="image-with-selector-image"
        :src="isEmpty(src) ? '/src/assets/image-placeholder.svg' : src"
        :alt="isEmpty(alt) ? 'Image goes here' : alt"
        @click="onImageClick"
    >
    <input
        class="image-with-selector-secret"
        type="file"
        accept="image/*"
        ref="imageInput"
        @change="onImageSelected"
    >
    <input
        class="image-with-selector-secret"
        type="file"
        ref="emptyInput"
    />
  </div>
</template>

<style scoped>
.image-with-selector {
}

.image-with-selector-image {
  max-width: 100%;
  max-height: 100%;
  /*object-fit: contain;*/
  /*TODO: proper height restrictions for tall images*/
}

.image-with-selector-secret {
  display: none;
}
</style>