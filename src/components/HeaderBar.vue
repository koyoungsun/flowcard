<template>
    <header class="flex justify-between items-center p-4 border-b border-gray-200">
      <button @click="$emit('toggleNav')" class="text-2xl">☰</button>
    </header>
  </template>
  
  <script setup lang="ts">
  // 부모(Home.vue)에서 toggleNav 이벤트를 받아서 토스트 메뉴 열기 제어
  </script>