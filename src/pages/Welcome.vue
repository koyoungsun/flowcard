<!-- src/pages/Welcome.vue -->
<template>
    <div class="p-8 text-center">
      <h1 class="text-2xl font-bold mb-4">환영합니다!</h1>
      <p class="text-gray-600">로그인 또는 회원가입이 완료되었습니다.</p>
      <router-link to="/" class="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded">
        홈으로 가기
      </router-link>
    </div>
  </template>
  
  <script setup lang="ts">
  // Welcome 페이지에 특별한 로직은 아직 필요 없음
  </script>