<script setup lang="ts">
import SettingsGroup from "@/components/settings/common/SettingsGroup.vue";
import {model} from "@/model/model.ts";
import TargetStat from "@/components/settings/targetStats/TargetStat.vue";

function add() {
  let newName = "target-stat-new";
  while (model.data.targetStats.find(stat => stat.name === newName) !== undefined) {
    newName += "-new";
  }

  model.data.targetStats.push({
    id: model.createId(),
    name: newName,
    formula: "",
    tokenization: []
  })
}

function remove(value: string) {
  const index = model.data.targetStats.findIndex(stat => stat.name === value);
  if (index > -1) {
    model.data.targetStats.splice(index, 1);
  }
}
</script>

<template>
  <div class="target-stats">
    <SettingsGroup @add="add">
      <template #title>
        Target stats
      </template>
      <template #items>
        <TargetStat
            v-for="targetStat in model.data.targetStats"
            :key="targetStat.id"
            :model-value="targetStat"
            @remove="remove"
        />
      </template>
    </SettingsGroup>
  </div>
</template>

<style scoped>
.target-stats {
  width: 200px;
}
</style>