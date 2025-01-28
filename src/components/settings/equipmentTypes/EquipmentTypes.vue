<script setup lang="ts">
import SettingsGroup from "@/components/settings/common/SettingsGroup.vue";
import {model} from "@/model/model.ts";
import EquipmentType from "@/components/settings/equipmentTypes/EquipmentType.vue";

function add() {
  let newName = "equipment-type-new";
  while (model.data.equipmentTypes.find(type => type.name === newName) !== undefined) {
    newName += "-new";
  }

  model.data.equipmentTypes.push({
    id: model.createId(),
    name: newName,
  })
}

function remove(value: string) {
  const index = model.data.equipmentTypes.findIndex(type => type.name === value);
  if (index > -1) {
    model.data.equipmentTypes.splice(index, 1);
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
            v-for="equipmentType in model.data.equipmentTypes"
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