<script setup lang="ts">
defineEmits<{
  (name: "remove"): void
}>()
</script>

<template>
  <div class="settings-card">
    <slot name="content"/>
    <input class="settings-card-remove" type="button" value="-" @click="$emit('remove')"/>
  </div>
</template>

<style scoped>
.settings-card {
  background-color: #343434;
  height: fit-content;
  padding-top: 5px;
  padding-bottom: 5px;
}

.settings-card-remove {
}
</style>