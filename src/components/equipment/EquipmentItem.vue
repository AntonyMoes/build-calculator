<script setup lang="ts">
import {createId, type Equipment, model, type Stat} from "@/model/model.ts";
import RemoveButton from "@/components/common/RemoveButton.vue";
import EquipmentItemStat from "@/components/equipment/EquipmentItemStat.vue";

const equipmentModel = defineModel<Equipment>({required: true});

defineEmits<{
  (name: "remove", id: number): void;
}>();

function removeStat(index: number) {
  equipmentModel.value.stats.splice(index, 1);
}

function addStat() {
  if (model.stats.length === 0) {
    alert("No stat to add.");
    return;
  }

  let newStat: Stat | undefined = undefined;
  for (const stat of model.stats) {
    if (equipmentModel.value.stats.find(s => s.statId === stat.id) !== undefined) {
      continue;
    }

    newStat = stat;
    break;
  }

  if (newStat === undefined) {
    alert("No stat to add.");
    return;
  }

  equipmentModel.value.stats.push({
    id: createId(),
    statId: newStat.id,
    value: newStat.minValue === undefined ? 0 : newStat.minValue,
  })
}
</script>

<template>
  <div class="equipment-item">
    <input
        class="equipment-item-block"
        type="text"
        v-model="equipmentModel.name"
    />
    <RemoveButton class="equipment-item-block" @remove="$emit('remove', equipmentModel.id)"/>
<!--  TODO: proper image selection  -->
    <img
        class="equipment-item-img"
        src="data:image/webp;base64,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"
        alt="Oh well"
    >
    <EquipmentItemStat
        v-for="[index, item] of equipmentModel.stats.entries()"
        :key="item.id"
        :index="index"
        :parent-model="equipmentModel"
        :model-value="item"
        @remove="removeStat"
    />
    <input type="button" value="Add" v-on:click="addStat">
  </div>
</template>

<style scoped>
.equipment-item {
  width: 200px;
  height: fit-content;
  background-color: #282828;
}

.equipment-item-block {
  display: inline-block;
}

.equipment-item-img {
  border: 1px solid #777777;
  max-width: 120px;
  max-height: 120px;
}
</style>