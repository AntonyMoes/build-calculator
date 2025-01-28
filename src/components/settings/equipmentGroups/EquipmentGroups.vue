<script setup lang="ts">
import SettingsGroup from "@/components/settings/common/SettingsGroup.vue";
import {type EquipmentGroupId} from "@/model/modelData.ts";
import {model} from "@/model/model.ts";
import EquipmentGroup from "@/components/settings/equipmentGroups/EquipmentGroup.vue";

function add() {
  let newName = "equipment-group-new";
  while (model.data.equipmentGroups.find(group => group.name === newName) !== undefined) {
    newName += "-new";
  }

  model.data.equipmentGroups.push({
    id: model.createId(),
    name: newName,
    equipmentTypeIds: []
  })
}

function remove(id: EquipmentGroupId) {
  const index = model.data.equipmentGroups.findIndex(group => group.id === id);
  if (index > -1) {
    model.data.equipmentGroups.splice(index, 1);
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
            v-for="equipmentGroup in model.data.equipmentGroups"
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