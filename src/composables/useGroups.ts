import { ref, onMounted } from "vue";
import { db, auth } from "@/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";

/**
 * ✅ Firestore 그룹 관리 (Link Wallet 안정화 버전)
 * - users/{uid}/groups/{groupId}/cards 구조 지원
 * - Toast 기반 메시지 처리 및 세션 복원 강화
 */
export function useGroups(toastRef?: any) {
  const groups = ref<any[]>([]);
  const loading = ref(false);
  const router = useRouter();

  /** 🔹 그룹 + 카드 목록 불러오기 */
  const fetchGroups = async () => {
    const user = auth.currentUser;
    if (!user) {
      toastRef?.value?.show("로그인이 필요합니다. 다시 로그인해주세요.");
      router.push("/login");
      return;
    }

    loading.value = true;
    try {
      const groupsRef = collection(db, "users", user.uid, "groups");
      const q = query(groupsRef, orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);

      const groupList: any[] = [];

      // 각 그룹의 카드 하위 컬렉션 불러오기
      for (const groupDoc of snapshot.docs) {
        const groupData = { id: groupDoc.id, ...groupDoc.data() };

        const cardsRef = collection(
          db,
          "users",
          user.uid,
          "groups",
          groupDoc.id,
          "cards"
        );
        const cardsSnap = await getDocs(cardsRef);
        const cards = cardsSnap.docs.map((cardDoc) => ({
          id: cardDoc.id,
          ...cardDoc.data(),
        }));

        groupList.push({ ...groupData, cards });
      }

      groups.value = groupList;
      console.log("✅ 그룹 및 카드 불러오기 완료:", groups.value);
    } catch (err: any) {
      console.error("🚫 그룹 불러오기 실패:", err);
      toastRef?.value?.show("그룹 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      loading.value = false;
    }
  };

  /** 🔹 그룹 생성 */
  const createGroup = async (name: string) => {
    const user = auth.currentUser;
    if (!user) {
      toastRef?.value?.show("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      const groupsRef = collection(db, "users", user.uid, "groups");
      const newGroup = await addDoc(groupsRef, {
        groupName: name,
        createdAt: Date.now(),
      });

      toastRef?.value?.show("✨ 새 그룹이 추가되었습니다!");
      console.log("✅ 새 그룹 생성 완료:", newGroup.id);

      await fetchGroups();
    } catch (err: any) {
      console.error("🚫 그룹 생성 오류:", err);
      toastRef?.value?.show("그룹 생성 중 문제가 발생했습니다.");
    }
  };

  /** 🔹 그룹 삭제 */
  const deleteGroup = async (groupId: string) => {
    const user = auth.currentUser;
    if (!user) {
      toastRef?.value?.show("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      const groupRef = doc(db, "users", user.uid, "groups", groupId);
      await deleteDoc(groupRef);
      groups.value = groups.value.filter((g) => g.id !== groupId);
      toastRef?.value?.show("🗑️ 그룹이 삭제되었습니다.");
      console.log("✅ 그룹 삭제 완료:", groupId);
    } catch (err: any) {
      console.error("🚫 그룹 삭제 오류:", err);
      toastRef?.value?.show("그룹 삭제 중 오류가 발생했습니다.");
    }
  };

  /** ✅ 로그인 감지 후 자동 fetch */
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

  return {
    groups,
    loading,
    fetchGroups,
    createGroup,
    deleteGroup,
  };
}