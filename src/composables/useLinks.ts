import { ref, onMounted } from "vue";
import { db, auth } from "@/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export function useLinks(groupId: string) {
  const links = ref<any[]>([]);
  const loading = ref(false);
  const uid = auth.currentUser?.uid;

  const linksRef = uid ? collection(db, "users", uid, "groups", groupId, "links") : null;

  // 🔹 데이터 불러오기
  const fetchLinks = async () => {
    if (!linksRef) return;
    loading.value = true;
    const snapshot = await getDocs(linksRef);
    links.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    loading.value = false;
  };

  // 🔹 링크 추가
  const addLink = async (newLink: any) => {
    if (!linksRef) return;
    await addDoc(linksRef, newLink);
    await fetchLinks();
  };

  // 🔹 링크 수정
  const updateLink = async (linkId: string, updates: any) => {
    if (!uid) return;
    const docRef = doc(db, "users", uid, "groups", groupId, "links", linkId);
    await updateDoc(docRef, updates);
    await fetchLinks();
  };

  // 🔹 링크 삭제
  const deleteLink = async (linkId: string) => {
    if (!uid) return;
    const docRef = doc(db, "users", uid, "groups", groupId, "links", linkId);
    await deleteDoc(docRef);
    links.value = links.value.filter((l) => l.id !== linkId);
  };

  onMounted(fetchLinks);

  return { links, loading, fetchLinks, addLink, updateLink, deleteLink };
}