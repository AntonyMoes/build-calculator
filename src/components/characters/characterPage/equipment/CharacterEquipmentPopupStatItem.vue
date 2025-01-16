<script setup lang="ts">
import {computed} from "vue";
import {formatValue} from "@/components/characters/characterPage/utils.ts";
import type {Equipment, StatId} from "@/model/modelData.ts";
import {model} from "@/model/model.ts";

const props = defineProps<{
  statId: StatId;
  equipped: Equipment | null;
  selected: Equipment | null;
}>();

const stat = computed(() => model.getStat(props.statId)!);
const equippedValue = computed(() => getValue(props.equipped));
const selectedValue = computed(() => getValue(props.selected));
const delta = computed(() => selectedValue.value - equippedValue.value);
const increase = computed(() => delta.value > 0);
const decrease = computed(() => delta.value < 0);

function getValue(equipment: Equipment | null): number {
  if (equipment !== null) {
    const statValue = equipment.stats.find(s => s.statId === stat.value.id);
    if (statValue !== undefined) {
      return statValue.value;
    }
  }

  return model.getDefaultStatValue(stat.value);
}
</script>

<template>
  <div class="character-equipment-stat-item">
    <span>
      {{ stat.name }}:
    </span>

    <span>
      {{ formatValue(equippedValue) }}
      <span
          v-if="selected !== equipped"
      >
      -> {{ formatValue(selectedValue) }}
    </span>
    </span>

    <span
        v-if="selected !== equipped"
        :class="{
          'character-equipment-stat-item-increase': increase,
          'character-equipment-stat-item-decrease': decrease,
        }"
    >
      {{ formatValue(delta) }}
    </span>
  </div>
</template>

<style scoped>
.character-equipment-stat-item {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
}

.character-equipment-stat-item-increase {
  color: #5cb85c;
}

.character-equipment-stat-item-decrease {
  color: crimson;
}
</style>