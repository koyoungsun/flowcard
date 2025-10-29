<template>
  <div id="app">
    <!-- 상단 헤더 -->
    <HeaderBar
      @toggleNav="showNav = !showNav"
      @login="router.push('/login')"
      @logout="logoutUser"
      @openGuide="showInfoModal = true"
    />

    <!-- 햄버거 메뉴 -->
    <ToastNav
      :isOpen="showNav"
      :user="currentUser"
      :groupCount="groupCount"
      :linkCount="linkCount"
      @close="showNav = false"
      @go="handleNavGo"
      @showInfo="showInfoModal = true"
      @viewModeChanged="onViewModeChanged"
    />

    <!-- 메인 콘텐츠 -->
    <router-view :key="viewMode" :viewMode="viewMode" /> <!--  전달 -->

    <!-- 서비스 안내 모달 -->
    <transition name="fade">
      <div
        v-if="showInfoModal"
        class="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
        @click.self="showInfoModal = false"
      >
      <div class="dimd"></div>
        <div class="bg-white rounded-xl shadow-lg p-6 w-80 text-center relative modal-pop">
          <button
            class="absolute top-2 right-3 text-gray-400 text-xl hover:text-gray-600"
            @click="showInfoModal = false"
          >
            ×
          </button>
          <h2 class="text-lg font-semibold mb-4">LinkNest란?</h2>
          <h3>자주 쓰는 웹사이트와 앱 링크들 한 화면에 보기 쉽게 정리해두고,
클릭 한 번으로 바로 실행할 수 있게 도와주는 개인 공간 입니다. 나만의 기억을 담은 링크리스트.</h3>
          <p class="text-sm text-gray-500">
            복잡한 북마크 폴더를 뒤지지 말고,
눈에 보이는 카드에서 바로 실행하세요.
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import HeaderBar from "@/components/HeaderBar.vue";
import ToastNav from "@/components/ToastNav.vue";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useGroups } from "@/composables/useGroups";

const router = useRouter();
const auth = getAuth();
const showNav = ref(false);
const currentUser = ref<any>(null);
const showInfoModal = ref(false);

/* ✅ 보기모드 상태 관리 */
const viewMode = ref(localStorage.getItem("defaultViewMode") || "card");
function onViewModeChanged(newMode: string) {
  viewMode.value = newMode;
  localStorage.setItem("defaultViewMode", newMode);
}

/* ✅ Firestore 그룹 데이터 */
const { groups, fetchGroups } = useGroups();
onMounted(async () => {
  await fetchGroups();
});

/* ✅ 그룹 / 링크 수 계산 */
const groupCount = computed(() => groups.value.length);
const linkCount = computed(() =>
  groups.value.reduce(
    (total, group) => total + ((group.cards && group.cards.length) || 0),
    0
  )
);

/* ✅ 로그인 상태 감시 */
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
    console.log("Auth 변경 감지:", user?.email || "로그아웃됨");
  });
});

function handleNavGo(target: string) {
  showNav.value = false;
  if (target === "home") router.push("/");
  else if (target === "login") router.push("/login");
  else if (target === "info") showInfoModal.value = true;
}

async function logoutUser() {
  await signOut(auth);
  router.push("/login");
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>