<template>
    <section class="p-4 space-y-6">
      <h2 class="text-xl font-bold mb-4">🔧 그룹 관리</h2>
  
      <div v-if="groups.length === 0" class="text-gray-500">아직 그룹이 없습니다.</div>
  
      <div v-for="(group, index) in groups" :key="index" class="border rounded p-4 space-y-2 bg-white shadow">
        <div class="flex items-center gap-2">
          <label class="w-24 text-sm font-medium">그룹명</label>
          <input v-model="group.groupName" type="text" class="flex-1 border rounded px-2 py-1 text-sm" />
        </div>
  
        <div class="flex items-center gap-2">
          <label class="w-24 text-sm font-medium">태그</label>
          <input
            v-model="group.groupTagsString"
            type="text"
            class="flex-1 border rounded px-2 py-1 text-sm"
            placeholder="쉼표로 구분된 태그 입력"
          />
        </div>
  
        <button @click="deleteGroup(index)" class="text-sm text-red-500 hover:underline">그룹 삭제</button>
      </div>
  
      <div class="text-center">
        <button @click="addGroup" class="bg-indigo-500 text-white px-4 py-2 rounded text-sm">+ 새 그룹 추가</button>
      </div>
  
      <div class="text-right">
        <button @click="saveChanges" class="mt-6 bg-blue-500 text-white px-6 py-2 rounded text-sm font-medium">저장 후 홈으로</button>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  type LinkCard = {
    title: string
    url: string
    summary?: string
    tags?: string[]
  }
  
  type LinkGroup = {
    groupName: string
    groupTags?: string[]
    groupTagsString?: string // 사용 편의용
    cards: LinkCard[]
  }
  
  const router = useRouter()
  const groups = ref<LinkGroup[]>([])
  
  onMounted(() => {
    const saved = localStorage.getItem('groups')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        groups.value = parsed.map((g: LinkGroup) => ({
          ...g,
          groupTagsString: (g.groupTags || []).join(', ')
        }))
      } catch (e) {
        console.error('그룹 불러오기 오류:', e)
      }
    }
  })
  
  function addGroup() {
    groups.value.push({
      groupName: '새 그룹',
      groupTags: [],
      groupTagsString: '',
      cards: []
    })
  }
  
  function deleteGroup(index: number) {
    if (confirm('이 그룹을 정말 삭제하시겠습니까?')) {
      groups.value.splice(index, 1)
    }
  }
  
  function saveChanges() {
    const processed = groups.value.map(g => ({
      groupName: g.groupName,
      groupTags: g.groupTagsString?.split(',').map(tag => tag.trim()).filter(Boolean),
      cards: g.cards || []
    }))
    localStorage.setItem('groups', JSON.stringify(processed))
    router.push('/')
  }
  </script>