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

/**
 * Firestore 그룹 관리 훅
 * - 로그인된 사용자별로 그룹 데이터를 분리 저장
 * - groups 컬렉션 내부에 groupName, createdAt 필드 포함
 */
export function useGroups() {
  const groups = ref<any[]>([]);
  const loading = ref(false);

  /** 🔹 그룹 목록 불러오기 */
  const fetchGroups = async () => {
    const user = auth.currentUser;
    if (!user) return;
    loading.value = true;

    try {
      const groupsRef = collection(db, "users", user.uid, "groups");
      const q = query(groupsRef, orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);

      groups.value = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        cards: [], // 카드 데이터는 별도로 fetch 예정
      }));
    } catch (e) {
      console.error("🔥 그룹 불러오기 오류:", e);
    } finally {
      loading.value = false;
    }
  };

  /** 🔹 그룹 생성 */
  const createGroup = async (name: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const groupsRef = collection(db, "users", user.uid, "groups");
      await addDoc(groupsRef, {
        groupName: name,
        createdAt: Date.now(),
      });
      await fetchGroups();
    } catch (e) {
      console.error("🔥 그룹 생성 오류:", e);
    }
  };

  /** 🔹 그룹 삭제 */
  const deleteGroup = async (groupId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const groupRef = doc(db, "users", user.uid, "groups", groupId);
      await deleteDoc(groupRef);
      groups.value = groups.value.filter((g) => g.id !== groupId);
    } catch (e) {
      console.error("🔥 그룹 삭제 오류:", e);
    }
  };

  onMounted(fetchGroups);

  return {
    groups,
    loading,
    fetchGroups,
    createGroup,
    deleteGroup,
  };
}