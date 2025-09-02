<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card
        v-for="(card, index) in cards"
        :key="index"
        :title="card.title"
        :url="card.url"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Card from './Card.vue'
  
  const cards = ref<{ title: string; url: string }[]>([])
  
  onMounted(() => {
    const stored = localStorage.getItem('linkCards')
    cards.value = stored ? JSON.parse(stored) : []
  })
  </script>