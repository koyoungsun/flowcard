<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 transform z-50
             bg-[rgba(0,0,0,0.75)] text-white text-sm px-5 py-2 rounded-full
             shadow-md backdrop-blur-sm text-center max-w-[80%]"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const message = ref("");
let timer: ReturnType<typeof setTimeout> | null = null;

function show(msg: string, duration = 2500) {
  message.value = msg;
  visible.value = true;

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    visible.value = false;
  }, duration);
}

defineExpose({ show });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>