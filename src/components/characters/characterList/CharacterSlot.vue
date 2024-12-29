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
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}
</style>