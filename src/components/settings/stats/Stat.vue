<script setup lang="ts">
import SettingsCard from "@/components/settings/common/SettingsCard.vue";
import {ref} from "vue";
import {type Stat} from "@/model/modelData.ts";
import {fromOptional, optional} from "@/utils/optional.ts";
import {validateStat} from "@/model/validation.ts";

const model = defineModel<Stat>({required: true});

defineEmits<{
  (name: "remove", value: string): void
}>();

const name = ref(model.value.name);
const errors = ref<string[]>([]);
const minValue = optional(0, model.value.minValue);
const maxValue = optional(0, model.value.maxValue);

function validate() {
  const min = fromOptional(minValue.toggle.value, minValue.value.value);
  const max = fromOptional(maxValue.toggle.value, maxValue.value.value);
  const validationErrors = validateStat(model.value.name, name.value, min, max);
  errors.value = validationErrors;

  if (validationErrors.length === 0) {
    model.value.name = name.value;
    model.value.minValue = min;
    model.value.maxValue = max;
  }
}
</script>

<template>
  <SettingsCard @remove="$emit('remove', model.name)" :errors="errors">
    <template #content>
      <input
          class="stat-block"
          type="text"
          v-model="name"
          @input="validate"
      />
      <div class="stat-block">
        <p>Min: </p>
        <input
            class="stat-item"
            type="checkbox"
            v-model="minValue.toggle.value"
            @change="validate"
        />
        <input
            class="stat-item"
            type="number"
            v-model.number="minValue.value.value"
            @input="validate"
            :class="{ disabled: !minValue.toggle.value }"
            :disabled="!minValue.toggle.value"
        />
      </div>
      <div class="stat-block">
        <p>Max: </p>
        <input
            class="stat-item"
            type="checkbox"
            v-model="maxValue.toggle.value"
            @change="validate"
        />
        <input
            class="stat-item"
            type="number"
            v-model.number="maxValue.value.value"
            @input="validate"
            :class="{ disabled: !maxValue.toggle.value }"
            :disabled="!maxValue.toggle.value"
        />
      </div>
    </template>
  </SettingsCard>
</template>

<style scoped>
.stat-item {
  display: inline-block;
}

.stat-block {
  display: block;
}
</style>