import { ref, onMounted, onUnmounted } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "vue-router";

/**
 * ✅ 로그인 세션 감시 composable
 * - 실시간 Firebase Auth 상태 감시
 * - 세션 만료 또는 로그아웃 시 자동 리디렉션
 * - toastRef가 있으면 사용자에게 알림
 */
export function useAuthWatcher(toastRef?: any) {
  const user = ref(auth.currentUser);
  const isAuthenticated = ref(!!auth.currentUser);
  const router = useRouter();

  let unsubscribe: (() => void) | null = null;

  const initAuthListener = () => {
    unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      user.value = newUser;
      isAuthenticated.value = !!newUser;

      if (!newUser) {
        console.warn("🚫 세션이 만료되었거나 로그아웃됨");
        toastRef?.value?.show("세션이 만료되었습니다. 다시 로그인해주세요.");
        await router.push("/login");
      } else {
        console.log("👤 로그인 유지됨:", newUser.uid);
      }
    });
  };

  const manualSignOut = async () => {
    try {
      await signOut(auth);
      toastRef?.value?.show("정상적으로 로그아웃되었습니다.");
      await router.push("/login");
    } catch (err: any) {
      console.error("🚫 로그아웃 실패:", err);
      toastRef?.value?.show("로그아웃 중 오류가 발생했습니다.");
    }
  };

  onMounted(() => initAuthListener());
  onUnmounted(() => unsubscribe && unsubscribe());

  return { user, isAuthenticated, manualSignOut };
}