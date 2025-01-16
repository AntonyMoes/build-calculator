<script setup lang="ts">
import SettingsCard from "@/components/settings/common/SettingsCard.vue";
import {ref} from "vue";
import {type EquipmentGroup, type EquipmentGroupId} from "@/model/modelData.ts";
import {model} from "@/model/model.ts";
import {validateEquipmentGroup} from "@/model/validation.ts";
import EquipmentGroupTypeItem from "@/components/settings/equipmentGroups/EquipmentGroupTypeItem.vue";

const groupModel = defineModel<EquipmentGroup>({required: true});

defineEmits<{
  (name: "remove", value: EquipmentGroupId): void
}>();

const name = ref(groupModel.value.name);
const errors = ref<string[]>([]);

function addItem() {
  if (model.data.equipmentTypes.length === 0) {
    alert("No equipment type to add.");
    return;
  }

  groupModel.value.equipmentTypeIds.push(model.data.equipmentTypes[0].id);
}

function removeItem(index: number) {
  groupModel.value.equipmentTypeIds.splice(index, 1);
}

function select(index: number, value: string) {
  groupModel.value.equipmentTypeIds[index] = model.data.equipmentTypes.find(type => type.name === value)!.id;
}

function validate() {
  const validationErrors = validateEquipmentGroup(groupModel.value.name, name.value);
  errors.value = validationErrors;

  if (validationErrors.length === 0) {
    groupModel.value.name = name.value;
  }
}
</script>

<template>
  <SettingsCard @remove="$emit('remove', groupModel.id)" :errors="errors">
    <template #content>
      <input
          class="equipment-group-block"
          type="text"
          v-model="name"
          @input="validate"
      />

      <div class="equipment-group-block equipment-type-container">
        <EquipmentGroupTypeItem
            v-for="[index, typeId] of groupModel.equipmentTypeIds.entries()"
            :key="typeId"
            :index="index"
            :parent-model="groupModel"
            @select="select"
            @remove="removeItem"
        />

        <input type="button" value="Add" v-on:click="addItem">
      </div>
    </template>
  </SettingsCard>
</template>

<style scoped>
.equipment-group-block {
  display: block;
}

.equipment-type-container {
  display: flex;
  flex-direction: column;
}
</style>