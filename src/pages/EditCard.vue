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
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  type LinkCard = {
    title: string;
    url: string;
    summary?: string;
  }
  
  const router = useRouter();
  const route = useRoute();
  const index = parseInt(route.params.index as string);
  
  const form = ref<LinkCard>({
    title: '',
    url: '',
    summary: ''
  });
  
  onMounted(() => {
    const cards: LinkCard[] = JSON.parse(localStorage.getItem('cards') || '[]');
    if (cards[index]) {
      form.value = { ...cards[index] };
    } else {
      alert('존재하지 않는 카드입니다.');
      router.push('/');
    }
  });
  
  function handleSave() {
    const cards: LinkCard[] = JSON.parse(localStorage.getItem('cards') || '[]');
    cards[index] = form.value;
    localStorage.setItem('cards', JSON.stringify(cards));
    router.push('/');
  }
  
  function handleDelete() {
    if (confirm('정말 삭제하시겠습니까?')) {
      const cards: LinkCard[] = JSON.parse(localStorage.getItem('cards') || '[]');
      cards.splice(index, 1);
      localStorage.setItem('cards', JSON.stringify(cards));
      router.push('/');
    }
  }
  </script>