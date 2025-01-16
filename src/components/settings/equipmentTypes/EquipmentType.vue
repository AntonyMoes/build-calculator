<script setup lang="ts">
import SettingsCard from "@/components/settings/common/SettingsCard.vue";
import {ref} from "vue";
import {type EquipmentType} from "@/model/modelData.ts";
import {validateEquipmentType} from "@/model/validation.ts";

const model = defineModel<EquipmentType>({required: true});

defineEmits<{
  (name: "remove", value: string): void
}>();

const name = ref(model.value.name);
const errors = ref<string[]>([]);

function validate() {
  const validationErrors = validateEquipmentType(model.value.name, name.value);
  errors.value = validationErrors;

  if (validationErrors.length === 0) {
    model.value.name = name.value;
  }
}
</script>

<template>
  <SettingsCard @remove="$emit('remove', model.name)" :errors="errors">
    <template #content>
      <input
          class="equipment-type-block"
          type="text"
          v-model="name"
          @input="validate"
      />
    </template>
  </SettingsCard>
</template>

<style scoped>
.equipment-type-block {
  display: block;
}
</style>