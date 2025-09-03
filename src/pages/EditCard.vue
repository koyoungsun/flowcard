<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">링크카드 편집</h2>

    <form @submit.prevent="handleSave" class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium">카드 제목</label>
        <input
          v-model="form.title"
          type="text"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 나의 유튜브 채널"
          required
        />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">링크 URL</label>
        <input
          v-model="form.url"
          type="url"
          class="w-full border rounded px-3 py-2"
          placeholder="예: https://youtube.com/..."
          required
        />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">간단한 설명 (선택)</label>
        <textarea
          v-model="form.summary"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 유튜브 채널 정리용 카드"
        ></textarea>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">태그 (쉼표 구분)</label>
        <input
          v-model="form.tagsInput"
          type="text"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 유튜브,채널"
        />
      </div>

      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded w-full font-medium"
      >
        수정 완료
      </button>

      <button
        type="button"
        @click="handleDelete"
        class="bg-red-500 text-white px-4 py-2 rounded w-full font-medium mt-2"
      >
        삭제하기
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
  groupTags?: string[]
  cards: LinkCard[]
}

const router = useRouter()
const route = useRoute()

const groupIndex = parseInt(route.params.groupIndex as string)
const cardIndex = parseInt(route.params.cardIndex as string)

const form = ref({
  title: '',
  url: '',
  summary: '',
  tagsInput: ''
})

onMounted(() => {
  const groups: LinkGroup[] = JSON.parse(localStorage.getItem('groups') || '[]')
  const card = groups?.[groupIndex]?.cards?.[cardIndex]
  if (card) {
    form.value.title = card.title
    form.value.url = card.url
    form.value.summary = card.summary || ''
    form.value.tagsInput = card.tags?.join(', ') || ''
  } else {
    alert('존재하지 않는 카드입니다.')
    router.push('/')
  }
})

function handleSave() {
  const groups: LinkGroup[] = JSON.parse(localStorage.getItem('groups') || '[]')
  const cards = groups[groupIndex].cards

  const title = form.value.title.trim()
  const url = form.value.url.trim()
  const summary = form.value.summary?.trim() || ''
  const tags = form.value.tagsInput
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)

  // 동일 그룹 내 URL 중복 검사 (자기 자신 제외)
  const isDuplicate = cards.some((c, i) => i !== cardIndex && c.url === url)
  if (isDuplicate) {
    alert('이미 등록된 링크입니다.')
    return
  }

  const updatedCard: LinkCard = {
    title,
    url,
    summary,
    tags,
    updatedAt: Date.now()
  }

  cards[cardIndex] = updatedCard
  localStorage.setItem('groups', JSON.stringify(groups))
  router.push('/')
}

function handleDelete() {
  if (confirm('정말 삭제하시겠습니까?')) {
    const groups: LinkGroup[] = JSON.parse(localStorage.getItem('groups') || '[]')
    groups[groupIndex].cards.splice(cardIndex, 1)
    localStorage.setItem('groups', JSON.stringify(groups))
    router.push('/')
  }
}
</script>