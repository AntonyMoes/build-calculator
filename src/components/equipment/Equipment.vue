<script setup lang="ts">

import EquipmentItem from "@/components/equipment/EquipmentItem.vue";
import {type EquipmentId} from "@/model/modelData.ts";
import {model} from "@/model/model.ts";

function add() {
  if (model.data.equipmentTypes.length === 0) {
    alert("No equipment types.");
    return;
  }

  model.data.equipment.push({
    id: model.createId(),
    typeId: model.data.equipmentTypes[0].id,
    name: "equipment-name",
    imageSrc: "",
    stats: []
  })
}

function remove(id: EquipmentId) {
  const index = model.data.equipment.findIndex(equipment => equipment.id === id);
  if (index > -1) {
    model.data.equipment.splice(index, 1);
  }
}
</script>

<template>
  <div class="page-container equipment">
    <EquipmentItem
        v-for="equipment of model.data.equipment"
        :key="equipment.id"
        :model-value="equipment"
        @remove="remove"
    />

    <input
        class="equipment-item-add"
        type="button"
        value="Add"
        v-on:click="add"
    >
  </div>
</template>

<style scoped>
.equipment {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
}

.equipment-item-add {
  width: 80px;
  height: 50px;
}
</style>