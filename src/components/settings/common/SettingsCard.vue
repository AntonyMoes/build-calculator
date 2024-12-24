<script setup lang="ts">
import RemoveButton from "@/components/common/RemoveButton.vue";
import ErrorsBlock from "@/components/common/ErrorsBlock.vue";

defineProps<{
  errors?: string[];
}>();

defineEmits<{
  (name: "remove"): void
}>();
</script>

<template>
  <div class="settings-card">
    <slot name="content"/>
    <ErrorsBlock v-if="errors !== undefined" :errors="errors"/>
    <RemoveButton class="settings-card-block" @remove="$emit('remove')"/>
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
</style>