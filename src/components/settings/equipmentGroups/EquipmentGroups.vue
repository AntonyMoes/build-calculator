<script setup lang="ts">
import SettingsGroup from "@/components/settings/common/SettingsGroup.vue";
import {createId, type EquipmentGroupId, model} from "@/model/model.ts";
import EquipmentGroup from "@/components/settings/equipmentGroups/EquipmentGroup.vue";

function add() {
  let newName = "equipment-group-new";
  while (model.equipmentGroups.find(group => group.name === newName) !== undefined) {
    newName += "-new";
  }

  model.equipmentGroups.push({
    id: createId(),
    name: newName,
    equipmentTypeIds: []
  })
}

function remove(id: EquipmentGroupId) {
  const index = model.equipmentGroups.indexOf(model.equipmentGroups.find(group => group.id === id)!);
  if (index > -1) {
    model.equipmentGroups.splice(index, 1);
  }
}
</script>

<template>
  <div class="equipment-groups">
    <SettingsGroup @add="add">
      <template #title>
        Equipment groups
      </template>
      <template #items>
        <EquipmentGroup
            v-for="equipmentGroup in model.equipmentGroups"
            :key="equipmentGroup.id"
            :model-value="equipmentGroup"
            @remove="remove"
        />
      </template>
    </SettingsGroup>
  </div>
</template>

<style scoped>
.equipment-groups {
  width: 200px;
}
</style>