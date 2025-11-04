import { ref, onMounted, onUnmounted } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "vue-router";

/**
 * Firebase Auth 세션 감시 composable (최신 안정화 버전)
 * - 로그인 / 로그아웃 / 세션 만료 자동 감지
 * - Firestore 실시간 구독(onSnapshot) 정리 포함
 * - toastRef 연결 시 UI 알림 표시
 */
export function useAuthWatcher(toastRef?: any) {
  const user = ref(auth.currentUser);
  const isAuthenticated = ref(!!auth.currentUser);
  const router = useRouter();

  let unsubscribeAuth: (() => void) | null = null;

  /** 🔹 실시간 로그인 상태 감시 */
  const initAuthListener = () => {
    unsubscribeAuth = onAuthStateChanged(auth, async (newUser) => {
      user.value = newUser;
      isAuthenticated.value = !!newUser;

      if (!newUser) {
        console.warn(" 세션이 만료되었거나 로그아웃됨");

        // Firestore 구독 해제 (전역 등록된 모든 onSnapshot 해제)
        if (window.__unsubscribeAll__) {
          try {
            window.__unsubscribeAll__();
            console.log("🧹 Firestore 실시간 구독 정리 완료");
          } catch (err) {
            console.error("⚠️ 구독 정리 중 오류:", err);
          }
        }

        toastRef?.value?.show?.("세션이 만료되었습니다. 다시 로그인해주세요.");
        await router.push("/login");
      } else {
        console.log("👤 로그인 유지됨:", newUser.uid);
      }
    });
  };

  /** 🔹 수동 로그아웃 */
  const manualSignOut = async () => {
    try {
      // 모든 Firestore 실시간 구독 강제 해제
      if (window.__unsubscribeAll__) {
        try {
          window.__unsubscribeAll__();
          console.log("🧹 로그아웃 전 Firestore 구독 정리 완료");
        } catch (err) {
          console.warn("⚠️ 구독 정리 중 예외:", err);
        }
      }

      await signOut(auth);
      toastRef?.value?.show?.("정상적으로 로그아웃되었습니다.");
      await router.push("/login");
    } catch (err: any) {
      console.error(" 로그아웃 실패:", err);
      toastRef?.value?.show?.("로그아웃 중 오류가 발생했습니다.");
    }
  };

  /** 🔹 리스너 등록 / 해제 */
  onMounted(() => initAuthListener());
  onUnmounted(() => unsubscribeAuth && unsubscribeAuth());

  return { user, isAuthenticated, manualSignOut };
}