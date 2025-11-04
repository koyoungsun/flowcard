<template>
    <section class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center error-wrap">
        <em></em>
        <p class="text-gray-500 mb-6">페이지를 찾을 수 없습니다.</p>
        <button
            @click="goHome"
            class="px-5 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
        >
            홈으로 돌아가기
        </button>
    </section>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  const router = useRouter();
  function goHome() {
    router.push("/home");
  }
  </script>