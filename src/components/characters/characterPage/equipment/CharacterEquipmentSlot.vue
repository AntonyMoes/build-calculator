<script setup lang="ts">
import type {Equipment, EquipmentType} from "@/model/model.ts";
import {computed} from "vue";
import {isEmpty} from "@/utils/stringUtils.ts";

const props = defineProps<{
  type: EquipmentType,
  equipmentArray: (Equipment | null)[],
  index: number
}>();

const equipment = computed<Equipment | null>(() => props.equipmentArray[props.index]);
</script>

<template>
<div class="character-equipment-slot">
  <img
      :src="equipment === null || isEmpty(equipment.imageSrc) ? '/src/assets/none.svg' : equipment.imageSrc"
      alt="Whatever"
  >
</div>
</template>

<style scoped>
.character-equipment-slot {

}
</style>