<script setup lang="ts">
import SettingsCard from "@/components/settings/common/SettingsCard.vue";
import {model} from "@/model/model.ts";
import {ref} from "vue";

const props = defineProps<{
  selected: string;
  index: number;
}>();

defineEmits<{
  (name: "remove", index: number): void
  (name: "select", index: number, value: string): void
}>();

const selectedRef = ref(props.selected);

</script>

<template>
  <SettingsCard @remove="$emit('remove', index)" :errors="errors">
    <template #content>
      <select
          class="equipment-group-type-item-block"
          v-model="selectedRef"
          @change="$emit('select', index, selectedRef)"
      >
        <option disabled value="">Select type</option>
        <option
            v-for="type in model.equipmentTypes"
            :id="type.id"
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