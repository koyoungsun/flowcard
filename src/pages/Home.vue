<template>
  <section class="p-4 space-y-6">
    <!-- 설정 버튼 -->
    <button class="top-setting" @click="showSettings = !showSettings">Setting</button>

    <!-- 보기 설정 -->
    <div v-if="showSettings" class="setting-area">
      <div class="sel-tit">
        <h3 class="tit">Default Mode Set</h3>
        <div class="sel-chk">
          <label><input type="radio" value="card" v-model="defaultView" class="mr-1" />Card Type</label>
          <label><input type="radio" value="list" v-model="defaultView" class="mr-1" />List type</label>
        </div>
      </div>
      <div class="sel-btn">
        <button class="px-4 py-1 bg-indigo-500 text-white text-sm rounded" @click="applyDefaultView">확인</button>
        <button class="px-4 py-1 bg-gray-300 text-sm rounded" @click="showSettings = false">닫기</button>
      </div>
    </div>

    <!-- 정렬 옵션 -->
    <div v-if="viewMode === 'list'" class="flex justify-end items-center gap-2 text-sm">
      <label for="sortMode">정렬:</label>
      <select v-model="sortMode" class="border rounded px-2 py-1" id="sortMode">
        <option value="default">기본순</option>
        <option value="title">제목순</option>
        <option value="recent">최신순</option>
      </select>
    </div>

    <!-- 상태 -->
    <h2 class="now-posi">
      <strong>Type {{ viewMode === 'card' ? 'Card' : 'List' }}</strong>
      <span class="text-sm text-gray-500">({{ totalCardCount }})</span>
    </h2>

    <!-- 그룹 리스트 -->
    <div v-if="groups.length === 0">
      <EmptyCard :groupIndex="0" />
    </div>

    <div v-else>
      <div v-for="(group, gIdx) in sortedGroups" :key="gIdx" class="mb-8">
        <!-- 그룹 헤더 -->
        <div class="group-header-tit">
          <h3 class="text-lg font-semibold">
            <em>#</em><strong>{{ group.groupName }}</strong>
            <span v-if="group.cards.length > 0" class="text-sm text-gray-500">({{ group.cards.length }}개)</span>
          </h3>

          <!-- 그룹 옵션 메뉴 -->
          <div class="relative">
            <button @click="toggleGroupMenu(gIdx)" class="text-gray-500 hover:text-black px-2 py-1 text-xl">⋮</button>
            <div v-if="activeGroupMenuIndex === gIdx" class="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-10">
              <ul class="text-sm">
                <li><button @click="renameGroup(gIdx)" class="w-full px-4 py-2 text-left hover:bg-gray-100">이름 수정</button></li>
                <li><button @click="deleteGroup(gIdx)" class="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100">그룹 삭제</button></li>
              </ul>
            </div>
          </div>
        </div>

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
        <div class="card-wrap" v-else>
          <Swiper :slides-per-view="2.2" :space-between="16" centeredSlides>
            <SwiperSlide v-for="(card, index) in group.cards" :key="`card-${index}`">
              <Card :card="card" :groupIndex="gIdx" :cardIndex="index" />
            </SwiperSlide>
            <SwiperSlide key="add-card">
              <AddCardSlide :groupIndex="gIdx" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>

    <!-- 새 그룹 만들기 -->
    <div class="text-center mt-10">
      <button class="bg-green-500 text-white px-6 py-2 rounded-full shadow" @click="createGroup">
        + 새 그룹 만들기
      </button>
    </div>

    <!-- 보기 전환 버튼 -->
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
const defaultView = ref<'card' | 'list'>((localStorage.getItem('defaultViewMode') as 'card' | 'list') || 'card')
const viewMode = ref<'card' | 'list'>(defaultView.value)
const showSettings = ref(false)
const sortMode = ref<'default' | 'title' | 'recent'>('default')
const activeGroupMenuIndex = ref<number | null>(null)

const totalCardCount = computed(() =>
  groups.value.reduce((sum, group) => sum + group.cards.length, 0)
)

function toggleView() {
  viewMode.value = viewMode.value === 'card' ? 'list' : 'card'
  localStorage.setItem('defaultViewMode', viewMode.value)
  defaultView.value = viewMode.value
}

function applyDefaultView() {
  localStorage.setItem('defaultViewMode', defaultView.value)
  viewMode.value = defaultView.value
  showSettings.value = false
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

function createGroup() {
  const name = prompt('그룹 이름을 입력하세요')
  if (!name) return

  const newGroup: LinkGroup = {
    groupName: name.trim(),
    cards: []
  }

  groups.value.push(newGroup)
  saveGroups()
}

function renameGroup(index: number) {
  const newName = prompt('새 그룹명을 입력하세요', groups.value[index].groupName)
  if (newName && newName.trim()) {
    groups.value[index].groupName = newName.trim()
    saveGroups()
    activeGroupMenuIndex.value = null
  }
}

function deleteGroup(index: number) {
  if (confirm('정말 이 그룹을 삭제하시겠습니까?\n삭제된 그룹은 복구할 수 없습니다.')) {
    groups.value.splice(index, 1)
    saveGroups()
    activeGroupMenuIndex.value = null
  }
}

function toggleGroupMenu(index: number) {
  activeGroupMenuIndex.value = activeGroupMenuIndex.value === index ? null : index
}

function saveGroups() {
  localStorage.setItem('groups', JSON.stringify(groups.value))
}

onMounted(loadGroups)
onActivated(loadGroups)

watch(
  groups,
  (newVal) => {
    saveGroups()
  },
  { deep: true }
)

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
</script>