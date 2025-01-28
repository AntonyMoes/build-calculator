<script setup lang="ts">
import type {Character, CharacterStatGroup} from "@/model/modelData.ts";
import {computed, ref, watch} from "vue";
import {validateLevel} from "@/model/validation.ts";
import {model} from "@/model/model.ts";
import ErrorsBlock from "@/components/common/ErrorsBlock.vue";
import {getRerenderKey} from "@/utils/rerenderKey.ts";

const levelOwnerModel = defineModel<Character | CharacterStatGroup>({required: true});

const rerenderKey = getRerenderKey();

const inputIndex = ref<string>("");
const currentLevel = computed(() => model.getCurrentLevel(levelOwnerModel.value));
const isFirst = computed(() => levelOwnerModel.value.currentLevelIndex == 0);
const isLast = computed(() => levelOwnerModel.value.currentLevelIndex == levelOwnerModel.value.levels.length - 1);
const name = ref<string>("");
const errors = ref<string[]>([]);
const showMore = ref<boolean>(false);

updateLevel();

function updateLevel() {
  inputIndex.value = levelOwnerModel.value.currentLevelIndex.toString();
  name.value = currentLevel.value.name;
  errors.value = [];
}

watch(computed(() => levelOwnerModel.value.currentLevelIndex), updateLevel);

function validate() {
  const validationErrors = validateLevel(levelOwnerModel.value, name.value, currentLevel.value);
  errors.value = validationErrors;

  if (validationErrors.length === 0) {
    currentLevel.value.name = name.value;
  }
}

function onSliderInput() {
  levelOwnerModel.value.currentLevelIndex = Number(inputIndex.value);
}

function changeLevel(delta: number) {
  levelOwnerModel.value.currentLevelIndex += delta;
}

function moveLevel(delta: number) {
  model.shiftCurrentLevel(levelOwnerModel.value, delta);
  changeLevel(delta);
  console.log(levelOwnerModel.value.levels);
}

function createLevel() {
  const currentLevelName = currentLevel.value.name;

  // find and increment the first number in the current level name
  let delta = 1;
  let errors: string[] = []
  let newName = "";
  do {
    newName = currentLevelName.replace(/[0-9.]+/, x => (Number(x) + delta).toString());
    errors = validateLevel(levelOwnerModel.value, newName);
    delta += 1;
  } while (errors.length > 0);

  model.addLevel(levelOwnerModel.value, newName, levelOwnerModel.value.currentLevelIndex + 1, currentLevel.value);
  changeLevel(1);

  rerenderKey.rerender();
}

function deleteLevel() {
  const confirmed = confirm("You sure?");
  if (!confirmed) {
    return;
  }

  const index = levelOwnerModel.value.currentLevelIndex;
  const delta = isLast.value ? -1 : 0;
  changeLevel(delta);
  levelOwnerModel.value.levels.splice(index, 1);
  updateLevel();
}
</script>

<template>
  <div class="character-page-level" :key="rerenderKey.key.value">
    <div class="character-page-level-row character-level-name">
      <label for="character-level-name">Level:</label>
      <input
          id="character-level-name"
          v-model="name"
          @input="validate"
      />
      <input
          type="button"
          :value="showMore ? '≢' : '≡'"
          @click="showMore = !showMore"
      />
    </div>

    <div class="character-page-level-row character-level-selector">
      <input
          type="button"
          value="<"
          :disabled="isFirst"
          @click="changeLevel(-1)"
      />
      <input
          type="range"
          min="0"
          :max="levelOwnerModel.levels.length - 1"
          v-model="inputIndex"
          class="slider"
          :disabled="levelOwnerModel.levels.length <= 1"
          @input="onSliderInput"
      />
      <input
          type="button"
          value=">"
          :disabled="isLast"
          @click="changeLevel(1)"
      />
    </div>

    <div class="character-page-level-row character-level-menu" v-if="showMore">
      <input
          type="button"
          value="Create level"
          @click="createLevel"
      />
      <input
          type="button"
          value="Delete level"
          :disabled="isFirst && isLast"
          @click="deleteLevel"
      />
    </div>

    <div class="character-page-level-row character-level-menu" v-if="showMore">
      <input
          type="button"
          value="< Move level"
          :disabled="isFirst"
          @click="moveLevel(-1)"
      />
      <input
          type="button"
          value="Move level >"
          :disabled="isLast"
          @click="moveLevel(1)"
      />
    </div>

    <ErrorsBlock v-if="errors.length > 0" :errors="errors"/>
  </div>
</template>

<style scoped>
.character-page-level {
  display: flex;
  flex-direction: column;
  max-width: 220px;
  gap: 5px;
}

.character-page-level-row {
  display: flex;
}

.character-level-name {
  justify-content: space-between;
}

.character-level-selector {
  justify-content: space-around;
}

.character-level-menu {
  justify-content: space-around;
}
</style>