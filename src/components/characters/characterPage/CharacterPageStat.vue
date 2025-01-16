<script setup lang="ts">
import ErrorsBlock from "@/components/common/ErrorsBlock.vue";
import {ref} from "vue";
import type {StatValue} from "@/model/modelData.ts";
import {validateStatValue} from "@/model/validation.ts";
import {model} from "@/model/model.ts";

const valueModel = defineModel<StatValue>({required: true});

const stat = model.getStat(valueModel.value.statId)!;

const value = ref(valueModel.value.value);
const errors = ref<string[]>([]);

function validate() {
  const validationErrors = validateStatValue(stat, value.value);
  errors.value = validationErrors;

  if (validationErrors.length === 0) {
    valueModel.value.value = value.value;
  }
}
</script>

<template>
 <div class="character-page-stat">
   <label
       class="character-page-stat-name"
       :for="stat.id"
   >
     {{ stat.name }}
   </label>
   <input
       class="character-page-stat-input"
       :id="stat.id"
       v-model.number="value"
       @input="validate"
   >
   <ErrorsBlock :errors="errors"/>
 </div>
</template>

<style scoped>
.character-page-stat {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  max-width: 20rem;
}

.character-page-stat-name {
  max-width: 5rem;
  word-wrap: anywhere;
}

.character-page-stat-input {
  width: 100%;
  height: 1.5rem;
}
</style>