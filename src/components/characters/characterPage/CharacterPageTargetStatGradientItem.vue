<script setup lang="ts">
import {computed} from "vue";
import {formatValue} from "./utils.ts";

const props = defineProps<{
  statName: string;
  gradient: number;
}>();

const increase = computed(() => props.gradient > 0);
const decrease = computed(() => props.gradient < 0);


</script>

<template>
  <div class="character-page-target-stat-gradient-item">
      <span>
          {{ statName }}
      </span>
      <span :class="{
        'character-page-target-stat-gradient-item-increase': increase,
        'character-page-target-stat-gradient-item-decrease': decrease,
      }">
            {{ formatValue(gradient) }}
      </span>
  </div>
</template>

<style scoped>

.character-page-target-stat-gradient-item {
  display: grid;
  grid-template-columns: 2fr 1fr;
}

.character-page-target-stat-gradient-item-increase {
  color: #5cb85c;
}

.character-page-target-stat-gradient-item-decrease {
  color: crimson;
}
</style>