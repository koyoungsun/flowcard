<template>
  <nav
    class="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-white shadow-sm top-nav"
  >
    <!-- 로고 -->
    <router-link to="/" class="flex items-center gap-1 select-none">
      <h1 class="text-lg font-bold text-indigo-600 tracking-wide">
        LINK <strong class="text-gray-800">NEST</strong>
      </h1>
    </router-link>

    <!-- 오른쪽 -->
    <div class="flex items-center gap-3">
      <button
        @click="$emit('openGuide')"
        class="text-gray-500 hover:text-indigo-500 transition top-info"
      >Info
      </button>
      <button
        class="ml-2 text-2xl text-gray-700 hover:text-indigo-500 top-navi"
        @click="$emit('toggleNav')"
      >
        ☰
      </button>
    </div>
  </nav>
</template>