// src/composables/useLinks.ts
import { ref, getCurrentInstance, onUnmounted } from "vue";
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
 * Link 카드 Firestore 연동 + 파비콘 자동 추가 (404 fallback)
 * - 실시간 구독, 추가/삭제, 로컬 반영
 * - 각 링크에 favicon 필드 자동 생성 (Google API → 실패 시 /favicon.ico)
 */
export function useLinks(groupId: string, toastRef?: any) {
  const links = ref<any[]>([]);
  let unsubscribe: (() => void) | null = null;

  /** 🔹 파비콘 URL 생성 함수 */
  function getFavicon(url: string): string {
    try {
      return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=${url}&size=64`;
    } catch {
      return "/favicon.ico"; // 실패 시 기본 아이콘
    }
  }

  /** 🔹 실시간 구독 시작 */
  async function fetchLinks() {
    const user = auth.currentUser;
    if (!user) {
      console.warn("로그인 필요 - 링크 데이터를 불러오지 않음");
      toastRef?.value?.show?.("로그인이 필요합니다. 다시 로그인해주세요.");
      return;
    }

    try {
      const q = query(
        collection(db, "users", user.uid, "groups", groupId, "cards"),
        orderBy("createdAt", "asc")
      );

      // 기존 구독 해제
      if (unsubscribe) unsubscribe();

      // 새 구독 시작
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!auth.currentUser) return;

          links.value = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              favicon: getFavicon(data.url || ""), // ✅ favicon 자동추가
            };
          });

          console.log(`📡 그룹(${groupId}) → 카드 ${links.value.length}개 로드됨`);
        },
        (err) => {
          if (err.code === "permission-denied") {
            console.warn("Firestore 권한 오류 (로그아웃 중) → 무시됨");
            return;
          }
          console.error("실시간 구독 오류:", err);
          toastRef?.value?.show?.("데이터 실시간 갱신 중 오류가 발생했습니다.");
        }
      );

      /** 🔸 전역 구독 해제 핸들러 */
      if (!window.__unsubscribeAll__) window.__unsubscribeAll__ = () => {};
      const oldUnsub = window.__unsubscribeAll__;
      window.__unsubscribeAll__ = () => {
        try {
          if (unsubscribe) {
            unsubscribe();
            console.log(`🧹 그룹(${groupId}) 실시간 구독 해제됨`);
          }
        } catch (e) {
          console.warn("⚠️ 구독 해제 중 예외:", e);
        }
        oldUnsub();
      };
    } catch (err) {
      console.error("Firestore 구독 실패:", err);
      toastRef?.value?.show?.("링크 데이터를 불러오는 중 문제가 발생했습니다.");
    }
  }

  /** 🔹 링크 추가 (로컬 반영 + Firestore 저장) */
  async function addLink(data: any) {
    const user = auth.currentUser;
    if (!user) {
      toastRef?.value?.show?.("로그인이 필요합니다.");
      return;
    }

    try {
      const refCol = collection(db, "users", user.uid, "groups", groupId, "cards");

      // 1️⃣ 로컬 반영 (임시 카드)
      const tempCard = {
        ...data,
        id: `temp-${Date.now()}`,
        createdAt: Date.now(),
        favicon: getFavicon(data.url || ""),
        _temp: true,
      };
      links.value.push(tempCard);

      // 2️⃣ Firestore 저장
      await addDoc(refCol, {
        ...data,
        createdAt: Date.now(),
        serverCreatedAt: serverTimestamp(),
      });

      toastRef?.value?.show?.("링크가 추가되었습니다!");
    } catch (err: any) {
      console.error("링크 추가 실패:", err);
      toastRef?.value?.show?.("링크 추가 중 오류가 발생했습니다.");
    }
  }

  /** 🔹 링크 삭제 */
  async function deleteLink(id: string) {
    const user = auth.currentUser;
    if (!user) {
      toastRef?.value?.show?.("로그인이 필요합니다.");
      return;
    }

    try {
      await deleteDoc(doc(db, "users", user.uid, "groups", groupId, "cards", id));
      toastRef?.value?.show?.("링크가 삭제되었습니다.");
    } catch (err) {
      console.error("링크 삭제 실패:", err);
      toastRef?.value?.show?.("링크 삭제 중 오류가 발생했습니다.");
    }
  }

  /** 🔹 언마운트 시 구독 정리 */
  const vm = getCurrentInstance();
  if (vm) {
    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
        console.log(`🧹 그룹(${groupId}) 구독 해제됨 (컴포넌트 언마운트)`);
      }
    });
  }

  return {
    links,
    fetchLinks,
    addLink,
    deleteLink,
  };
}