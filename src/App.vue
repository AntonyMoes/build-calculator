<script setup lang="ts">
import Menu from "@/components/Menu.vue";
</script>

<template>
  <main class="main">
    <Menu />
    <RouterView/>
  </main>
</template>

<style scoped>
.main {
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-rows: max-content;
}
</style>
