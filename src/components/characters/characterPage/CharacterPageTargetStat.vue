<script setup lang="ts">
import type {Character, TargetStat} from "@/model/modelData.ts";
import {computed, type ComputedRef} from "vue";
import {formatValue} from "@/components/characters/characterPage/utils.ts";
import type {DifferentiationTree} from "@/calculator/differentiationTree.ts";
import {getTargetStatCalculation} from "@/model/calculation.ts";
import {model} from "@/model/model.ts";

const props = defineProps<{
  targetStat: TargetStat,
  character: Character,
  expanded: boolean
}>();

defineEmits<{
  (name: "toggleStat", stat: TargetStat, calculationTree: DifferentiationTree, variables: ComputedRef<Map<string, number>>): void;
}>();

const treeMap = computed(() => getTargetStatCalculation(model, props.targetStat, props.character));
const value = computed(() => formatValue(treeMap.value[0].calculate(treeMap.value[1].value)));
</script>

<template>
  <div class="character-page-target-stat">
    <p class="character-page-target-stat-name">
      {{ targetStat.name }}
    </p>
    <p class="character-page-target-stat-output">
      {{ value }}
    </p>
    <input
        class="character-page-target-stat-expand"
        type="button"
        :value="expanded ? '<' : '>'"
        @click="$emit('toggleStat', targetStat, treeMap[0], treeMap[1])"
    />
  </div>
</template>

<style scoped>
.character-page-target-stat {
  display: grid;
  grid-template-columns: 1fr 1.5fr .5fr;
  gap: 2rem;
  max-width: 20rem;
}

.character-page-target-stat-name {
  max-width: 5rem;
  word-wrap: anywhere;
}

.character-page-target-stat-output {
  width: 100%;
  height: 1.5rem;
}

.character-page-target-stat-expand {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
}
</style>