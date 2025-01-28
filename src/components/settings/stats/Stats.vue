<script setup lang="ts">
import SettingsGroup from "@/components/settings/common/SettingsGroup.vue";
import {model} from "@/model/model.ts";
import Stat from "@/components/settings/stats/Stat.vue";

function add() {
  let newName = "stat-new";
  while (model.data.stats.find(stat => stat.name === newName) !== undefined) {
    newName += "-new";
  }

  model.data.stats.push({
    id: model.createId(),
    name: newName,
    shownCharacterStat: false,
    minValue: undefined,
    maxValue: undefined,
  })
}

function remove(value: string) {
  const index = model.data.stats.findIndex(stat => stat.name === value);
  if (index > -1) {
    model.data.stats.splice(index, 1);
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
            v-for="stat in model.data.stats"
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