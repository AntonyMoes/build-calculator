<script setup lang="ts">
import RemoveButton from "@/components/common/RemoveButton.vue";
import {computed, ref} from "vue";
import {validateStatValue} from "@/model/validation.ts";
import {type Equipment, type StatValue} from "@/model/modelData.ts";
import {model} from "@/model/model.ts";
import ErrorsBlock from "@/components/common/ErrorsBlock.vue";

const props = defineProps<{
  index: number;
  parentModel: Equipment;
}>();

const statModel = defineModel<StatValue>({required: true});

defineEmits<{
  (name: "remove", index: number): void
}>();

const selectedStatName = ref(model.getStat(statModel.value.statId)!.name);

const value = ref(statModel.value.value);
const errors = ref<string[]>([]);

function validate(selectEvent: Event | undefined = undefined) {
  const statName = selectEvent === undefined
      ? selectedStatName.value
      : (selectEvent.target as unknown as { value: string }).value;
  const stat = model.data.stats.find(stat => stat.name === statName)!;

  const validationErrors = validateStatValue(stat, value.value);
  errors.value = validationErrors;

  if (validationErrors.length === 0) {
    statModel.value.value = value.value;
    statModel.value.statId = stat.id;
  }
}

const unusedStatsOrCurrent = computed(() => model.data.stats.filter(st => props.parentModel.stats.find(s => s.statId === st.id) === undefined || st.name === selectedStatName.value));
</script>

<template>
  <div class="equipment-item-stat">
    <select
        class="equipment-item-stat-block"
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
        class="equipment-item-stat-block"
        type="text"
        v-model.number="value"
        @input="validate()"
    />

    <ErrorsBlock :errors="errors"/>
    <RemoveButton @remove="$emit('remove', index)"/>
  </div>
</template>

<style scoped>
.equipment-item-stat {
  background-color: #343434;
  border: 1px solid #555555;
}

.equipment-item-stat-item {
  display: inline-block;
}

.equipment-item-stat-block {
  display: block;
}
</style>