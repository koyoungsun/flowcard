import { ref, onMounted, onUnmounted } from "vue";
import { db, auth } from "@/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";

/**
 * ✅ Firestore 그룹 관리 (Silent Logout 안정화 버전)
 * - users/{uid}/groups/{groupId}/cards 구조 지원
 * - 실시간 동기화 및 세션 만료 시 자동 정리
 * - toastRef 연동 (선택)
 */
export function useGroups(toastRef?: any) {
  const groups = ref<any[]>([]);
  const loading = ref(false);
  const router = useRouter();

  let unsubscribe: (() => void) | null = null;

  /** 🔹 실시간 그룹 + 카드 목록 구독 */
  const fetchGroups = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("🚫 로그인 필요 - 그룹 데이터 불러오기 중단");
      toastRef?.value?.show?.("로그인이 필요합니다. 다시 로그인해주세요.");
      return;
    }

    loading.value = true;

    try {
      const q = query(collection(db, "users", user.uid, "groups"), orderBy("createdAt", "asc"));

      // 중복 구독 방지
      if (unsubscribe) unsubscribe();

      unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          if (!auth.currentUser) return;

          const groupList: any[] = [];
          for (const groupDoc of snapshot.docs) {
            const groupData = { id: groupDoc.id, ...groupDoc.data() };

            // 카드 하위 컬렉션 로드
            const cardsSnap = await getDocs(
              collection(db, "users", user.uid, "groups", groupDoc.id, "cards")
            );
            const cards = cardsSnap.docs.map((c) => ({ id: c.id, ...c.data() }));

            groupList.push({ ...groupData, cards });
          }

          groups.value = groupList;
          console.log("✅ 그룹 및 카드 불러오기 완료:", groups.value);
        },
        (err) => {
          if (err.code === "permission-denied") {
            console.warn("🚫 Firestore 권한 오류 (로그아웃 중) → 무시됨");
            return;
          }
          console.error("🚫 그룹 실시간 구독 오류:", err);
          toastRef?.value?.show?.("그룹 데이터를 불러오는 중 오류가 발생했습니다.");
        }
      );

      /** 🔸 전역 구독 해제 핸들러 등록 */
      if (!window.__unsubscribeAll__) window.__unsubscribeAll__ = () => {};
      const oldUnsub = window.__unsubscribeAll__;
      window.__unsubscribeAll__ = () => {
        try {
          if (unsubscribe) {
            unsubscribe();
            console.log("🧹 그룹 실시간 구독 해제됨");
          }
        } catch (e) {
          console.warn("⚠️ 그룹 구독 해제 중 예외:", e);
        }
        oldUnsub();
      };
    } catch (err: any) {
      console.error("🚫 그룹 구독 실패:", err);
      toastRef?.value?.show?.("그룹 데이터를 불러오는 중 문제가 발생했습니다.");
    } finally {
      loading.value = false;
    }
  };

  /** 🔹 그룹 생성 */
  const createGroup = async (name: string) => {
    const user = auth.currentUser;
    if (!user) {
      toastRef?.value?.show?.("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      const groupsRef = collection(db, "users", user.uid, "groups");
      const newGroup = await addDoc(groupsRef, {
        groupName: name,
        createdAt: Date.now(),
      });

      toastRef?.value?.show?.("✨ 새 그룹이 추가되었습니다!");
      console.log("✅ 새 그룹 생성 완료:", newGroup.id);
    } catch (err: any) {
      console.error("🚫 그룹 생성 오류:", err);
      toastRef?.value?.show?.("그룹 생성 중 문제가 발생했습니다.");
    }
  };

  /** 🔹 그룹 삭제 */
  const deleteGroup = async (groupId: string) => {
    const user = auth.currentUser;
    if (!user) {
      toastRef?.value?.show?.("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      const groupRef = doc(db, "users", user.uid, "groups", groupId);
      await deleteDoc(groupRef);
      groups.value = groups.value.filter((g) => g.id !== groupId);
      toastRef?.value?.show?.("🗑️ 그룹이 삭제되었습니다.");
      console.log("✅ 그룹 삭제 완료:", groupId);
    } catch (err: any) {
      console.error("🚫 그룹 삭제 오류:", err);
      toastRef?.value?.show?.("그룹 삭제 중 오류가 발생했습니다.");
    }
  };

  /** 🔹 로그인 상태 감시 */
  onMounted(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("👤 로그인 감지됨:", user.uid);
        fetchGroups();
      } else {
        console.warn("🚫 로그아웃 상태, 그룹 불러오기 중단");
      }
    });
  });

  /** 🔹 컴포넌트 해제 시 구독 정리 */
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
      console.log("🧹 그룹 구독 해제됨 (언마운트)");
    }
  });

  return {
    groups,
    loading,
    fetchGroups,
    createGroup,
    deleteGroup,
  };
}