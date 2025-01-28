<script setup lang="ts">
import {
  type Character,
  type CharacterEquipmentGroup as CharEquipmentGroup,
  type CharacterEquipmentGroupId,
  type CharacterStatGroupId,
  type Equipment,
  type EquipmentId,
  type EquipmentTypeId,
  type StatValue,
  type TargetStat
} from "@/model/modelData.ts";
import {getRerenderKey} from "@/utils/rerenderKey.ts";
import {imageToSrc} from "@/utils/image.ts";
import SelectedImage from "@/components/common/SelectedImage.vue";
import CharacterPageGroup from "@/components/characters/characterPage/CharacterPageGroup.vue";
import CharacterPageStat from "@/components/characters/characterPage/CharacterPageStat.vue";
import {computed, type ComputedRef, ref} from "vue";
import CharacterPageTargetStat from "@/components/characters/characterPage/CharacterPageTargetStat.vue";
import CharacterEquipmentGroup from "@/components/characters/characterPage/equipment/CharacterEquipmentGroup.vue";
import CharacterEquipmentPopup from "@/components/characters/characterPage/equipment/CharacterEquipmentPopup.vue";
import type {DifferentiationTree} from "@/calculator/differentiationTree.ts";
import CharacterPageTargetStatGradientItem
  from "@/components/characters/characterPage/CharacterPageTargetStatGradientItem.vue";
import {model} from "@/model/model.ts";
import CharacterPageLevel from "@/components/characters/characterPage/CharacterPageLevel.vue";
import {hasValue, type Optional} from "@/utils/optional.ts";
import CharacterStatGroup from "@/components/characters/characterPage/CharacterStatGroup.vue";

const characterModel = defineModel<Character>({required: true});

const rerenderKey = getRerenderKey();

const currentLevel = computed(() => model.getCurrentLevel(characterModel.value));
const statValues = computed<StatValue[]>(() => {
  model.setAllStatValues(currentLevel.value.stats);
  targetStatInfoShown.value = false;
  return currentLevel.value.stats.filter(statValue => model.getStat(statValue.statId)!.shownCharacterStat);
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
  if (model.data.equipmentGroups.length === 0) {
    alert("No equipment groups to add.");
    return;
  }

  characterModel.value.equipment.push({
    id: model.createId(),
    groupId: model.data.equipmentGroups[0].id,
    equipment: []
  });
}

function removeEquipmentGroup(groupId: CharacterEquipmentGroupId) {
  const index = characterModel.value.equipment.findIndex(group => group.id === groupId);
  if (index > -1) {
    characterModel.value.equipment.splice(index, 1);
  }
}

const equipmentPopupOpen = ref(false);
const equipmentPopupGroup = ref<CharEquipmentGroup>();
const equipmentPopupSlotIndex = ref(-1);
const equipmentPopupType = ref<EquipmentTypeId>(-1);
const equipmentPopupEquipped = ref<Optional<EquipmentId>>(null);

function onEquipmentPopupClose() {
  equipmentPopupOpen.value = false;
}

function onSelectEquipmentSlot(group: CharEquipmentGroup, slotIndex: number) {
  equipmentPopupGroup.value = group;
  equipmentPopupSlotIndex.value = slotIndex;
  equipmentPopupType.value = model.getEquipmentGroup(group.groupId)!.equipmentTypeIds[slotIndex];
  equipmentPopupEquipped.value = group.equipment[slotIndex];
  equipmentPopupOpen.value = true;
}

function onSelectEquipment(equipment: Optional<Equipment>) {
  equipmentPopupGroup.value!.equipment[equipmentPopupSlotIndex.value] = hasValue(equipment) ? equipment.id : null;
}


function addStatGroup() {
  model.addStatGroup(characterModel.value);
}

function removeStatGroup(groupId: CharacterStatGroupId) {
  const index = characterModel.value.statGroups.findIndex(group => group.id === groupId);
  if (index > -1) {
    characterModel.value.statGroups.splice(index, 1);
  }
}
</script>

<template>
  <div class="character-page">
    <div class="character-page-subpage" :key="rerenderKey.key.value">
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

      <CharacterPageLevel :model-value="characterModel"/>

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
                v-for="targetStat of model.data.targetStats"
                :key="targetStat.id"
                :targetStat="targetStat"
                :character="characterModel"
                :expanded="targetStatInfoShown && targetStat === targetStatInfoStat"
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
                @remove="removeEquipmentGroup"
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

      <div class="character-page-leveled-stats">
        <CharacterPageGroup>
          <template #name>
            Leveled stat groups
          </template>

          <template #content>
            <div class="character-page-stat-groups">
              <CharacterStatGroup
                  v-for="group of characterModel.statGroups"
                  :key="group.id"
                  :model-value="group"
                  @remove="removeStatGroup"
              />
            </div>
          </template>
        </CharacterPageGroup>

        <input
            type="button"
            value="Add stat group"
            @click="addStatGroup"
        />
      </div>
    </div>

    <div class="character-page-subpage" v-if="targetStatInfoShown">
      <h1>Stat analysis - {{ targetStatInfoStat!.name }}</h1>
      <CharacterPageGroup>
        <template #name>
          Gradient
        </template>

        <template #content>
          <div class="">
            <CharacterPageTargetStatGradientItem
                v-for="[statName, value] of targetStatInfoTree!.calculateGradient(targetStatVariables!.value).entries()"
                :key="model.data.stats.find(s => s.name === statName)!.id"
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
  max-height: calc(100vh - var(--page-container-padding) * 2);
  overflow-y: scroll;
  scrollbar-width: none;
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

.character-page-stat-groups {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>