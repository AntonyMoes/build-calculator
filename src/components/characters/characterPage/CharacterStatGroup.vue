<script setup lang="ts">
import type {CharacterStatGroup, CharacterStatGroupId, Stat, StatId} from "@/model/modelData.ts";
import {computed} from "vue";
import RemoveButton from "@/components/common/RemoveButton.vue";
import {model} from "@/model/model.ts";
import CharacterStatGroupStat from "@/components/characters/characterPage/CharacterStatGroupStat.vue";
import CharacterPageLevel from "@/components/characters/characterPage/CharacterPageLevel.vue";

const groupModel = defineModel<CharacterStatGroup>({required: true});

defineEmits<{
  (name: "remove", id: CharacterStatGroupId): void
}>();

const currentLevel = computed(() => model.getCurrentLevel(groupModel.value));

function addStat() {
  if (model.data.stats.length === 0) {
    alert("No stat to add.");
    return;
  }

  let newStat: Stat | undefined = undefined;
  for (const stat of model.data.stats) {
    if (currentLevel.value.stats.find(s => s.statId === stat.id) !== undefined) {
      continue;
    }

    newStat = stat;
    break;
  }

  if (newStat === undefined) {
    alert("No stat to add.");
    return;
  }

  for (const level of groupModel.value.levels) {
    model.addStatValue(level.stats, newStat);
  }
}

function removeStat(statId: StatId) {
  for (const level of groupModel.value.levels) {
    const index = level.stats.findIndex(statValue => statValue.statId === statId);
    if (index > -1) {
      level.stats.splice(index, 1);
    }
  }
}
</script>
<template>
  <div class="character-stat-group">
    <div class="character-stat-group-block character-stat-group-block-margin">
      <input
          type="text"
          v-model="groupModel.name"
      />
      <RemoveButton @remove="$emit('remove', groupModel.id)"/>
    </div>

    <CharacterPageLevel
        class="character-stat-group-block character-stat-group-block-margin"
        :model-value="groupModel"
    />

    <!--    <h4 class="character-stat-group-block">Stats</h4>-->

    <div class="">
      <p>Stats:</p>
      <div class="character-stat-group-block">
        <CharacterStatGroupStat
            v-for="stat of currentLevel.stats"
            :key="stat.id"
            :level="currentLevel"
            :model-value="stat"
            @remove="removeStat"
        />
      </div>

      <input
          class="character-stat-group-block"
          type="button"
          value="Add stat"
          @click="addStat"
      /></div>
  </div>
</template>

<style scoped>
.character-stat-group {
  width: 320px;
  border: 1px solid #555555;
  background-color: #343434;
  padding: 5px;
}

.character-stat-group-block {
  display: block;
  /*margin: 5px;*/
}

.character-stat-group-block-margin {
  margin-bottom: 10px;
}
</style>