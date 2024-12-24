<script setup lang="ts">
import SettingsCard from "@/components/settings/common/SettingsCard.vue";
import {type EquipmentGroup, model} from "@/model/model.ts";
import {getEquipmentType} from "@/model/getters.ts";
import {computed} from "vue";

const props = defineProps<{
  index: number;
  parentModel: EquipmentGroup;
}>();

defineEmits<{
  (name: "remove", index: number): void
  (name: "select", index: number, value: string): void
}>();

const name = computed(() => getEquipmentType(props.parentModel.equipmentTypeIds[props.index])!.name);

function nameFromEvent(event: Event) {
  return (event.target as unknown as {value: string}).value;
}
</script>

<template>
  <SettingsCard @remove="$emit('remove', index)">
    <template #content>
      <select
          class="equipment-group-type-item-block"
          :value="name"
          @change="$emit('select', index, nameFromEvent($event))"
      >
        <option disabled value="">Select type</option>
        <option
            v-for="type in model.equipmentTypes"
            :key="type.id"
        >
          {{ type.name }}
        </option>
      </select>
    </template>
  </SettingsCard>
</template>

<style scoped>
.equipment-group-type-item-block {
  display: block;
}
</style>