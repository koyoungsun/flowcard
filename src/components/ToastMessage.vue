<template>
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
               bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg"
      >
        {{ message }}
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  
  const visible = ref(false);
  const message = ref("");
  
  function show(msg: string) {
    message.value = msg;
    visible.value = true;
    setTimeout(() => (visible.value = false), 2000);
  }
  
  defineExpose({ show });
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>