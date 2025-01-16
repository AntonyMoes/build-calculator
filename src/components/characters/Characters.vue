<script setup lang="ts">
import CharacterItem from "@/components/characters/characterList/CharacterItem.vue";
import {type Character, type CharacterId} from "@/model/modelData.ts";
import {model} from "@/model/model.ts";
import NewCharacterItem from "@/components/characters/characterList/NewCharacterItem.vue";
import {ref} from "vue";
import CharacterPage from "@/components/characters/characterPage/CharacterPage.vue";

const selectedCharacter = ref<Character | undefined>(undefined);

function onCharacterClick(id: CharacterId) {
  selectedCharacter.value = model.getCharacter(id);
}

function onNewCharacterClick() {
  model.data.characters.push({
    id: model.createId(),
    name: "character-new",
    imageSrc: "",
    stats: [],
    equipment: []
  })
}
</script>

<template>
  <div class="page-container characters">
    <div class="character-list">
      <CharacterItem
          v-for="character of model.data.characters"
          :key="character.id"
          :model-value="character"
          :title="character.name"
          @click="onCharacterClick"
      />

      <NewCharacterItem @click="onNewCharacterClick"/>
    </div>

    <div class="character-section">
      <CharacterPage
          v-if="selectedCharacter !== undefined"
          :model-value="selectedCharacter"
      />
    </div>
  </div>
</template>

<style scoped>
.characters {
  display: flex;
  gap: 40px;
  height: 100vh;
}

.character-list {
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
  scrollbar-width: none;
}

.character-section {
  display: flex;
}
</style>