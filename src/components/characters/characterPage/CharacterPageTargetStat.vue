<script setup lang="ts">
import type {Character, TargetStat} from "@/model/model.ts";
import {calculateTargetStat} from "@/model/getters.ts";
import {computed} from "vue";
import {formatValue} from "@/components/characters/characterPage/utils.ts";

const props = defineProps<{
  targetStat: TargetStat,
  character: Character,
}>();

const value = computed(() => formatValue(calculateTargetStat(props.targetStat, props.character)));
</script>

<template>
  <div class="character-page-target-stat">
    <p class="character-page-target-stat-name">
      {{ targetStat.name }}
    </p>
    <p class="character-page-target-stat-output">
      {{ value }}
    </p>
  </div>
</template>

<style scoped>
.character-page-target-stat {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
</style>