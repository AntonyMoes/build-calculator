<script setup lang="ts">
import {type Character, createId, model} from "@/model/model.ts";
import {getRerenderKey} from "@/utils/rerenderKey.ts";
import {imageToSrc} from "@/utils/image.ts";
import SelectedImage from "@/components/common/SelectedImage.vue";
import CharacterPageGroup from "@/components/characters/characterPage/CharacterPageGroup.vue";
import CharacterPageStat from "@/components/characters/characterPage/CharacterPageStat.vue";
import {computed} from "vue";
import {setAllStatValues} from "@/model/setters.ts";
import CharacterPageTargetStat from "@/components/characters/characterPage/CharacterPageTargetStat.vue";
import CharacterEquipmentGroup from "@/components/characters/characterPage/equipment/CharacterEquipmentGroup.vue";

const characterModel = defineModel<Character>({required: true});

const rerenderKey = getRerenderKey();

const statValues = computed<StatValue[]>(() => {
  setAllStatValues(characterModel.value.stats);
  return characterModel.value.stats;
})

async function onSelectImage(image: File) {
  characterModel.value.imageSrc = await imageToSrc(image);
  rerenderKey.rerender();
}

function addEquipmentGroup() {
  if (model.equipmentGroups.length === 0) {
    alert("No equipment groups to add");
    return;
  }

  characterModel.value.equipment.push({
    id: createId(),
    groupId: model.equipmentGroups[0].id,
    equipment: []
  });
}
</script>

<template>
  <div class="character-page" :key="rerenderKey.key">
    <div class="character-page-top">
      <SelectedImage
          class="character-page-image character-page-top-element"
          :src="characterModel.imageSrc"
          :can-select="true"
          @selectImage="onSelectImage"
      />

      <input
          class="character-page-name character-page-top-element"
          type="text"
          v-model="characterModel.name"
      />
    </div>

    <div class="character-page-stats">
      <CharacterPageGroup class="character-page-stats-group">
        <template #name>
          Stats
        </template>
        <template #content>
          <CharacterPageStat
              v-for="statValue of statValues"
              :key="statValue.id"
              :model-value="statValue"
          />
        </template>
      </CharacterPageGroup>

      <CharacterPageGroup class="character-page-stats-group">
        <template #name>
          TargetStats
        </template>
        <template #content>
          <CharacterPageTargetStat
              v-for="targetStat of model.targetStats"
              :key="targetStat.id"
              :targetStat="targetStat"
              :stats="statValues"
          />
        </template>
      </CharacterPageGroup>
    </div>

    <div class="character-page-equipment">
      <CharacterPageGroup>
        <template #name>
          Equipment
        </template>
        <template #content>
          <CharacterEquipmentGroup
              v-for="group of characterModel.equipment"
              :key="group.id"
              :model-value="group"
          />
        </template>
      </CharacterPageGroup>

      <input
          type="button"
          value="Add equipment group"
          @click="addEquipmentGroup"
      />
    </div>
  </div>
</template>

<style scoped>
.character-page {
  min-width: 200px;
  min-height: 200px;
  background-color: black;
  padding: 30px;
}

.character-page-top {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;
}

.character-page-top-element {
}

.character-page-stats {
  display: flex;
  flex-direction: row;
  gap: 40px;
}

.character-page-stats-group {
}

.character-page-name {
  font-size: 24px;
  margin-top: 20px;
}

.character-page-image {
  max-width: 200px;
  max-height: 200px;
}
</style>