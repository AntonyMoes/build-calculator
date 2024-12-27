<script setup lang="ts">
import CharacterSlot from "@/components/characters/characterList/CharacterSlot.vue";

defineEmits<{
  (name: "click"): void;
}>();
</script>

<template>
<CharacterSlot @click="$emit('click')">
  <template #content>
    <input class="new-character-item" type="button" value="+"/>
  </template>
</CharacterSlot>
</template>

<style scoped>
.new-character-item {
  width: 100%;
  height: 100%;
}
</style>