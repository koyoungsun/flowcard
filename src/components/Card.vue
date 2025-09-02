<template>
    <div class="border p-4 rounded shadow space-y-2">
    <!-- 카드 제목 -->
    <em>{{ index + 1 }}</em>  
    <h3 class="text-lg font-bold">{{ data.title }}</h3>
  
      <!-- 링크 주소 -->
      <a
        class="text-blue-500 underline text-sm break-all"
        :href="data.url"
        target="_blank"
      >
        {{ data.url }}
      </a>
  
      <!-- summary 있을 때만 노출 -->
      <p v-if="data.summary" class="text-sm text-gray-600">
        {{ data.summary }}
      </p>
   
      <!-- 버튼 -->
      <div class="flex gap-2 mt-2">
        <button
          @click="openLink"
          class="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          바로가기
        </button>
        <button
          @click="editCard"
          class="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
        >
          편집
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()


// props 정의 (정적 타입 방식)
const props = defineProps<{
  data: {
    title: string
    url: string
    summary?: string
  },
  index: number
}>()

const openLink = () => {
  window.open(props.data.url, "_blank")
}

const editCard = () => {
  const allCards = JSON.parse(localStorage.getItem("cards") || "[]")
  const index = allCards.findIndex(
    (c) => c.title === props.data.title && c.url === props.data.url
  )
  if (index !== -1) {
    router.push(`/edit/${index}`)
  }
}
</script>