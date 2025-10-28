import { ref, getCurrentInstance, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "@/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

/**
 * ✅ Link 카드 관련 Firestore 연동 로직 (실시간 동기화)
 * - 로컬 반영 → Firestore 저장 → 실시간 갱신 자동 반영
 * - 에러 및 세션 만료는 Toast 기반으로 표시
 */
export function useLinks(groupId: string, toastRef?: any) {
  const links = ref<any[]>([]);
  let unsubscribe: (() => void) | null = null;
  const router = useRouter();

  /** 🔹 실시간 구독 시작 */
  async function fetchLinks() {
    const user = auth.currentUser;
    if (!user) {
      toastRef?.value?.show("로그인이 필요합니다. 다시 로그인해주세요.");
      router.push("/login");
      return;
    }

    try {
      const q = query(
        collection(db, "users", user.uid, "groups", groupId, "cards"),
        orderBy("createdAt", "asc")
      );

      if (unsubscribe) unsubscribe();
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          links.value = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          console.log(`📡 그룹(${groupId}) → 카드 ${links.value.length}개 로드됨`);
        },
        (err) => {
          console.error("🚫 실시간 구독 오류:", err);
          toastRef?.value?.show("데이터 실시간 갱신 중 오류가 발생했습니다.");
        }
      );
    } catch (err) {
      console.error("🚫 Firestore 구독 실패:", err);
      toastRef?.value?.show("링크 데이터를 불러오는 중 문제가 발생했습니다.");
    }
  }

  /** 🔹 링크 추가 (로컬 즉시 반영 + Firestore 저장) */
  async function addLink(data: any) {
    const user = auth.currentUser;
    if (!user) {
      toastRef?.value?.show("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      const refCol = collection(db, "users", user.uid, "groups", groupId, "cards");

      // 1️⃣ 로컬 반영
      const tempCard = {
        ...data,
        id: `temp-${Date.now()}`,
        createdAt: Date.now(),
        _temp: true,
      };
      links.value.push(tempCard);

      // 2️⃣ Firestore 저장
      await addDoc(refCol, {
        ...data,
        createdAt: Date.now(),
        serverCreatedAt: serverTimestamp(),
      });

      toastRef?.value?.show("✅ 링크가 추가되었습니다!");
    } catch (err: any) {
      console.error("🚫 링크 추가 실패:", err);
      toastRef?.value?.show("링크 추가 중 오류가 발생했습니다.");
    }
  }

  /** 🔹 링크 삭제 */
  async function deleteLink(id: string) {
    const user = auth.currentUser;
    if (!user) {
      toastRef?.value?.show("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      await deleteDoc(doc(db, "users", user.uid, "groups", groupId, "cards", id));
      toastRef?.value?.show("🗑️ 링크가 삭제되었습니다.");
    } catch (err) {
      console.error("🚫 링크 삭제 실패:", err);
      toastRef?.value?.show("링크 삭제 중 오류가 발생했습니다.");
    }
  }

  /** 🔹 컴포넌트 해제 시 구독 정리 */
  const vm = getCurrentInstance();
  if (vm) {
    onUnmounted(() => {
      if (unsubscribe) unsubscribe();
    });
  }

  return {
    links,
    fetchLinks,
    addLink,
    deleteLink,
  };
}