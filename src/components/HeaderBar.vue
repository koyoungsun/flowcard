<template>
  <nav
    class="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-white shadow-sm top-nav"
  >
    <!-- 로고 -->
    <router-link to="/" class="flex items-center gap-1 select-none">
      <h1 class="text-lg font-bold tracking-wide">
        <span class="text-lavender-700">LINK</span>
        <strong class="text-gray-800">NEST</strong>
      </h1>
    </router-link>

    <!-- 우측 영역 -->
    <div class="flex items-center gap-3">
      <!-- 안내 버튼 (항상 표시) -->
      <button @click="$emit('openGuide')" class="top-info text-gray-600 hover:text-lavender-700">
        <i class="bi bi-info-circle text-xl"></i>
      </button>

      <!-- 로그인 전: 로그인 버튼 -->
      <button
        v-if="!user"
        @click="$emit('login')"
        class="text-sm font-medium text-lavender-700 hover:text-lavender-900 transition"
      >
        로그인
      </button>

      <!-- 로그인 후: 햄버거 메뉴 -->
      <button
        v-else
        class="top-navi text-gray-700 hover:text-lavender-700 transition text-2xl"
        @click="$emit('toggleNav')"
      >
        <i class="bi bi-list"></i>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
defineProps({
  user: {
    type: Object,
    default: null,
  },
});
</script>

<style scoped>
.top-info i {
  font-size: 1.25rem;
  transition: color 0.2s ease;
}
.top-navi i {
  font-size: 1.6rem;
}
</style>