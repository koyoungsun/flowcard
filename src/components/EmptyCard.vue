<template>
    <div class="flex flex-col items-center justify-center h-72 border-2 border-dashed border-gray-300 rounded-lg p-6">
      <p class="text-gray-500 mb-2">아직 등록된 링크 카드가 없어요.</p>
      <AddCardButton />
    </div>
  </template>
  
  <script setup>
  import AddCardButton from './AddCardButton.vue'
  </script>