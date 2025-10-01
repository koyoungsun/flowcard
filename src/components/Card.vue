<template>
  <article>
    <div class="card-detail">
      <!-- 카드 제목 -->
        
      <h3 class="tit"><em>{{ cardIndex + 1 }}</em>{{ card.title }}</h3>

      <!-- 링크 주소 -->
      <a class="link-url" :href="card.url" target="_blank">
        {{ card.url }}
      </a>

      <!-- summary 있을 때만 노출 -->
      <p v-if="card.summary" class="summary">
        {{ card.summary }}
      </p>
      <!-- 카드 제목과 요약 아래 -->
      <div v-if="card.tags?.length" class="tag">
        <span v-for="(tag, idx) in card.tags" :key="idx" class="tag">
          #{{ tag }}
        </span>
      </div>
      <!-- 버튼 -->
      <div class="btn-box">
        <button @click="openLink" class="btn-go">
          바로가기
        </button>
        <button @click="editCard" class="btn-set">
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