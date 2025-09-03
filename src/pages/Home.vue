<template>
  <section class="p-4 space-y-6">
    <!-- 설정 버튼 -->
    <button class="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            @click="showSettings = !showSettings">Setting</button>

    <!-- 보기 설정 -->
    <div v-if="showSettings" class="border p-4 rounded-md bg-gray-50">
      <h3 class="text-sm font-medium mb-2">기본 보기 모드 설정</h3>
      <div class="flex gap-4 mb-4">
        <label><input type="radio" value="card" v-model="defaultView" class="mr-1" />카드형</label>
        <label><input type="radio" value="list" v-model="defaultView" class="mr-1" />리스트형</label>
      </div>
      <div class="flex gap-2">
        <button class="px-4 py-1 bg-indigo-500 text-white text-sm rounded" @click="applyDefaultView">확인</button>
        <button class="px-4 py-1 bg-gray-300 text-sm rounded" @click="showSettings = false">닫기</button>
      </div>
    </div>

    <!-- 정렬 옵션 (리스트형일 때만 표시) -->
    <div v-if="viewMode === 'list'" class="flex justify-end items-center gap-2 text-sm">
      <label for="sortMode">정렬:</label>
      <select v-model="sortMode" class="border rounded px-2 py-1" id="sortMode">
        <option value="default">기본순</option>
        <option value="title">제목순</option>
        <option value="recent">최신순</option>
      </select>
    </div>

    <!-- 상태 -->
    <h2 class="text-xl font-bold">
      현재 {{ viewMode === 'card' ? '카드형' : '리스트형' }}
      <span class="text-sm text-gray-500">({{ totalCardCount }}개)</span>
    </h2>

    <!-- 그룹 카드 출력 -->
    <div v-if="groups.length === 0">
      <EmptyCard :groupIndex="0" />
    </div>

    <div v-else>
      <div v-for="(group, gIdx) in sortedGroups" :key="gIdx" class="mb-8">
        <h3 class="text-lg font-semibold mb-3">{{ group.groupName }}</h3>

        <!-- 리스트형 -->
        <div v-if="viewMode === 'list'" class="space-y-2">
          <draggable v-model="group.cards" item-key="title" animation="200" handle=".drag-handle">
            <template #item="{ element, index }">
              <div class="border p-4 rounded-md shadow bg-white flex justify-between items-start">
                <div class="flex-1">
                  <em class="block text-xs text-gray-400 mb-1">#{{ index + 1 }}</em>
                  <h3 class="text-lg font-semibold mb-1">{{ element.title }}</h3>
                  <p v-if="element.summary" class="text-gray-500 text-sm mb-2">{{ element.summary }}</p>
                  <div class="flex gap-2">
                    <button class="bg-blue-500 text-white text-sm px-3 py-1 rounded" @click="openLink(element.url)">바로가기</button>
                    <button class="bg-gray-300 text-sm px-3 py-1 rounded" @click="editCard(gIdx, index)">편집</button>
                  </div>
                </div>
                <div class="drag-handle cursor-move text-gray-400 ml-3">☰</div>
              </div>
            </template>
          </draggable>
          <div class="text-center mt-4">
            <AddCardButton :groupIndex="gIdx" />
          </div>
        </div>

        <!-- 카드형 -->
        <div v-else>
          <Swiper :slides-per-view="1.2" :space-between="16" centeredSlides>
            <SwiperSlide v-for="(card, index) in group.cards" :key="`card-${index}`">
              <Card :data="card" :index="index" />
            </SwiperSlide>
            <SwiperSlide key="add-card">
              <AddCardSlide :groupIndex="gIdx" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
    <!-- 항상 보여주는 새 그룹 만들기 버튼 -->
    <div class="text-center mt-10">
      <button
        class="bg-green-500 text-white px-6 py-2 rounded-full shadow"
        @click="createGroup"
      >
        + 새 그룹 만들기
      </button>
    </div>
    <!-- 하단 보기 전환 버튼 -->
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <button @click="toggleView" class="bg-indigo-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow">
        {{ viewMode === 'card' ? '리스트형 보기' : '카드형 보기' }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/Card.vue'
import EmptyCard from '@/components/EmptyCard.vue'
import AddCardButton from '@/components/AddCardButton.vue'
import AddCardSlide from '@/components/AddCardSlide.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import draggable from 'vuedraggable'
import 'swiper/css'

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
const groups = ref<LinkGroup[]>([])

const defaultView = ref<'card' | 'list'>(
  (localStorage.getItem('defaultViewMode') as 'card' | 'list') || 'card'
)
const viewMode = ref<'card' | 'list'>(defaultView.value)
const showSettings = ref(false)

const sortMode = ref<'default' | 'title' | 'recent'>('default')

const totalCardCount = computed(() =>
  groups.value.reduce((sum, group) => sum + group.cards.length, 0)
)

function applyDefaultView() {
  localStorage.setItem('defaultViewMode', defaultView.value)
  viewMode.value = defaultView.value
  showSettings.value = false
}

function toggleView() {
  viewMode.value = viewMode.value === 'card' ? 'list' : 'card'
  localStorage.setItem('defaultViewMode', viewMode.value)
  defaultView.value = viewMode.value
}

function openLink(url: string) {
  window.open(url, '_blank')
}

function editCard(groupIndex: number, cardIndex: number) {
  router.push({ name: 'EditCard', params: { groupIndex, cardIndex } })
}

function loadGroups() {
  try {
    const saved = localStorage.getItem('groups')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        groups.value = parsed
      }
    }
  } catch (e) {
    console.error('그룹 로딩 오류:', e)
    groups.value = []
  }
}

// 그룹 데이터 불러오기 (초기 mount + 다시 진입 시)
onMounted(loadGroups)
onActivated(loadGroups)

// 그룹이 변경되면 localStorage에 저장
watch(
  groups,
  (newVal) => {
    localStorage.setItem('groups', JSON.stringify(newVal))
  },
  { deep: true }
)

// 정렬된 그룹 반환
const sortedGroups = computed(() => {
  if (viewMode.value !== 'list') return groups.value

  return groups.value.map(group => {
    const sortedCards = [...group.cards]
    if (sortMode.value === 'title') {
      sortedCards.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortMode.value === 'recent') {
      sortedCards.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    }
    return { ...group, cards: sortedCards }
  })
})

function createGroup() {
  const name = prompt('그룹 이름을 입력하세요')
  if (!name) return

  const newGroup: LinkGroup = {
    groupName: name.trim(),
    cards: []
  }

  groups.value.push(newGroup)
  localStorage.setItem('groups', JSON.stringify(groups.value))
}
</script>