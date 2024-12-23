<script setup lang="ts">
import SettingsGroup from "@/components/settings/common/SettingsGroup.vue";
import {createId, model} from "@/model/model.ts";
import Stat from "@/components/settings/stats/Stat.vue";

function add() {
  let newName = "stat-new";
  while (model.stats.find(stat => stat.name === newName) !== undefined) {
    newName += "-new";
  }

  model.stats.push({
    id: createId(),
    name: newName,
    minValue: undefined,
    maxValue: undefined,
  })
}

function remove(value: string) {
  const index = model.stats.indexOf(model.stats.find(stat => stat.name === value)!);
  if (index > -1) {
    model.stats.splice(index, 1);
  }
}
</script>

<template>
  <div class="stats">
    <SettingsGroup @add="add">
      <template #title>
        Stats
      </template>
      <template #items>
        <Stat
            v-for="stat in model.stats"
            :key="stat.id"
            :model-value="stat"
            @remove="remove"
        />
      </template>
    </SettingsGroup>
  </div>
</template>

<style scoped>
.stats {
  width: 200px;
}
</style>