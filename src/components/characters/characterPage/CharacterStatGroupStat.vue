<script setup lang="ts">
import type {CharacterStatGroupId, CharacterStatLevel, StatValue} from "@/model/modelData.ts";
import {computed, ref} from "vue";
import {model} from "@/model/model.ts";
import {validateStatValue} from "@/model/validation.ts";
import ErrorsBlock from "@/components/common/ErrorsBlock.vue";
import RemoveButton from "@/components/common/RemoveButton.vue";

const props = defineProps<{
  level: CharacterStatLevel
}>();

const valueModel = defineModel<StatValue>({required: true});

defineEmits<{
  (name: "remove", id: CharacterStatGroupId): void
}>();

const selectedStatName = ref(model.getStat(valueModel.value.statId)!.name);

const value = ref(valueModel.value.value);
const errors = ref<string[]>([]);

function validate(selectEvent: Event | undefined = undefined) {
  const statName = selectEvent === undefined
      ? selectedStatName.value
      : (selectEvent.target as unknown as { value: string }).value;
  const stat = model.data.stats.find(stat => stat.name === statName)!;

  const validationErrors = validateStatValue(stat, value.value);
  errors.value = validationErrors;

  if (validationErrors.length === 0) {
    valueModel.value.value = value.value;
    valueModel.value.statId = stat.id;
  }
}

const unusedStatsOrCurrent = computed(() => model.data.stats.filter(st => props.level.stats.find(s => s.statId === st.id) === undefined || st.name === selectedStatName.value));
</script>

<template>
  <div class="character-stat-group-stat">
    <select
        class="character-stat-group-stat-item"
        v-model="selectedStatName"
        @change="validate($event)"
    >
      <option disabled value="">Select stat</option>
      <option
          v-for="stat in unusedStatsOrCurrent"
          :key="stat.id"
      >
        {{ stat.name }}
      </option>
    </select>

    <input
        class="character-stat-group-stat-item"
        type="text"
        v-model.number="value"
        @input="validate()"
    />

    <RemoveButton class="character-stat-group-stat-item" @remove="$emit('remove', valueModel.statId)"/>
    <ErrorsBlock :errors="errors"/>
  </div>
</template>

<style scoped>
.character-stat-group-stat {
}

.character-stat-group-stat-item {
  display: inline;
}
</style>