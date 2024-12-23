<script setup lang="ts">
import SettingsCard from "@/components/settings/common/SettingsCard.vue";
import {ref} from "vue";
import {type EquipmentGroup, model} from "@/model/model.ts";
import {validateEquipmentGroup} from "@/model/validation.ts";
import EquipmentGroupTypeItem from "@/components/settings/equipmentGroups/EquipmentGroupTypeItem.vue";

const groupModel = defineModel<EquipmentGroup>({required: true});

defineEmits<{
  (name: "remove", value: string): void
}>();

const name = ref(groupModel.value.name);
const errors = ref<string[]>([]);

function addItem() {
  if (model.equipmentTypes.length === 0) {
    return;
  }

  groupModel.value.equipment.push(model.equipmentTypes[0]);
}

function removeItem(index: number) {
  groupModel.value.equipment.splice(index, 1);
}

function select(index: number, value: string) {
  console.log(`select ${index} + ${value}`);
  groupModel.value.equipment[index] = model.equipmentTypes.find(type => type.name === value)!;
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
  <SettingsCard @remove="$emit('remove', groupModel.name)" :errors="errors">
    <template #content>
      <input
          class="equipment-group-block"
          type="text"
          v-model="name"
          @input="validate()"
      />

      <div class="equipment-group-block equipment-type-container">
        <EquipmentGroupTypeItem
            v-for="[index, type] of groupModel.equipment.entries()"
            :key="type.id"
            :index="index"
            :selected="type.name"
            @select="select"
            @remove="removeItem"
        />

        <input type="button" value="Add" v-on:click="addItem()">
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