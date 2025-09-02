<template>
    <div class="p-4">
      <h1 class="text-xl font-bold mb-4">내 카드 목록</h1>
      <ul v-if="cards.length > 0" class="space-y-3">
        <li
          v-for="card in cards"
          :key="card.id"
          class="flex items-center justify-between p-4 bg-white shadow rounded-md hover:bg-blue-50 cursor-pointer"
          @click="goToEdit(card.id)"
        >
          <div>
            <h2 class="text-md font-semibold">{{ card.title }}</h2>
            <p class="text-sm text-gray-500">{{ card.url }}</p>
          </div>
          <div class="w-8 h-8 rounded-full" :style="{ backgroundColor: card.color || '#ccc' }"></div>
        </li>
      </ul>
      <p v-else class="text-gray-500 text-center mt-10">카드가 아직 없습니다.</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  import { ref } from "vue";
  
  // 추후엔 Pinia store로 바꿔도 됩니다
  const cards = ref([
    { id: "1", title: "ChatGPT", url: "https://chat.openai.com", color: "#10a37f" },
    { id: "2", title: "GitHub", url: "https://github.com", color: "#000000" },
  ]);
  
  const router = useRouter();
  const goToEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };
  </script>