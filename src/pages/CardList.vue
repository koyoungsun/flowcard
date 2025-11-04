<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">내 카드 목록</h1>

    <div v-if="loading" class="text-gray-500">불러오는 중...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <!-- 카드 목록 -->
    <ul v-else-if="cards.length > 0" class="space-y-3">
      <li
        v-for="card in cards"
        :key="card.id"
        class="flex items-center justify-between p-4 bg-white shadow rounded-md hover:bg-blue-50 transition cursor-pointer"
        @click="goToEdit(card.id)"
      >
        <div class="flex flex-col">
          <h2 class="text-md font-semibold text-gray-800 truncate">
            {{ card.title }}
          </h2>
          <p class="text-sm text-gray-500 truncate">
            {{ card.url }}
          </p>
        </div>
        <div
          class="w-8 h-8 rounded-full border border-gray-200"
          :style="{ backgroundColor: card.color || '#ccc' }"
        ></div>
      </li>
    </ul>

    <!-- 비어있을 때 -->
    <p v-else class="text-gray-500 text-center mt-10">저장된 카드가 없습니다.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

/** 🔹 카드 데이터 구조 */
interface CardItem {
  id: string;
  title: string;
  url: string;
  summary?: string;
  tags?: string[];
  color?: string;
  groupId?: string;
}

const router = useRouter();
const cards = ref<CardItem[]>([]);
const loading = ref(true);
const error = ref("");

/** 🔹 카드 데이터 로드 */
onMounted(() => {
  try {
    const stored = localStorage.getItem("linkCards");
    if (stored) {
      const parsed = JSON.parse(stored);
      cards.value = parsed.map((c: any, i: number) => ({
        id: c.id ?? String(i),
        title: c.title ?? "제목 없음",
        url: c.url ?? "",
        summary: c.summary ?? "",
        tags: c.tags ?? [],
        color: c.color ?? "#ccc",
        groupId: c.groupId ?? "default",
      }));
    } else {
      cards.value = [];
    }
  } catch (err) {
    console.error("카드 로드 오류:", err);
    error.value = "카드 데이터를 불러오지 못했습니다.";
  } finally {
    loading.value = false;
  }
});

/** 🔹 편집 페이지로 이동 */
function goToEdit(cardId: string) {
  const card = cards.value.find((c) => c.id === cardId);
  if (!card) return;
  router.push(`/edit/${card.groupId ?? "default"}/${cardId}`);
}
</script>