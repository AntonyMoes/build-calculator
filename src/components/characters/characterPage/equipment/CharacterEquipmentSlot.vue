<script setup lang="ts">
import type {EquipmentId, EquipmentType} from "@/model/model.ts";
import {computed} from "vue";
import SelectedImage from "@/components/common/SelectedImage.vue";
import {getEquipment} from "@/model/getters.ts";

const props = defineProps<{
  type: EquipmentType,
  equipmentArray: (EquipmentId | null)[],
  index: number
}>();

const emit = defineEmits<{
  (name: "clickSlot", index: number): void;
}>();

const equipmentId = computed<Equipment | null>(() => props.equipmentArray[props.index]);

function onClick() {
  emit("clickSlot", props.index);
}
</script>

<template>
  <SelectedImage
      class="character-equipment-slot"
      :src="equipmentId === null ? '/src/assets/none.svg' : getEquipment(equipmentId)!.imageSrc"
      alt="Whatever"
      @click="onClick"
  />
</template>

<style scoped>
.character-equipment-slot {
  border: 1px solid #777777;
  height: 60px;
  width: 60px;
}
</style>