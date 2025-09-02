<template>
    <div
      @click="goToAdd"
      class="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-50"
    >
      <p class="text-gray-600">➕ 링크 카드 추가</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  const router = useRouter();
  const goToAdd = () => router.push("/add");
  </script>