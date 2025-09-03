<template>
  <article>
    <div class="border p-4 rounded shadow space-y-2">
      <!-- 카드 제목 -->
      <em>{{ cardIndex + 1 }}</em>  
      <h3 class="text-lg font-bold">{{ card.title }}</h3>

      <!-- 링크 주소 -->
      <a
        class="text-blue-500 underline text-sm break-all"
        :href="card.url"
        target="_blank"
      >
        {{ card.url }}
      </a>

      <!-- summary 있을 때만 노출 -->
      <p v-if="card.summary" class="text-sm text-gray-600">
        {{ card.summary }}
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
</article>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
import { useRouter } from 'vue-router'

const props = defineProps<{
  card: {
    title: string
    url: string
    summary?: string
    tags?: string[]
    updatedAt?: number
  }
  groupIndex: number
  cardIndex: number
}>()

const router = useRouter()

const openLink = () => {
  window.open(props.card.url, "_blank")
}

const editCard = () => {
  router.push({
    name: 'EditCard',
    params: {
      groupIndex: props.groupIndex,
      cardIndex: props.cardIndex,
    }
  })
}
</script>