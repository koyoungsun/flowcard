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

      <div>
        <label class="block mb-1 text-sm font-medium">간단한 설명 (선택)</label>
        <textarea
          v-model="form.summary"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 구글 드라이브 바로가기"
          rows="3"
        ></textarea>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">태그 (쉼표 구분)</label>
        <input
          v-model="form.tagsInput"
          type="text"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 클라우드,구글"
        />
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
import { useRouter, useRoute } from 'vue-router'

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

const router = useRouter()
const route = useRoute()

// groupIndex를 정확하게 파싱하고, 없으면 null로 처리
const groupIndexRaw = route.params.groupIndex
const groupIndex = groupIndexRaw !== undefined ? Number(groupIndexRaw) : null

const form = ref({
  title: '',
  url: '',
  summary: '',
  tagsInput: '',
})

function handleAddCard(): void {
  const raw = localStorage.getItem('groups')
  if (!raw) {
    alert('저장된 그룹이 없습니다.')
    return
  }

  const groups = JSON.parse(raw) as LinkGroup[]
  if (groupIndex === null || isNaN(groupIndex) || !groups[groupIndex]) {
    alert('올바르지 않은 그룹입니다.')
    return
  }

  const group = groups[groupIndex]
  const cards = group.cards || []

  const title = form.value.title.trim()
  const url = form.value.url.trim()
  const summary = form.value.summary?.trim() || ''
  const tags = form.value.tagsInput
    ? form.value.tagsInput.split(',').map(tag => tag.trim()).filter(Boolean)
    : []

  const isDuplicate = cards.some(card => card.url === url)
  if (isDuplicate) {
    alert('이미 등록된 링크입니다.')
    return
  }

  const newCard: LinkCard = {
    title,
    url,
    summary,
    tags,
    updatedAt: Date.now()
  }

  group.cards.push(newCard)
  localStorage.setItem('groups', JSON.stringify(groups))

  router.push('/')
}
</script>