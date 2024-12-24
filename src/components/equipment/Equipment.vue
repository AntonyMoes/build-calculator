<script setup lang="ts">

import EquipmentItem from "@/components/equipment/EquipmentItem.vue";
import {createId, model} from "@/model/model.ts";

function add() {
  model.equipment.push({
    id: createId(),
    name: "equipment-name",
    stats: []
  })
}

function remove(id: number) {
  const index = model.equipment.findIndex(equipment => equipment.id === id);
  if (index > -1) {
    model.equipment.splice(index, 1);
  }
}
</script>

<template>
  <div class="page-container equipment">
    <EquipmentItem
        v-for="equipment of model.equipment"
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