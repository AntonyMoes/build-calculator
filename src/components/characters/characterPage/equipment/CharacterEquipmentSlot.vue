<script setup lang="ts">
import type {EquipmentId, EquipmentType} from "@/model/modelData.ts";
import {computed} from "vue";
import SelectedImage from "@/components/common/SelectedImage.vue";
import {model} from "@/model/model.ts";
import {hasValue, type Optional} from "@/utils/optional.ts";

const props = defineProps<{
  type: EquipmentType,
  equipmentArray: Optional<EquipmentId>[],
  index: number
}>();

const emit = defineEmits<{
  (name: "clickSlot", index: number): void;
}>();

const equipmentId = computed<Optional<EquipmentId>>(() => props.equipmentArray[props.index]);

function onClick() {
  emit("clickSlot", props.index);
}
</script>

<template>
  <SelectedImage
      class="character-equipment-slot"
      :src="!hasValue(equipmentId) ? '/src/assets/none.svg' : model.getEquipment(equipmentId)!.imageSrc"
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