<template>
  <div class="linkcard-setting">
    <h2 class="tit-link-set">링크카드 편집</h2>
    <form @submit.prevent="handleSave" class="space-y-4">
      <div>
        <label class="">Card Title</label>
        <input
          v-model="form.title"
          type="text"
          class="card-name"
          placeholder="ex: 나의 유튜브 채널"
          required
        />
      </div>

      <div>
        <label class="">Link URL</label>
        <input
          v-model="form.url"
          type="url"
          class="w-full border rounded px-3 py-2"
          placeholder="ex: https://youtube.com/..."
          required
        />
      </div>

      <div>
        <label class="">Comment</label>
        <textarea
          v-model="form.summary"
          class="w-full border rounded px-3 py-2"
          placeholder="ex: 유튜브 채널 정리용 카드"
        ></textarea>
      </div>

      <div>
        <label class="">Tag</label>
        <input
          v-model="form.tagsInput"
          type="text"
          class="w-full border rounded px-3 py-2"
          placeholder="ex: 유튜브,채널"
        />
      </div>
      <div class="btn-box">
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
        삭제
      </button>
    </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps<{
  groupIndex: number
  cardIndex: number
}>()

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
const groupIndex = props.groupIndex
const cardIndex = props.cardIndex

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