<script setup lang="ts">
import router from "@/router";
</script>

<template>
  <div class="menu">
    <RouterLink
        v-for="route of router.getRoutes()"
        :key="route.path"
        :to="route.path">
      {{ route.name }}
    </RouterLink>
  </div>
</template>

<style scoped>
/* The side navigation menu */
.menu {
  background-color: #444444;
  position: sticky;
  min-height: 100vh;
  overflow: auto;
}

/* Sidebar links */
.menu a {
  display: block;
  color: white;
  padding: 16px;
  text-decoration: none;
}

/* Active/current link */
.menu a.active {
  /*background-color: #04AA6D;*/
  background-color: #777777;
  color: white;
}

/* Links on mouse-over */
.menu a:hover:not(.active) {
  background-color: #555555;
  color: white;
}

.menu a.router-link-exact-active {
  /*color: var(--color-text);*/
  background-color: #777777;
}

.menu a.router-link-exact-active:hover {
  background-color: transparent;
}

</style>