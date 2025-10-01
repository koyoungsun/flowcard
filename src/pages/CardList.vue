<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">내 카드 목록</h1>

    <div v-if="loading">불러오는 중...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <ul v-else-if="cards.length > 0" class="space-y-3">
      <li
        v-for="card in cards"
        :key="card.id"
        class="flex items-center justify-between p-4 bg-white shadow rounded-md hover:bg-blue-50 cursor-pointer"
        @click="goToEdit(card.groupIndex, card.id)"
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
import { useRouter } from "vue-router"
import { useCard } from "@/composables/useCard"

const router = useRouter()
const { cards, loading, error } = useCard()

function goToEdit(groupIndex: number, cardId: string) {
  router.push(`/edit/${groupIndex}/${cardId}`)
}
</script>