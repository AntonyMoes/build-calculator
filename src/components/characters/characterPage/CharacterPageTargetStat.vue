<script setup lang="ts">
import type {TargetStat} from "@/model/model.ts";
import {calculateTargetStat} from "@/model/getters.ts";
import {computed} from "vue";

const props = defineProps<{
  targetStat: TargetStat,
  stats: Stat[],
}>();

const value = computed(() => calculateTargetStat(props.targetStat, props.stats).toFixed(1));
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