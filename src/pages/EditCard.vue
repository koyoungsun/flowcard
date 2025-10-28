<template>
  <div class="linkcard-setting p-6 bg-gray-50 min-h-screen">
    <h2 class="tit-link-set text-xl font-semibold mb-4">링크 카드 편집</h2>

    <form @submit.prevent="handleSave" class="space-y-4 bg-white p-5 rounded shadow-md">
      <div>
        <label class="block mb-1 text-sm font-medium">Card Title</label>
        <input
          v-model="form.title"
          type="text"
          class="card-name w-full border rounded px-3 py-2"
          placeholder="예: 나의 유튜브 채널"
          required
        />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Link URL</label>
        <input
          v-model="form.url"
          type="url"
          class="w-full border rounded px-3 py-2"
          placeholder="예: https://youtube.com/..."
          required
        />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Comment</label>
        <textarea
          v-model="form.summary"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 유튜브 채널 정리용 카드"
        ></textarea>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Tag</label>
        <input
          v-model="form.tagsInput"
          type="text"
          class="w-full border rounded px-3 py-2"
          placeholder="예: 유튜브,채널"
        />
      </div>

      <div class="btn-box space-y-2 mt-6">
        <button
          type="submit"
          class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded w-full font-medium transition"
        >
          수정 완료
        </button>

        <button
          type="button"
          @click="handleDelete"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full font-medium transition"
        >
          삭제
        </button>

        <button
          type="button"
          @click="router.push('/')"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded w-full font-medium transition"
        >
          취소
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
  tagsInput: "",
});

/** ✅ Firestore 데이터 불러오기 */
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
      tagsInput: (data.tags || []).join(", "),
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
  const tags = form.value.tagsInput
    ? form.value.tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

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
      tags,
      updatedAt: Date.now(),
    });

    toastRef.value?.show("카드가 수정되었습니다!");
    setTimeout(() => router.push("/"), 800);
  } catch (err: any) {
    console.error("🚫 수정 실패:", err);
    toastRef.value?.show(`수정 실패: ${err.message}`);
  }
}

/** ✅ 카드 삭제 */
async function handleDelete() {
  const confirmDelete = confirm("정말 이 카드를 삭제하시겠습니까?");
  if (!confirmDelete) return;

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
</script>