<script setup lang="ts">
defineEmits<{
  (name: "click"): void;
}>();
</script>

<template>
<div class="character-slot" @click="$emit('click')">
  <slot name="content"/>
</div>
</template>

<style scoped>
.character-slot {
  min-width: 100px;
  min-height: 100px;
}
</style>