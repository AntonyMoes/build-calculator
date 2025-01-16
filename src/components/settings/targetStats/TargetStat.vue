<script setup lang="ts">
import SettingsCard from "@/components/settings/common/SettingsCard.vue";
import {ref} from "vue";
import {type TargetStat} from "@/model/modelData.ts";
import {validateTargetStat} from "@/model/validation.ts";

const model = defineModel<TargetStat>({required: true});

defineEmits<{
  (name: "remove", value: string): void
}>();

const name = ref(model.value.name);
const formula = ref(model.value.formula);
const errors = ref<string[]>([]);

function validate() {
  const {validationErrors, tokenization} = validateTargetStat(model.value.name, name.value, formula.value);
  errors.value = validationErrors;

  if (validationErrors.length === 0) {
    model.value.name = name.value;
    model.value.formula = formula.value;
    model.value.tokenization = tokenization;
  }
}
</script>

<template>
  <SettingsCard @remove="$emit('remove', model.name)" :errors="errors">
    <template #content>
      <input
          class="target-stat-block"
          type="text"
          v-model="name"
          @input="validate"
      />
      <div class="stat-block">
        <p>Formula</p>
        <input
            class="target-stat-item"
            type="text"
            v-model="formula"
            @input="validate"
        />
      </div>
    </template>
  </SettingsCard>
</template>

<style scoped>
.target-stat-item {
  display: inline-block;
}

.target-stat-block {
  display: block;
}
</style>