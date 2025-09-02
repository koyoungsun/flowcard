<template>
    <section class="p-4 space-y-6">
      <!-- 상단 상태 표시 + 설정 버튼 -->
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-bold">
          현재 {{ viewMode === 'card' ? '카드형' : '리스트형' }}
          <span class="text-sm text-gray-500">({{ cards.length }}개)</span>
        </h2>
        <button
          class="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          @click="showSettings = !showSettings"
        >
          설정 열기
        </button>
      </div>
  
      <!-- 보기 모드 설정 UI -->
      <div v-if="showSettings" class="border p-4 rounded-md bg-gray-50">
        <h3 class="text-sm font-medium mb-2">기본 보기 모드 설정</h3>
        <div class="flex gap-4 mb-4">
          <label>
            <input
              type="radio"
              value="card"
              v-model="defaultView"
              class="mr-1"
            />
            카드형
          </label>
          <label>
            <input
              type="radio"
              value="list"
              v-model="defaultView"
              class="mr-1"
            />
            리스트형
          </label>
        </div>
        <div class="flex gap-2">
          <button
            class="px-4 py-1 bg-indigo-500 text-white text-sm rounded"
            @click="applyDefaultView"
          >
            확인
          </button>
          <button
            class="px-4 py-1 bg-gray-300 text-sm rounded"
            @click="showSettings = false"
          >
            닫기
          </button>
        </div>
      </div>
  
      <!-- 카드 없음 -->
      <EmptyCard v-if="cards.length === 0" />
  
      <!-- 리스트형 -->
      <div v-else-if="viewMode === 'list'" class="space-y-2">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="border p-4 rounded-md shadow bg-white"
        >
          <em class="block text-xs text-gray-400 mb-1">#{{ index + 1 }}</em>
          <h3 class="text-lg font-semibold mb-1">{{ card.title }}</h3>
          <p v-if="card.summary" class="text-gray-500 text-sm mb-2">
            {{ card.summary }}
          </p>
          <div class="flex gap-2">
            <button
              class="bg-blue-500 text-white text-sm px-3 py-1 rounded"
              @click="openLink(card.url)"
            >
              바로가기
            </button>
            <button
              class="bg-gray-300 text-sm px-3 py-1 rounded"
              @click="editCard(index)"
            >
              편집
            </button>
          </div>
        </div>
        <div class="text-center mt-4">
          <AddCardButton />
        </div>
      </div>
  
      <!-- 카드형 -->
      <div v-else>
        <Swiper :slides-per-view="1.2" :space-between="16" centeredSlides>
          <SwiperSlide v-for="(card, index) in cards" :key="`card-${index}`">
            <Card :data="card" :index="index" />
          </SwiperSlide>
          <SwiperSlide key="add-card">
            <AddCardSlide />
          </SwiperSlide>
        </Swiper>
      </div>
  
      <!-- 하단 고정 토글 버튼 -->
      <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <button
          @click="toggleView"
          class="bg-indigo-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow"
        >
          {{ viewMode === 'card' ? '리스트형 보기' : '카드형 보기' }}
        </button>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Card from '@/components/Card.vue'
  import EmptyCard from '@/components/EmptyCard.vue'
  import AddCardButton from '@/components/AddCardButton.vue'
  import AddCardSlide from '@/components/AddCardSlide.vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/css'
  
  type LinkCard = {
    title: string
    url: string
    summary?: string
  }
  
  // 카드 리스트 상태
  const cards = ref<LinkCard[]>([])
  
  // 보기 모드 상태
  const defaultView = ref<'card' | 'list'>(
    (localStorage.getItem('defaultViewMode') as 'card' | 'list') || 'card'
  )
  const viewMode = ref<'card' | 'list'>(defaultView.value)
  
  // 설정창 표시 여부
  const showSettings = ref(false)
  
  // 확인 버튼으로 디폴트 적용
  function applyDefaultView() {
    localStorage.setItem('defaultViewMode', defaultView.value)
    viewMode.value = defaultView.value
    showSettings.value = false
  }
  
  // 보기 모드 전환 버튼
  function toggleView() {
    viewMode.value = viewMode.value === 'card' ? 'list' : 'card'
    localStorage.setItem('defaultViewMode', viewMode.value)
    defaultView.value = viewMode.value
  }
  
  // 링크 열기
  function openLink(url: string) {
    window.open(url, '_blank')
  }
  
  // 편집 페이지 이동
  function editCard(index: number) {
    window.location.href = `/edit/${index}`
  }
  
  // 카드 로드
  onMounted(() => {
    const saved = localStorage.getItem('cards')
    if (saved) {
      try {
        cards.value = JSON.parse(saved)
      } catch (e) {
        console.error('카드 로딩 오류:', e)
        cards.value = []
      }
    }
  })
  </script>