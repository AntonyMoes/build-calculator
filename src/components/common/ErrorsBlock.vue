<script setup lang="ts">
defineProps<{
  errors: string[];
}>();
</script>

<template>
  <div class="error-block">
    <p
        v-for="error in errors"
        class="error-block-block error-block-error"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.error-block {
  display: block;
}

.error-block-block {
  display:block;
}

.error-block-error {
  color: #b32f30;
}
</style>