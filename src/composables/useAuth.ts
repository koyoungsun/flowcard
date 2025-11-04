// src/composables/useAuth.ts
import { ref } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";

const currentUser = ref<User | null>(auth.currentUser); // 초기값 즉시 반영

// 앱 시작 시 바로 감시 시작 (onMounted 필요 없음)
onAuthStateChanged(auth, (user) => {
  currentUser.value = user;
});

export function useAuth() {
  const logout = async () => {
    try {
      await signOut(auth);
      currentUser.value = null;
    } catch (err) {
      console.error(" 로그아웃 실패:", err);
    }
  };

  return {
    currentUser,
    logout,
  };
}

export { currentUser };