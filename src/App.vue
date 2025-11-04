<template>
  <div id="app" class="container">
    <!--  로딩 오버레이 -->
    <div
      v-if="!isAppReady"
      class="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]"
    >
      <h1 class="text-2xl font-bold text-indigo-600 mb-4">LINKNEST</h1>
      <div class="loader"></div>
    </div>

    <!--  앱 본문 -->
    <div v-else>
      <!-- 전역 로딩바 -->
      <transition name="fade">
        <div
          v-if="isPageLoading"
          class="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300 animate-pulse z-[9998]"
        ></div>
      </transition>

      <HeaderBar
        v-if="isLoggedIn && !$route.meta.hideHeader"
        :user="currentUser"
        @toggleNav="showNav = !showNav"
        @openGuide="showInfoModal = true"
      />

      <ToastNav
        v-if="isLoggedIn && !$route.meta.hideHeader"
        :isOpen="showNav"
        :user="currentUser"
        :groupCount="groupCount"
        :linkCount="linkCount"
        @close="showNav = false"
        @go="handleNavGo"
        @viewModeChanged="onViewModeChanged"
        @logout="handleLogout"
      />

      <router-view :key="viewMode" :viewMode="viewMode" />

      <div
        v-if="isLoggedIn && !$route.meta.noHeader && showInfoModal"
        class="fixed inset-0 bg-black/50 z-[9997] flex items-center justify-center"
        @click.self="showInfoModal = false"
      >
        <div class="bg-white rounded-xl shadow-lg p-6 w-80 text-center relative modal-pop">
          
          <div class="cont">
            <button
            class="absolute top-2 right-3 text-gray-400 text-xl hover:text-gray-600 btn-close"
            @click="showInfoModal = false"
          >
            <i class="bi bi-x-lg"></i>
          </button>
            <h2 class="text-lg font-semibold mb-4">LINK NEST란?</h2>
            <em></em>
            <h3>
              자주 쓰는 링크 보기 쉽게 정리!<br />
              클릭 한 번으로 바로 실행!!<br />
              <strong>나만의 기억을 담은 링크리스트.</strong>
            </h3>
            <p class="text-sm text-gray-500 mt-2">
              복잡한 북마크 폴더를 차지 말고,<br />
              내 선택그룹에서 바로 실행하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import HeaderBar from "@/components/HeaderBar.vue";
import ToastNav from "@/components/ToastNav.vue";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useGroups } from "@/composables/useGroups";
import { isPageLoading } from "@/router";

const router = useRouter();
const auth = getAuth();

// 특정 경로에서 헤더 숨김
const hideHeader = computed(() => route.path === "/policy");

const showNav = ref(false);
const showInfoModal = ref(false);
const currentUser = ref<any>(null);

/* 로딩 상태 */
const firebaseReady = ref(false);
const groupsReady = ref(false);
const isAppReady = computed(() => firebaseReady.value && groupsReady.value);

/* 로그인 여부 */
const isLoggedIn = computed(() => !!currentUser.value);

/* 보기 모드 */
const viewMode = ref(localStorage.getItem("defaultViewMode") || "card");
function onViewModeChanged(newMode: string) {
  viewMode.value = newMode;
  localStorage.setItem("defaultViewMode", newMode);
}

/* 그룹 데이터 */
const { groups, fetchGroups } = useGroups();
onMounted(async () => {
  await fetchGroups();
  groupsReady.value = true; // ✅ Firestore 데이터까지 준비 완료
});

/* Firebase 상태 감시 */
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
    firebaseReady.value = true; // ✅ Firebase 상태 준비 완료
  });
});

/* 그룹 / 링크 수 */
const groupCount = computed(() => groups.value.length);
const linkCount = computed(() =>
  groups.value.reduce(
    (total, group) => total + ((group.cards && group.cards.length) || 0),
    0
  )
);

/* 로그아웃 */
async function handleLogout() {
  await signOut(auth);
  showNav.value = false;
  router.replace("/");
}

/* 네비게이션 이동 */
function handleNavGo(target: string) {
  showNav.value = false;
  if (target === "home") router.push("/home");
  else if (target === "info") showInfoModal.value = true;
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 로딩 애니메이션 */
.loader {
  width: 120px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #60a5fa, #a78bfa, #60a5fa);
  background-size: 200% 100%;
  animation: loadingBar 1.5s linear infinite;
}

@keyframes loadingBar {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>