<template>
    <div class="p-4 rounded-lg shadow bg-white flex items-center space-x-3">
      <div class="w-10 h-10 rounded-full bg-gray-200"></div>
      <a :href="card.link" target="_blank" class="text-blue-600 hover:underline">{{ card.name }}</a>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    card: {
      name: string;
      link: string;
    };
  }>();
  </script>