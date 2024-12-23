<script setup lang="ts">
defineProps<{
  // error: string | undefined;
  errors: string[];
}>();

defineEmits<{
  (name: "remove"): void
}>();
</script>

<template>
  <div class="settings-card">
    <slot name="content"/>

<!--        v-if="error !== undefined"-->
    <p
        v-for="error in errors"
        class="settings-card-block settings-card-error"
    >
      {{ error }}
    </p>
    <input
        class="settings-card-block settings-card-remove"
        type="button"
        value="-"
        @click="$emit('remove')"
    />
  </div>
</template>

<style scoped>
.settings-card {
  background-color: #343434;
  height: fit-content;
  padding: 5px;
}

.settings-card-block {
  display: block;
  margin-top: 5px;
}

.settings-card-error {
  color: #b32f30;
}

.settings-card-remove {
}
</style>