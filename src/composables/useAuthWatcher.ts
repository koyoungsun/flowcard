import { ref, onMounted, onUnmounted, computed } from "vue";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "vue-router";

export function useAuthWatcher(toastRef?: any) {
  const user = ref<User | null>(auth.currentUser);
  const isAuthenticated = ref(!!auth.currentUser);
  const router = useRouter();
  let unsubscribeAuth: (() => void) | null = null;

  const initAuthListener = () => {
    unsubscribeAuth = onAuthStateChanged(auth, async (newUser) => {
      user.value = newUser;
      isAuthenticated.value = !!newUser;

      if (!newUser) {
        if (typeof window !== "undefined" && window.__unsubscribeAll__) {
          try {
            window.__unsubscribeAll__();
          } catch {}
        }
        toastRef?.value?.show?.("세션이 만료되었습니다. 다시 로그인해주세요.");
        await router.push("/login");
      }
    });
  };

  const manualSignOut = async () => {
    try {
      if (typeof window !== "undefined" && window.__unsubscribeAll__) {
        try {
          window.__unsubscribeAll__();
        } catch {}
      }
      await signOut(auth);
      toastRef?.value?.show?.("정상적으로 로그아웃되었습니다.");
      await router.push("/login");
    } catch {
      toastRef?.value?.show?.("로그아웃 중 오류가 발생했습니다.");
    }
  };

  onMounted(initAuthListener);
  onUnmounted(() => {
    if (unsubscribeAuth) {
      unsubscribeAuth();
      unsubscribeAuth = null;
    }
  });

  const displayName = computed(() => user.value?.displayName ?? "");
  const email = computed(() => user.value?.email ?? "");
  const photoURL = computed(() => {
    const url = user.value?.photoURL;
    return url && !url.includes("accounts.google.com/transparent")
      ? url
      : "/default-avatar.png";
  });

  return {
    user,
    isAuthenticated,
    manualSignOut,
    displayName,
    email,
    photoURL,
  };
}