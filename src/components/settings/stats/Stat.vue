<script setup lang="ts">
import SettingsCard from "@/components/settings/common/SettingsCard.vue";
import {ref} from "vue";
import {validateStatName} from "@/model.ts";

const model = defineModel<{
  name: string,
}>({required: true});

defineEmits<{
  (name: "remove", value: string): void
}>();

const value = ref<string>();
const error = ref<string | undefined>();

value.value = model.value.name;

function validateInput(event: InputEvent) {
  const value = (event.target as unknown as { value: string; }).value;
  const validationError = validateStatName(value);
  error.value = validationError;

  if (validationError === undefined) {
    model.value.name = value;
  }
}
</script>

<template>
  <SettingsCard @remove="$emit('remove', model.name)">
    <template #content>
      <input
          type="text"
          v-model="value"
          @input="validateInput($event as InputEvent)"
      />
      <p v-if="error !== undefined" class="stat-error">{{ error }}</p>
    </template>
  </SettingsCard>
</template>

<style scoped>
.stat-error {
  display: block;
}
</style>