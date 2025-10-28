<template>
  <div class="linkcard-add-wrap p-6 min-h-screen bg-gray-50">
    <h2 class="tit text-xl font-semibold mb-4">🔗 링크카드 추가</h2>

    <form @submit.prevent="handleAddCard" class="space-y-4 bg-white p-5 rounded shadow-md">
      <div class="body-tit">
        <label class="block mb-1 text-sm font-medium"><em>*</em> 카드 제목</label>
        <input
          v-model="form.title"
          type="text"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 나의 구글 드라이브"
          required
        />
      </div>

      <div class="body-link">
        <label class="block mb-1 text-sm font-medium"><em>*</em> 링크 경로(URL)</label>
        <input
          v-model="form.url"
          type="url"
          class="w-full border rounded px-3 py-2"
          placeholder="예: https://drive.google.com"
          required
        />
      </div>

      <div class="body-summary">
        <label class="block mb-1 text-sm font-medium"><em>*</em> 간단한 설명</label>
        <textarea
          v-model="form.summary"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 구글 드라이브 바로가기"
          rows="3"
        ></textarea>
      </div>

      <div class="body-hash">
        <label class="block mb-1 text-sm font-medium">태그</label>
        <input
          v-model="form.tagsInput"
          type="text"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 클라우드,구글"
        />
        <p class="text-xs text-gray-500 mt-1">쉼표로 구분해서 입력할 수 있습니다.</p>
      </div>

      <button
        type="submit"
        class="btn-create bg-indigo-500 text-white px-4 py-2 rounded w-full hover:bg-indigo-600 transition"
      >
        저장
      </button>
    </form>

    <!-- ✅ ToastMessage 컴포넌트 추가 -->
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

// ✅ groupIndex → groupId 로 수정 (라우터 파라미터 통일)
const groupId = route.params.groupId as string;

// ✅ Firestore 링크 훅
const { links, addLink, fetchLinks } = useLinks(groupId);

// ✅ ToastMessage
const toastRef = ref();

const form = ref({
  title: "",
  url: "",
  summary: "",
  tagsInput: "",
});

async function handleAddCard() {
  const title = form.value.title.trim();
  const url = form.value.url.trim();
  const summary = form.value.summary.trim();
  const tags = form.value.tagsInput
    ? form.value.tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  if (!title || !url) {
    toastRef.value?.show("필수 항목을 입력해주세요!");
    return;
  }

  // 🔸 Firestore 중복 검사
  await fetchLinks();
  const isDuplicate = links.value.some((card) => card.url === url);
  if (isDuplicate) {
    toastRef.value?.show("이미 등록된 링크입니다!");
    return;
  }

  try {
    await addLink({
      title,
      url,
      summary,
      tags,
      createdAt: Date.now(),
    });

    toastRef.value?.show("카드가 추가되었습니다!");
    // ✅ router.go(0) 제거 → 실시간 구독으로 자동 반영됨
    setTimeout(() => router.push("/"), 1000);
  } catch (err: any) {
    console.error("🚫 링크 추가 실패:", err);
    toastRef.value?.show(`추가 실패: ${err.message}`);
  }
}
</script>

<style scoped>
.tit em {
  color: #ef4444;
  margin-right: 4px;
}
.btn-create {
  transition: all 0.2s ease;
}
.btn-create:hover {
  transform: translateY(-1px);
}
</style>