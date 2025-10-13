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
          <label><input type="radio" value="list" v-model="defaultView" class="mr-1" />List Type</label>
        </div>
      </div>
      <div class="sel-btn">
        <button class="px-4 py-1 bg-indigo-500 text-white text-sm rounded" @click="applyDefaultView">확인</button>
        <button class="px-4 py-1 bg-gray-300 text-sm rounded" @click="showSettings = false">닫기</button>
      </div>
    </div>

    <!-- 정렬 옵션 -->
    <!-- <div v-if="viewMode === 'list'" class="flex justify-end items-center gap-2 text-sm">
      <label for="sortMode">정렬:</label>
      <select v-model="sortMode" class="border rounded px-2 py-1" id="sortMode">
        <option value="default">기본순</option>
        <option value="title">제목순</option>
        <option value="recent">최신순</option>
      </select>
    </div> -->

    <!-- 상태 -->
    <div class="now-posi">
      <h2>
        <div>
          <strong>{{ viewMode === 'card' ? '카드형' : '리스트형' }} 보기</strong>
          <span class="text-sm text-gray-500">({{ totalCardCount }})</span>
        </div>
        <button @click="createGroup">+ 그룹 만들기</button>
      </h2>
  </div>
    <!-- 그룹이 없는 경우 -->
    <div v-if="groups.length === 0">
      <EmptyCard :groupIndex="0" />
    </div>

    <!-- 그룹 목록 -->
    <div v-else>
      <div v-for="(group, gIdx) in groups" :key="gIdx" class="mb-8">
        <!-- 그룹 헤더 -->
        <div class="group-header-tit">
          <h3 class="text-lg font-semibold">
            <em>#</em><strong>{{ group.groupName }}</strong>
            <span v-if="group.cards.length > 0" class="text-sm text-gray-500">({{ group.cards.length }}개)</span>
          </h3>

          <!-- 그룹 옵션 메뉴 -->
          <div class="relative">
            <button @click="toggleGroupMenu(gIdx)" class="more">⋮</button>
            <div v-if="activeGroupMenuIndex === gIdx" class="nav-r">
              <ul class="text-sm">
                <li><button @click="renameGroup(gIdx)" class="rename">이름 수정</button></li>
                <li><button @click="deleteGroup(gIdx)" class="delete">그룹 삭제</button></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 리스트형 -->
        <div v-if="viewMode === 'list'" class="list">
          <draggable v-model="group.cards" :item-key="(_, i) => i" animation="200" handle=".drag-handle" class="list-area">
            <template #item="{ element, index }">
              <div class="list-detail">
                <div class="flex-1">
                  <h3>
                    <em v-if="group.cards.length > 0">#{{ index + 1 }}</em>{{ element.title }}
                  </h3>
                  <p v-if="element.summary" class="tit-summary">{{ element.summary }}</p>
                  <div v-if="element.tags?.length" class="tag">
                    <span v-for="(tag, tagIdx) in element.tags" :key="tagIdx" class="bg-gray-100 px-2 py-1 rounded-full mr-1 text-sm">
                      #{{ tag }}
                    </span>
                  </div>
                </div>
                <div class="btn-box-wrap">
                  <div class="btn-box">
                    <button class="btn-go" @click="openLink(element.url)">바로가기</button>
                    <button class="btn-setting" @click="editCard(gIdx, index)">편집</button>
                    <button class="btn-copy" @click="copyLink(element.url)">복사</button>
                  </div>
                  <div class="drag-handle cursor-move text-gray-400 ml-3">Drag</div>
                </div>
              </div>
            </template>
          </draggable>
          <div class="text-center mt-4">
            <AddCardButton :groupIndex="gIdx" />
          </div>
        </div>

        <!-- 카드형 -->
        <div class="card-wrap" v-else>
          <Swiper :slides-per-view="1.7" :space-between="8" centeredSlides>
            <SwiperSlide class="gradient-card" v-for="(card, index) in group.cards" :key="`card-${index}`">
              <div class="card-inner">
                <Card :card="card" :groupIndex="gIdx" :cardIndex="index" />
                <!-- 스파클(작은 반짝임)들 — 위치와 지연은 스타일 속성으로 조절 -->
    <span class="sparkle" style="--x:12%; --y:20%; --s:0.9; --d:0s;"></span>
    <span class="sparkle" style="--x:75%; --y:30%; --s:0.6; --d:0.6s;"></span>
    <span class="sparkle" style="--x:50%; --y:68%; --s:0.8; --d:1.1s;"></span>
              </div>
            </SwiperSlide>
            <SwiperSlide key="add-card">
              <AddCardSlide :groupIndex="gIdx" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
    <!-- 보기 전환 버튼 -->
    <div class="btn-toggle">
      <div>
        <button @click="toggleView" class="btn-chk">
          {{ viewMode === 'card' ? '리스트로보기' : '카드보기' }}
        </button>
    </div>
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

function copyLink(url: string) {
  navigator.clipboard.writeText(url).then(() => {
    alert('링크가 복사되었습니다!')
  }).catch(() => {
    alert('복사에 실패했습니다. 브라우저가 클립보드를 지원하지 않을 수 있어요.')
  })
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
  () => {
    saveGroups()
  },
  { deep: true }
)
</script>