<template>
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">새 링크카드 추가</h2>
  
      <form @submit.prevent="handleAddCard" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium">카드 제목</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full border rounded px-3 py-2"
            placeholder="예: 나의 구글 드라이브"
            required
          />
        </div>
  
        <div>
          <label class="block mb-1 text-sm font-medium">링크 URL</label>
          <input
            v-model="form.url"
            type="url"
            class="w-full border rounded px-3 py-2"
            placeholder="예: https://drive.google.com"
            required
          />
        </div>
  
        <!-- ✅ summary 입력 필드 -->
        <div>
          <label class="block mb-1 text-sm font-medium">간단한 설명 (선택)</label>
          <textarea
            v-model="form.summary"
            class="w-full border rounded px-3 py-2"
            placeholder="예: 구글 드라이브 바로가기"
            rows="3"
          ></textarea>
        </div>
  
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded w-full font-medium"
        >
          저장하고 홈으로
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  type LinkCard = {
    title: string
    url: string
    summary?: string
  }
  
  // 카드 폼 데이터
  const form = ref<LinkCard>({
    title: '',
    url: '',
    summary: ''
  })
  
  // 카드 추가 핸들러
  function handleAddCard(): void {
    const saved: LinkCard[] = JSON.parse(localStorage.getItem('cards') || '[]')
  
    const title = form.value.title.trim()
    const url = form.value.url.trim()
    const summary = form.value.summary?.trim() || ''
  
    // 중복 URL 검사
    const isDuplicate = saved.some(card => card.url === url)
    if (isDuplicate) {
      alert('이미 등록된 링크입니다.')
      return
    }
  
    // 저장
    saved.push({ title, url, summary })
    localStorage.setItem('cards', JSON.stringify(saved))
  
    // 이동
    router.push('/')
  }
  </script>