<template>
    <form @submit.prevent="addCard" class="flex flex-col gap-2 max-w-md">
      <input v-model="title" type="text" placeholder="제목" class="border p-2 rounded" />
      <input v-model="url" type="url" placeholder="링크" class="border p-2 rounded" />
      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">추가</button>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const title = ref('')
  const url = ref('')
  
  const addCard = () => {
    if (!title.value || !url.value) return
    const existing = JSON.parse(localStorage.getItem('linkCards') || '[]')
    existing.push({ title: title.value, url: url.value })
    localStorage.setItem('linkCards', JSON.stringify(existing))
    title.value = ''
    url.value = ''
  }
  </script>