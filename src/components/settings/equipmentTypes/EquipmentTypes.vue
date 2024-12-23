<script setup lang="ts">
import SettingsGroup from "@/components/settings/common/SettingsGroup.vue";
import {createId, model} from "@/model/model.ts";
import EquipmentType from "@/components/settings/equipmentTypes/EquipmentType.vue";

function add() {
  let newName = "equipment-type-new";
  while (model.equipmentTypes.find(type => type.name === newName) !== undefined) {
    newName += "-new";
  }

  model.equipmentTypes.push({
    id: createId(),
    name: newName,
  })
}

function remove(value: string) {
  const index = model.equipmentTypes.indexOf(model.equipmentTypes.find(type => type.name === value)!);
  if (index > -1) {
    model.equipmentTypes.splice(index, 1);
  }
}
</script>

<template>
  <div class="equipment-types">
    <SettingsGroup @add="add">
      <template #title>
        Equipment types
      </template>
      <template #items>
        <EquipmentType
            v-for="equipmentType in model.equipmentTypes"
            :key="equipmentType.id"
            :model-value="equipmentType"
            @remove="remove"
        />
      </template>
    </SettingsGroup>
  </div>
</template>

<style scoped>
.equipment-types {
  width: 200px;
}
</style>