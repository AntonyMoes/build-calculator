<script setup lang="ts">
defineEmits<{
  (name: "remove"): void
}>();
</script>

<template>
  <input
      type="button"
      value="-"
      @click="$emit('remove')"
  />
</template>

<style scoped>

</style>