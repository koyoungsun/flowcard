<template>
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">설정</h2>
      <button @click="clear" class="text-red-500 border px-4 py-2 rounded hover:bg-red-100">저장 정보 초기화</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  const clear = () => {
    localStorage.clear()
    router.push('/login')
  }
  </script>