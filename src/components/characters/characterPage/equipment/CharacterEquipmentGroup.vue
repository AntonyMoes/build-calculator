<script setup lang="ts">
import {type CharacterEquipmentGroup, type CharacterEquipmentGroupId, type EquipmentId} from "@/model/modelData.ts";
import {model} from "@/model/model.ts";
import CharacterEquipmentSlot from "@/components/characters/characterPage/equipment/CharacterEquipmentSlot.vue";
import {computed, ref} from "vue";
import {hasValue, type Optional} from "@/utils/optional.ts";
import RemoveButton from "@/components/common/RemoveButton.vue";

const emit = defineEmits<{
  (name: "selectSlot", group: CharacterEquipmentGroup, slotIndex: number): void;
  (name: "remove", id: CharacterEquipmentGroupId): void;
}>();

const groupModel = defineModel<CharacterEquipmentGroup>({required: true});
const selectedGroup = ref(model.getEquipmentGroup(groupModel.value.groupId)!);
const selectedGroupName = ref(selectedGroup.value.name);
const equipmentTypes = computed(() => selectedGroup.value.equipmentTypeIds.map(id => model.getEquipmentType(id)!));
const equipment = computed<Optional<EquipmentId>[]>(() => {
  for (let i = 0; i < equipmentTypes.value.length; i += 1) {
    if (groupModel.value.equipment.length <= i) {
      groupModel.value.equipment.push(null);
      continue;
    }

    const equipmentId: Optional<EquipmentId> = groupModel.value.equipment[i];
    if (!hasValue(equipmentId)) {
      continue;
    }

    const eq = model.getEquipment(equipmentId);
    const type = equipmentTypes.value[i];
    if (eq?.typeId !== type.id) {
      groupModel.value.equipment[i] = null;
    }
  }

  return groupModel.value.equipment;
});

function updateGroup() {
  selectedGroup.value = model.data.equipmentGroups.find(group => group.name === selectedGroupName.value)!;
  groupModel.value.groupId = selectedGroup.value.id;
}

function onClickSlot(index: number) {
  emit("selectSlot", groupModel.value, index);
}
</script>

<template>
<div class="character-equipment-group">
  <select
      class="character-equipment-group-name"
      v-model="selectedGroupName"
      @change="updateGroup"
  >
    <option disabled value="">Select group</option>
    <option
        v-for="group in model.data.equipmentGroups"
        :key="group.id"
    >
      {{ group.name }}
    </option>
  </select>
  <RemoveButton class="settings-card-block" @remove="$emit('remove', groupModel.id)"/>

  <div class="character-equipment-group-slots">
    <CharacterEquipmentSlot
        v-for="[index, type] of equipmentTypes.entries()"
        :key="index"
        :type="type"
        :equipment-array="equipment"
        :index="index"
        @clickSlot="onClickSlot"
    />
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