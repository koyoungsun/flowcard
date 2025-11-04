<template>
    <nav class="flex items-center px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
      <button
        @click="$router.back()"
        class="text-gray-600 hover:text-lavender-700 transition text-sm font-medium flex items-center gap-1"
      >
        <i class="bi bi-arrow-left text-base"></i>
        이전으로
      </button>
  
      <div class="flex-1 text-center">
        <h1 class="text-sm text-gray-500 tracking-wide select-none">LINKNEST</h1>
      </div>
    </nav>
  </template>