<template>
  <div class="linkcard-edit-wrap p-6 bg-gray-50 min-h-screen">
    <h2 class="tit text-xl font-semibold mb-4"><strong>링크 카드</strong> 수정</h2>

    <form @submit.prevent="handleSave" class="space-y-4 bg-white p-5 rounded shadow-md">
      <div class="input-form">
        <label class="block mb-1 text-sm font-medium"><em>*</em> 카드 제목</label>
        <input
          v-model="form.title"
          type="text"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 나의 유튜브 채널"
          required
        />
      </div>

      <div class="input-form">
        <label class="block mb-1 text-sm font-medium"><em>*</em> 링크 경로(URL)</label>
        <input
          v-model="form.url"
          type="url"
          class="w-full border rounded px-3 py-2"
          placeholder="예: https://youtube.com/..."
          required
        />
      </div>

      <div class="input-form">
        <label class="block mb-1 text-sm font-medium">간단한 설명</label>
        <textarea
          v-model="form.summary"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 유튜브 채널 정리용 카드"
          rows="3"
        ></textarea>
      </div>

      <!-- ✅ 하단 버튼 -->
      <div class="flex justify-between gap-3 pt-4 border-t mt-6 btn-combo">
        <button
          type="button"
          class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          @click="cancelEdit"
        >
          취소
        </button>

        <button
          type="submit"
          class="flex-1 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
        >
          수정 완료
        </button>

        <button
          type="button"
          @click="handleDelete"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition w-full max-w-xs"
        >
          카드 삭제
        </button>
      </div>
    </form>
    <ToastMessage ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import ToastMessage from "@/components/ToastMessage.vue";

const router = useRouter();
const route = useRoute();
const toastRef = ref();

const groupId = route.params.groupId as string;
const cardId = route.params.cardId as string;

const form = ref({
  title: "",
  url: "",
  summary: "",
});

/** ✅ 카드 불러오기 */
onMounted(async () => {
  try {
    const waitForAuth = await new Promise((resolve) => {
      const unsub = auth.onAuthStateChanged((user) => {
        if (user) resolve(user);
        unsub();
      });
    });

    const user = auth.currentUser;
    if (!user) {
      toastRef.value?.show("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    const refDoc = doc(db, "users", user.uid, "groups", groupId, "cards", cardId);
    const snap = await getDoc(refDoc);

    if (!snap.exists()) {
      toastRef.value?.show("존재하지 않는 카드입니다!");
      router.push("/");
      return;
    }

    const data = snap.data();
    form.value = {
      title: data.title || "",
      url: data.url || "",
      summary: data.summary || "",
    };
  } catch (err) {
    console.error("🚫 카드 불러오기 실패:", err);
    toastRef.value?.show("카드를 불러오는 중 오류가 발생했습니다.");
  }
});

/** ✅ 수정 저장 */
async function handleSave() {
  const user = auth.currentUser;
  if (!user) {
    toastRef.value?.show("로그인이 필요합니다.");
    return;
  }

  const title = form.value.title.trim();
  const url = form.value.url.trim();
  const summary = form.value.summary.trim();

  if (!title || !url) {
    toastRef.value?.show("필수 항목을 입력해주세요!");
    return;
  }

  try {
    const refDoc = doc(db, "users", user.uid, "groups", groupId, "cards", cardId);
    await updateDoc(refDoc, {
      title,
      url,
      summary,
      updatedAt: Date.now(),
    });

    toastRef.value?.show("카드가 수정되었습니다!");
    setTimeout(() => router.push("/"), 800);
  } catch (err: any) {
    console.error("🚫 수정 실패:", err);
    toastRef.value?.show(`수정 실패: ${err.message}`);
  }
}

/** ✅ 삭제 */
async function handleDelete() {
  if (!confirm("정말 이 카드를 삭제하시겠습니까?")) return;

  const user = auth.currentUser;
  if (!user) {
    toastRef.value?.show("로그인이 필요합니다.");
    return;
  }

  try {
    const refDoc = doc(db, "users", user.uid, "groups", groupId, "cards", cardId);
    await deleteDoc(refDoc);
    toastRef.value?.show("카드가 삭제되었습니다!");
    setTimeout(() => router.push("/"), 800);
  } catch (err: any) {
    console.error("🚫 삭제 실패:", err);
    toastRef.value?.show(`삭제 실패: ${err.message}`);
  }
}

/** ✅ 취소 (이전 페이지로 이동) */
function cancelEdit() {
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