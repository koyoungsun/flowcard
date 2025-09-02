<template>
    <div
      class="w-full h-40 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-50 transition"
      @click="goToAddPage"
    >
      <span class="text-gray-500 text-sm">+ 새 링크 카드 추가</span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  const router = useRouter();
  
  const goToAddPage = () => {
    router.push("/add");
  };
  </script>