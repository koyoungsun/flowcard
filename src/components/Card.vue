<template>
  <article
    class="card-detail rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
    :style="{ backgroundColor: bgColor }"
  >
    <!-- 카드 제목 -->
    <h3 class="tit text-lg font-semibold flex items-center gap-1 text-gray-800">
      {{ card.title }}
    </h3>

    <!-- summary 있을 때만 노출 -->
    <p v-if="card.summary" class="summary text-gray-700 text-sm mt-1 leading-snug">
      {{ card.summary }}
    </p>

    <!-- 버튼 -->
    <div class="btn-box flex justify-end gap-3 mt-4">
      <button
        @click.stop="openLink"
        class="btn-go text-sm text-blue-600 hover:underline transition-colors"
      >
        바로가기
      </button>

      <button
        @click.stop="copyLink"
        class="btn-copy text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors"
      >
        복사
      </button>

      <button
        @click.stop="editCard"
        class="btn-set text-sm text-indigo-600 hover:underline transition-colors"
      >
        편집
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

/** 🔹 Props */
const props = defineProps<{
  card: {
    id: string;
    title: string;
    url: string;
    summary?: string;
    tags?: string[];
    color?: string; // 선택: 저장된 색상 있을 경우 우선 적용
  };
  groupId: string;
  cardIndex?: number;
}>();

const router = useRouter();

/** 🔹 랜덤 파스텔 컬러 생성 함수 */
const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.random() * 10; // 70~80%
  const lightness = 85 + Math.random() * 10; // 85~95%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/** 🔹 배경색 지정 (저장된 색상 > 랜덤색 순서) */
const bgColor = ref<string>("#f9fafb"); // fallback 기본색
onMounted(() => {
  bgColor.value = props.card.color || getRandomPastelColor();
});

/** 🔹 링크 복사 */
const copyLink = async () => {
  if (!props.card?.url) return;
  try {
    await navigator.clipboard.writeText(props.card.url);
    alert("링크가 복사되었습니다!");
  } catch (err) {
    console.error("복사 실패:", err);
  }
};

/** 🔹 외부 링크 열기 */
const openLink = () => {
  if (props.card.url) window.open(props.card.url, "_blank");
};

/** 🔹 편집 페이지 이동 */
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
  backdrop-filter: blur(4px);
  transform-origin: center;
}
</style>