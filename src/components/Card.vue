<template>
  <article
    class="card-detail rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-white/90"
  >
    <!-- 카드 헤더 (파비콘 + 제목) -->
    <div class="flex items-center gap-2 mb-2">
      <img
        v-if="card.url"
        :src="faviconSrc"
        alt="favicon"
        class="w-5 h-5 rounded-sm border border-gray-200 ico-bi"
      />
      <h3 class="tit text-lg font-semibold text-gray-800 truncate">
        {{ card.title }}
      </h3>
    </div>

    <!-- summary 있을 때만 노출 -->
    <p
      v-if="card.summary"
      class="summary text-gray-700 text-sm mt-1 leading-snug line-clamp-2"
    >
      {{ card.summary }}
    </p>

    <!-- 버튼 -->
    <div class="btn-box flex justify-end gap-3 mt-4">
      <button
        @click.stop="editCard"
        class="btn-set text-sm text-indigo-600 hover:underline transition-colors"
      >
        편집
      </button>

      <button
        @click.stop="copyLink"
        class="btn-copy text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors"
      >
        복사
      </button>

      <button
        @click.stop="openLink"
        class="btn-go text-sm text-blue-600 hover:underline transition-colors"
      >
        바로가기
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
    color?: string;
    favicon?: string;
  };
  groupId: string;
  cardIndex?: number;
}>();

const router = useRouter();
const faviconSrc = ref("/favicon.ico");

/** 🔹 favicon 자동 처리 (CORS 안전 / 직접 로드 방식) */
function updateFavicon() {
  if (!props.card?.url) return;

  // 도메인 정리
  const cleanDomain = props.card.url
    .replace(/^https?:\/\//, "")
    .replace(/^m\./, "")
    .split("/")[0];

  const googleFavicon = `https://www.google.com/s2/favicons?sz=64&domain=${cleanDomain}`;
  const directFavicon = `https://${cleanDomain}/favicon.ico`;

  // 1️⃣ Google favicon 먼저 시도
  const googleImg = new Image();
  googleImg.onload = () => {
    // 이미지 크기가 1×1이면 실패 간주
    if (googleImg.width <= 1 && googleImg.height <= 1) {
      tryDirectFavicon();
    } else {
      faviconSrc.value = googleFavicon;
    }
  };
  googleImg.onerror = tryDirectFavicon;
  googleImg.src = googleFavicon;

  // 2️⃣ 직접 도메인 favicon 시도
  function tryDirectFavicon() {
    const directImg = new Image();
    directImg.onload = () => {
      if (directImg.width <= 1 && directImg.height <= 1) {
        faviconSrc.value = "/favicon.ico";
      } else {
        faviconSrc.value = directFavicon;
      }
    };
    directImg.onerror = () => (faviconSrc.value = "/favicon.ico");
    directImg.src = directFavicon;
  }
}

onMounted(updateFavicon);

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
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card-detail:hover {
  transform: translateY(-2px);
}
.summary {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>