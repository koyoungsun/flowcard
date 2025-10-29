<template>
  <article class="card-detail bg-white rounded-xl p-4 shadow-sm">
    <!-- 카드 제목 -->
    <h3 class="tit text-lg font-semibold flex items-center gap-1">
      <em class="text-gray-400 text-sm">{{ indexLabel }}</em>
      {{ card.title }}
    </h3>

    <!-- 링크 주소 -->
    <a class="link-url text-blue-500 text-sm break-all hover:underline"
       :href="card.url"
       target="_blank"
       rel="noopener noreferrer">
      {{ card.url }}
    </a>

    <!-- summary 있을 때만 노출 -->
    <p v-if="card.summary" class="summary text-gray-600 text-sm mt-1">
      {{ card.summary }}
    </p>
    <!-- 버튼 -->
    <div class="btn-box flex justify-end gap-2 mt-3">
      <button @click="openLink" class="btn-go text-blue-500 text-sm hover:underline">
        바로가기
      </button>
      <button @click="copyLink" class="btn-copy text-gray-500 text-sm hover:underline">
    복사
  </button>
      <button @click="editCard" class="btn-set text-indigo-500 text-sm hover:underline">
        편집
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const props = defineProps<{
  card: {
    id: string;
    title: string;
    url: string;
    summary?: string;
    tags?: string[];
  };
  groupId: string;      // ✅ Firestore 그룹 ID
  cardIndex?: number;   // (선택) UI 표시용 인덱스
}>();

const router = useRouter();

/** 🔹 링크 주소 복사 */
const copyLink = async () => {
  if (!props.card?.url) return;
  try {
    await navigator.clipboard.writeText(props.card.url);
    alert("링크가 복사되었습니다!"); // 나중에 Toast로 교체 가능
  } catch (err) {
    console.error("복사 실패:", err);
  }
};

// 카드 번호 표시용 (없으면 빈칸)
const indexLabel = props.cardIndex !== undefined ? props.cardIndex + 1 : "";

/** 🔹 외부 링크 열기 */
const openLink = () => {
  if (props.card.url) window.open(props.card.url, "_blank");
};

/** 🔹 Firestore 기반 편집 페이지 이동 */
const editCard = () => {
  if (!props.groupId || !props.card?.id) {
    console.warn("⚠️ groupId 또는 card.id 누락:", props.groupId, props.card?.id);
    return;
  }

  router.push({
    name: "EditCard",
    params: {
      groupId: props.groupId,
      cardId: props.card.id,
    },
  });
};
</script>

<style scoped>
.card-detail {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card-detail:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
}
.btn-go,
.btn-set {
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-go:hover,
.btn-set:hover {
  opacity: 0.8;
}
</style>