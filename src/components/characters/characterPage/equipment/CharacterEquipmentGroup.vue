<script setup lang="ts">
import {type CharacterEquipmentGroup, type Equipment, model} from "@/model/model.ts";
import CharacterEquipmentSlot from "@/components/characters/characterPage/equipment/CharacterEquipmentSlot.vue";
import {getEquipmentGroup, getEquipmentType} from "@/model/getters.ts";
import {computed, ref} from "vue";

const groupModel = defineModel<CharacterEquipmentGroup>({required: true});
const selectedGroup = ref(getEquipmentGroup(groupModel.value.groupId)!);
const selectedGroupName = ref(selectedGroup.value.name);
const equipmentTypes = computed(() => selectedGroup.value.equipmentTypeIds.map(id => getEquipmentType(id)!));
const equipment = computed<(Equipment | null)[]>(() => {
  for (let i = 0; i < equipmentTypes.value.length; i += 1) {
    if (groupModel.value.equipment.length <= i) {
      groupModel.value.equipment.push(null);
      continue;
    }

    const equipment: Equipment | null = groupModel.value.equipment[i];
    if (equipment === null) {
      continue;
    }

    const type = equipmentTypes.value[i];
    if (equipment.typeId !== type.id) {
      equipmentTypes.value[i] = null;
    }
  }

  return groupModel.value.equipment;
});

function updateGroup() {
  selectedGroup.value = model.equipmentGroups.find(group => group.name === selectedGroupName.value)!;
  groupModel.value.groupId = selectedGroup.value.id;
}
</script>

<template>
<div class="character-equipment-group">
  <!-- TODO: group type selector -->
  <select
      class="character-equipment-group-name"
      v-model="selectedGroupName"
      @change="updateGroup"
  >
    <option disabled value="">Select group</option>
    <option
        v-for="group in model.equipmentGroups"
        :key="group.id"
    >
      {{ group.name }}
    </option>
  </select>

  <div class="character-equipment-group-slots">
<!--    TODO :key=""-->
    <CharacterEquipmentSlot
        v-for="[index, type] of equipmentTypes.entries()"
        :key="index"
        :type="type"
        :equipment-array="equipment"
        :index="index"/>
  </div>
</div>
</template>

<style scoped>
.character-equipment-group {

}

.character-equipment-group-name {

}

.character-equipment-group-slots {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>