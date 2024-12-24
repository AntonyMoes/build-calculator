<script setup lang="ts">
defineEmits<{
  (name: "remove"): void
}>();
</script>

<template>
  <input
      class="settings-card-block settings-card-remove"
      type="button"
      value="-"
      @click="$emit('remove')"
  />
</template>

<style scoped>

</style>