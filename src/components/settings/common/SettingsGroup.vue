<script setup lang="ts">
defineEmits<{
  (name: "add"): void
}>()
</script>

<template>
  <div class="settings-group">
    <p class="settings-group-title">
      <slot name="title"/>
    </p>
    <div class="settings-group-item-container">
      <slot name="items"/>
      <input type="button" value="Add" v-on:click="$emit('add')">
    </div>
  </div>
</template>

<style scoped>
.settings-group {
  background-color: #282828;
  height: fit-content;
}

.settings-group-item-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.settings-group-title {
  display: block;
}
</style>