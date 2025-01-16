<script setup lang="ts">
import CharacterSlot from "@/components/characters/characterList/CharacterSlot.vue";
import type {Character, CharacterId} from "@/model/modelData.ts";
import SelectedImage from "@/components/common/SelectedImage.vue";

defineEmits<{
  (name: "click", id: CharacterId): void;
}>();

const model = defineModel<Character>({required: true});
</script>

<template>
  <CharacterSlot @click="$emit('click', model.id)">
    <template #content>
      <SelectedImage
          class="character-item"
          :src="model.imageSrc"
          :alt="model.name"
      />
    </template>
  </CharacterSlot>
</template>

<style scoped>
.character-item {
  width: 100%;
  height: 100%;
}
</style>