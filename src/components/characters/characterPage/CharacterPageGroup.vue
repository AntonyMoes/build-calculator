<script setup lang="ts">

</script>

<template>
  <div class="character-page-group">
    <p class="character-page-group-name">
      <slot name="name"/>
    </p>
    <slot name="content"/>
  </div>
</template>

<style scoped>
.character-page-group {
}

.character-page-group-name {
  font-size: 20px;
}
</style>