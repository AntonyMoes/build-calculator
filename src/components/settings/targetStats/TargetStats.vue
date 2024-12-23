<script setup lang="ts">
import SettingsGroup from "@/components/settings/common/SettingsGroup.vue";
import {createId, model} from "@/model/model.ts";
import TargetStat from "@/components/settings/targetStats/TargetStat.vue";

function add() {
  let newName = "target-stat-new";
  while (model.targetStats.find(stat => stat.name === newName) !== undefined) {
    newName += "-new";
  }

  model.targetStats.push({
    id: createId(),
    name: newName,
    formula: "",
    tokenization: []
  })
}

function remove(value: string) {
  const index = model.targetStats.indexOf(model.targetStats.find(stat => stat.name === value)!);
  if (index > -1) {
    model.targetStats.splice(index, 1);
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
            v-for="targetStat in model.targetStats"
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