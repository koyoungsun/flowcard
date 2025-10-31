<template>
  <div class="linkcard-add-wrap p-6 min-h-screen bg-gray-50">
    <h2 class="tit text-xl font-semibold mb-4"><strong>링크카드</strong > 추가</h2>

    <form @submit.prevent="handleAddCard" class="space-y-4 bg-white p-5 rounded shadow-md">
      <div class="body-tit input-form">
        <label class="block mb-1 text-sm font-medium"><em>*</em> 카드 제목</label>
        <input
          v-model="form.title"
          type="text"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 나의 구글 드라이브"
          required
        />
      </div>

      <div class="body-link input-form">
        <label class="block mb-1 text-sm font-medium"><em>*</em> 링크 경로(URL)</label>
        <input
          v-model="form.url"
          type="url"
          class="w-full border rounded px-3 py-2"
          placeholder="예: https://drive.google.com"
          required
        />
      </div>

      <div class="body-summary input-form">
        <label class="block mb-1 text-sm font-medium"><em>*</em> 간단한 설명</label>
        <textarea
          v-model="form.summary"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 구글 드라이브 바로가기"
          rows="3"
        ></textarea>
      </div>

      <!-- ✅ 하단 버튼 2개 (취소 / 저장) -->
      <div class="btn-combo flex justify-between gap-3 pt-4 border-t mt-6">
        <button
          type="button"
          class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          @click="cancelAdd"
        >
          취소
        </button>

        <button
          type="submit"
          class="flex-1 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
        >
          저장
        </button>
      </div>
    </form>

    <!-- ✅ ToastMessage -->
    <ToastMessage ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useLinks } from "@/composables/useLinks";
import ToastMessage from "@/components/ToastMessage.vue";

const router = useRouter();
const route = useRoute();
const groupId = route.params.groupId as string;

const { links, addLink, fetchLinks } = useLinks(groupId);
const toastRef = ref();

const form = ref({
  title: "",
  url: "",
  summary: "",
});

/* ✅ 저장 */
async function handleAddCard() {
  const title = form.value.title.trim();
  const url = form.value.url.trim();
  const summary = form.value.summary.trim();

  if (!title || !url) {
    toastRef.value?.show("필수 항목을 입력해주세요!");
    return;
  }

  await fetchLinks();
  const isDuplicate = links.value.some((card) => card.url === url);
  if (isDuplicate) {
    toastRef.value?.show("이미 등록된 링크입니다!");
    return;
  }

  try {
    await addLink({ title, url, summary, createdAt: Date.now() });
    toastRef.value?.show("카드가 추가되었습니다!");
    setTimeout(() => router.push("/"), 1000);
  } catch (err: any) {
    console.error("🚫 링크 추가 실패:", err);
    toastRef.value?.show(`추가 실패: ${err.message}`);
  }
}

/* ✅ 취소 (이전 페이지로 이동) */
function cancelAdd() {
  router.back();
}
</script>

<style scoped>
.tit em {
  color: #ef4444;
  margin-right: 4px;
}

button {
  transition: all 0.2s ease;
}
button:hover {
  transform: translateY(-1px);
}
</style>