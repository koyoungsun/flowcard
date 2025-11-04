<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Card
      v-for="(card, index) in cards"
      :key="card.id || index"
      :card="card"
      :groupId="'default'"
      :cardIndex="index"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Card from "./Card.vue";

/** 🔹 카드 데이터 구조 정의 */
interface CardItem {
  id: string;
  title: string;
  url: string;
  summary?: string;
  tags?: string[];
  color?: string;
  favicon?: string;
}

/** 🔹 카드 리스트 상태 */
const cards = ref<CardItem[]>([]);

/** 🔹 로컬스토리지에서 카드 데이터 로드 */
onMounted(() => {
  const stored = localStorage.getItem("linkCards");
  const parsed = stored ? JSON.parse(stored) : [];

  // id 누락 시 자동 보정
  cards.value = parsed.map((c: any, i: number) => ({
    id: c.id ?? String(i),
    title: c.title ?? "제목 없음",
    url: c.url ?? "",
    summary: c.summary ?? "",
    tags: c.tags ?? [],
    color: c.color ?? "#ccc",
    favicon: c.favicon ?? "",
  }));
});
</script>