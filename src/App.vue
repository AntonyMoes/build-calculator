<script setup lang="ts">
import Menu from "@/components/Menu.vue";
</script>

<template>
  <main class="main">
    <Menu />
    <div class="page-wrapper">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
.main {
  width: 100%;
  min-height: 100vh;
}

.page-wrapper {
  margin-left: var(--nav-sidebar-width);
}
</style>
