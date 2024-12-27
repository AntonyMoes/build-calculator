<script setup lang="ts">
import Menu from "@/components/Menu.vue";
</script>

<template>
  <main class="main">
    <Menu />
    <section class="page">
      <RouterView />
    </section>
  </main>
</template>

<style scoped>
@import "@/assets/main.css";

.main {
  width: 100%;
  min-height: 100vh;
}

/* TODO: rename as you wish */
.page {
  margin-left: var(--nav-sidebar-width);
}
</style>
