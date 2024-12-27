<script setup lang="ts">
// inside parent component
// const isOpen = ref(false);

defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: "close");
}>();
</script>

<template lang="">
  <div v-if="isOpen">
    <!-- POPUP HUETA -->
     <slot></slot>
    <MyButton onClick="$emit('close')" />
  </div>
</template>

<style lang="">

</style>
