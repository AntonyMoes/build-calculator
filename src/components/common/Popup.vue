<script setup lang="ts">
import {useTemplateRef} from "vue";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (name: "close"): void;
}>();

const back = useTemplateRef("popup-back");

function onBackClick(event: Event) {
  if (event.target === back.value) {
    onClose();
  }
}

function onClose() {
  emit("close");
}
</script>

<template>
  <div class="popup"
       v-if="isOpen"
       @click="onBackClick"
       ref="popup-back"
  >
    <div class="popup-content">
      <div class="popup-header">
        <span class="close" @click="onClose">X</span>
        <h2 class="popup-header-title">
          <slot name="title"></slot>
        </h2>
      </div>

      <div class="popup-body">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>


.popup {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

.popup-content {
  position: relative;
  background-color: var(--vt-c-black-soft);
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 80%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-animation-name: animate-popup;
  -webkit-animation-duration: 0.2s;
  animation-name: animate-popup;
  animation-duration: 0.2s
}

/* Add Animation */
@-webkit-keyframes animate-popup {
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
}

@keyframes animate-popup {
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
}

.close {
  color: white;
  float: right;
  font-size: 18px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.popup-header {
  padding: 2px 16px;
  background-color: var(--vt-c-black);
  color: var(--vt-c-text-dark-1);
}

.popup-body {
  padding: 2px 16px;
}

.popup-footer {
  padding: 2px 16px;
  background-color: var(--vt-c-black);
  color: var(--vt-c-text-dark-1);
}
</style>