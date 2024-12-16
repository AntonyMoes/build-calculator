<script setup lang="ts">
import {ref} from "vue";

defineEmits<{
  (e: "change", value: number): void
}>();

const value = ref(0);
</script>

<template>
  <div class="variable-input-container">
    <!-- TODO: add "for=" to the label -->
    <label class="variable-input-label">
      <slot name="name"/>
    </label>

    <input
        class="variable-input"
        v-model.number="value"
        type="number"
        @input="$emit('change', value)"
    />
  </div>
</template>

<style scoped>
.variable-input-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  max-width: 20rem;
}

.variable-input-label {
  max-width: 5rem;
  word-wrap: anywhere;
}

.variable-input {
  width: 100%;
  height: 1.5rem;
}
</style>