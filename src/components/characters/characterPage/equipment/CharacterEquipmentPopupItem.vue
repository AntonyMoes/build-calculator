<script setup lang="ts">
import SelectedImage from "@/components/common/SelectedImage.vue";
import type {Equipment} from "@/model/modelData.ts";
import {computed} from "vue";
import {getDisplayName} from "@/components/characters/characterPage/utils.ts";
import type {Optional} from "@/utils/optional.ts";

const props = defineProps<{
  equipment: Optional<Equipment>;
  equipped: boolean;
  selected: boolean;
}>();

defineEmits<{
  (name: "selectEquipment", equipment: Optional<Equipment>): void;
}>();

const displayName = getDisplayName(props.equipment);
const itemClass = computed(() => props.selected
    ? "character-equipment-item-selected"
    : props.equipped
        ? "character-equipment-item-equipped"
        : "character-equipment-item-default");
</script>

<template>
  <div :class="`character-equipment-item ${itemClass}`" @click="$emit('selectEquipment', equipment)">
    <p
        class="character-equipment-item-name"
        :title="displayName"
    >
      {{ displayName }}
    </p>
    <SelectedImage
        class="character-equipment-item-image"
        :src="equipment === null ? '/src/assets/none.svg' : equipment.imageSrc"
        alt="equipment"
        :disableHover="true"
    />
  </div>
</template>

<style scoped>
.character-equipment-item {
  width: 100px;
  height: 150px;
  display: flex;
  flex-direction: column;
  /*gap: 10px;*/
}

.character-equipment-item:hover,
.character-equipment-item:focus {
  filter: brightness(70%);
  cursor: pointer;
}

.character-equipment-item-equipped {
  border: 2px dashed #999999;
  padding: 3px;
}

.character-equipment-item-selected {
  border: 2px solid #999999;
  padding: 3px;
}

.character-equipment-item-default {
  border: 1px solid #555555;
  padding: 4px;
}

.character-equipment-item-name {
  width: 90px;
  height: 50px;
  /*white-space: nowrap;*/
  overflow: hidden;
}


.character-equipment-item-image {
  width: 90px;
  height: 90px;
}
</style>