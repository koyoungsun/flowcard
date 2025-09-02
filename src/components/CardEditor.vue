<template>
    <div>
      <h2 class="text-xl font-bold mb-4">카드 편집</h2>
      <form class="space-y-4">
        <input
          v-model="cardTitle"
          type="text"
          placeholder="링크 제목"
          class="w-full px-4 py-2 border rounded"
        />
        <input
          v-model="cardUrl"
          type="url"
          placeholder="링크 주소"
          class="w-full px-4 py-2 border rounded"
        />
        <button
          @click.prevent="saveCard"
          class="bg-blue-600 text-white px-4 py-2 rounded"
        >
          저장
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  
  const cardTitle = ref("");
  const cardUrl = ref("");
  
  const saveCard = () => {
    console.log("Saved!", { title: cardTitle.value, url: cardUrl.value });
  };
  </script>