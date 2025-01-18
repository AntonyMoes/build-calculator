<script setup lang="ts">
import type {Character} from "@/model/modelData.ts";
import {computed, ref, watch} from "vue";
import {validateCharacterLevel} from "@/model/validation.ts";
import {model} from "@/model/model.ts";
import ErrorsBlock from "@/components/common/ErrorsBlock.vue";
import {getRerenderKey} from "@/utils/rerenderKey.ts";

const characterModel = defineModel<Character>({required: true});

const rerenderKey = getRerenderKey();

const inputIndex = ref<string>("");
const currentLevel = computed(() => model.getCurrentCharacterLevel(characterModel.value));
const isFirst = computed(() => characterModel.value.currentLevelIndex == 0);
const isLast = computed(() => characterModel.value.currentLevelIndex == characterModel.value.levels.length - 1);
const name = ref<string>("");
const errors = ref<string[]>([]);

updateLevel();

function updateLevel() {
  inputIndex.value = characterModel.value.currentLevelIndex.toString();
  name.value = currentLevel.value.name;
  errors.value = [];
}

watch(computed(() => characterModel.value.currentLevelIndex), updateLevel);

function validate() {
  const validationErrors = validateCharacterLevel(characterModel.value, name.value, currentLevel.value);
  errors.value = validationErrors;

  if (validationErrors.length === 0) {
    currentLevel.value.name = name.value;
  }
}

function onSliderInput() {
  characterModel.value.currentLevelIndex = Number(inputIndex.value);
}

function changeLevel(delta: number) {
  characterModel.value.currentLevelIndex += delta;
}

function moveLevel(delta: number) {
  model.shiftCurrentCharacterLevel(characterModel.value, delta);
  changeLevel(delta);
  console.log(characterModel.value.levels);
}

function createLevel() {
  const currentLevelName = currentLevel.value.name;

  // find and increment the first number in the current level name
  let delta = 1;
  let errors: string[] = []
  let newName = "";
  do {
    newName = currentLevelName.replace(/[0-9.]+/, x => (Number(x) + delta).toString());
    errors = validateCharacterLevel(characterModel.value, newName);
    delta += 1;
  } while (errors.length > 0);

  model.addLevel(characterModel.value, newName, characterModel.value.currentLevelIndex + 1, currentLevel.value);
  changeLevel(1);

  rerenderKey.rerender();
}

function deleteLevel() {
  const confirmed = confirm("You sure?");
  if (!confirmed) {
    return;
  }

  const index = characterModel.value.currentLevelIndex;
  const delta = isLast.value ? -1 : 0;
  changeLevel(delta);
  characterModel.value.levels.splice(index, 1);
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
          :max="characterModel.levels.length - 1"
          v-model="inputIndex"
          class="slider"
          :disabled="characterModel.levels.length <= 1"
          @input="onSliderInput"
      />
      <input
          type="button"
          value=">"
          :disabled="isLast"
          @click="changeLevel(1)"
      />
    </div>

    <div class="character-page-level-row character-level-menu">
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

    <div class="character-page-level-row character-level-menu">
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