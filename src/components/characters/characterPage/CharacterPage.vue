<script setup lang="ts">
import {
  type Character,
  type CharacterEquipmentGroup as CharEquipmentGroup,
  createId,
  type EquipmentId,
  type EquipmentTypeId,
  model,
  type TargetStat
} from "@/model/model.ts";
import {getRerenderKey} from "@/utils/rerenderKey.ts";
import {imageToSrc} from "@/utils/image.ts";
import SelectedImage from "@/components/common/SelectedImage.vue";
import CharacterPageGroup from "@/components/characters/characterPage/CharacterPageGroup.vue";
import CharacterPageStat from "@/components/characters/characterPage/CharacterPageStat.vue";
import {computed, type ComputedRef, ref} from "vue";
import {setAllStatValues} from "@/model/setters.ts";
import CharacterPageTargetStat from "@/components/characters/characterPage/CharacterPageTargetStat.vue";
import CharacterEquipmentGroup from "@/components/characters/characterPage/equipment/CharacterEquipmentGroup.vue";
import CharacterEquipmentPopup from "@/components/characters/characterPage/equipment/CharacterEquipmentPopup.vue";
import {getEquipmentGroup} from "@/model/getters.ts";
import type {DifferentiationTree} from "@/calculator/differentiationTree.ts";
import CharacterPageTargetStatGradientItem
  from "@/components/characters/characterPage/CharacterPageTargetStatGradientItem.vue";

const characterModel = defineModel<Character>({required: true});

const rerenderKey = getRerenderKey();

const statValues = computed<StatValue[]>(() => {
  setAllStatValues(characterModel.value.stats);
  targetStatInfoShown.value = false;
  return characterModel.value.stats;
})

async function onSelectImage(image: File) {
  characterModel.value.imageSrc = await imageToSrc(image);
  rerenderKey.rerender();
}

const targetStatInfoShown = ref(false);
const targetStatInfoStat = ref<TargetStat | undefined>();
const targetStatInfoTree = ref<DifferentiationTree>();
const targetStatVariables = ref<ComputedRef<Map<string, number>>>();

function onToggleStat(stat: TargetStat, calculationTree: DifferentiationTree, variableMap: ComputedRef<Map<string, number>>) {
  console.log("TOGGLE STAT " + stat.name + " " + calculationTree.calculate(variableMap.value) + " " + calculationTree.calculateGradient(variableMap.value));
  console.log(calculationTree);
  const selected = targetStatInfoStat.value?.id === stat.id;
  if (selected && targetStatInfoShown.value) {
    targetStatInfoShown.value = false;
  } else {
    targetStatInfoStat.value = stat;
    targetStatInfoTree.value = calculationTree;
    targetStatVariables.value = variableMap;
    targetStatInfoShown.value = true;
  }
}

function addEquipmentGroup() {
  if (model.equipmentGroups.length === 0) {
    alert("No equipment groups to add.");
    return;
  }

  characterModel.value.equipment.push({
    id: createId(),
    groupId: model.equipmentGroups[0].id,
    equipment: []
  });
}

const equipmentPopupOpen = ref(false);
const equipmentPopupGroup = ref<CharEquipmentGroup>();
const equipmentPopupSlotIndex = ref(-1);
const equipmentPopupType = ref<EquipmentTypeId>(-1);
const equipmentPopupEquipped = ref<EquipmentId | null>(null);

function onEquipmentPopupClose() {
  equipmentPopupOpen.value = false;
}

function onSelectEquipmentSlot(group: CharEquipmentGroup, slotIndex: number) {
  equipmentPopupGroup.value = group;
  equipmentPopupSlotIndex.value = slotIndex;
  equipmentPopupType.value = getEquipmentGroup(group.groupId)!.equipmentTypeIds[slotIndex];
  equipmentPopupEquipped.value = group.equipment[slotIndex];
  equipmentPopupOpen.value = true;
}

function onSelectEquipment(equipment: Equipment | null) {
  equipmentPopupGroup.value.equipment[equipmentPopupSlotIndex.value] = equipment !== null ? equipment.id : null;
}
</script>

<template>
  <div class="character-page">
    <div class="character-page-subpage" :key="rerenderKey.key">
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
                :character="characterModel"
                :expanded="targetStatInfoShown && targetStatInfoStat === targetStatInfoStat"
                @toggleStat="onToggleStat"
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
                @selectSlot="onSelectEquipmentSlot"
            />

            <CharacterEquipmentPopup
                :isOpen="equipmentPopupOpen"
                :typeId="equipmentPopupType"
                :equipped="equipmentPopupEquipped"
                @close="onEquipmentPopupClose"
                @selectEquipment="onSelectEquipment"
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

    <div class="character-page-subpage" v-if="targetStatInfoShown">
      <h1>Stat analysis - {{ targetStatInfoStat.name }}</h1>
      <CharacterPageGroup>
        <template #name>
          Gradient
        </template>

        <template #content>
          <div class="">
            <CharacterPageTargetStatGradientItem
                v-for="[statName, value] of targetStatInfoTree.calculateGradient(targetStatVariables.value).entries()"
                :key="model.stats.find(s => s.name === statName)!.id"
                :stat-name="statName"
                :gradient="value"
            />
          </div>
        </template>
      </CharacterPageGroup>
    </div>
  </div>
</template>

<style scoped>
.character-page {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 20px;
}

.character-page-subpage {
  min-width: 400px;
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
  width: 200px;
  height: 200px;
}
</style>