<template>
    <router-link to="/" class="text-gray-600 text-sm block mt-4 underline">← 홈으로</router-link>
    <div class="max-w-md mx-auto mt-8 space-y-4">
      <h2 class="text-xl font-bold mb-4">카드 수정</h2>
  
      <p class="text-sm text-gray-500">현재 그룹: {{ currentGroupName }}</p>
  
      <label class="block">
        <span>제목</span>
        <input v-model="form.title" class="w-full border p-2 rounded mt-1" />
      </label>
  
      <label class="block">
        <span>URL</span>
        <input v-model="form.url" class="w-full border p-2 rounded mt-1" />
      </label>
  
      <label class="block">
        <span>요약</span>
        <textarea v-model="form.summary" class="w-full border p-2 rounded mt-1" rows="3"></textarea>
      </label>
  
      <button @click="saveEdit" class="bg-indigo-500 text-white px-4 py-2 rounded w-full">
        저장하기
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  
  type LinkCard = {
    title: string
    url: string
    summary?: string
    tags?: string[]
    updatedAt?: number
  }
  
  type LinkGroup = {
    groupName: string
    cards: LinkCard[]
  }
  
  const route = useRoute()
  const router = useRouter()
  
  const groupIndex = Number(route.params.groupIndex)
  const cardIndex = Number(route.params.cardIndex)
  
  const form = ref<LinkCard>({
    title: '',
    url: '',
    summary: ''
  })
  
  const currentGroupName = computed(() => {
    const raw = localStorage.getItem('groups')
    if (!raw) return ''
    const groups = JSON.parse(raw) as LinkGroup[]
    return groups[groupIndex]?.groupName || ''
  })
  
  onMounted(() => {
    const raw = localStorage.getItem('groups')
    if (!raw) return
  
    const groups = JSON.parse(raw) as LinkGroup[]
    const card = groups?.[groupIndex]?.cards?.[cardIndex]
  
    if (card) {
      form.value.title = card.title
      form.value.url = card.url
      form.value.summary = card.summary || ''
    }
  })
  
  function saveEdit() {
    const raw = localStorage.getItem('groups')
    if (!raw) return
  
    const groups = JSON.parse(raw) as LinkGroup[]
    const card = groups?.[groupIndex]?.cards?.[cardIndex]
  
    if (card) {
      groups[groupIndex].cards[cardIndex] = {
        ...card,
        title: form.value.title.trim(),
        url: form.value.url.trim(),
        summary: form.value.summary.trim(),
        updatedAt: Date.now()
      }
  
      localStorage.setItem('groups', JSON.stringify(groups))
      router.push('/')
    }
  }
  </script>