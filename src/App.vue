<template>
  <div id="app">
    <!-- ✅ 로그인 상태이면서 헤더가 필요한 페이지에서만 표시 -->
    <HeaderBar
      v-if="isLoggedIn && !$route.meta.noHeader"
      :user="currentUser"
      @toggleNav="showNav = !showNav"
      @openGuide="showInfoModal = true"
    />

    <!-- ✅ 햄버거 메뉴도 동일한 조건으로 표시 -->
    <ToastNav
      v-if="isLoggedIn && !$route.meta.noHeader"
      :isOpen="showNav"
      :user="currentUser"
      :groupCount="groupCount"
      :linkCount="linkCount"
      @close="showNav = false"
      @go="handleNavGo"
      @viewModeChanged="onViewModeChanged"
      @logout="handleLogout"
    />

    <!-- ✅ 페이지 전환 (transition 제거) -->
    <router-view :key="viewMode" :viewMode="viewMode" />

    <!-- ✅ 서비스 안내 모달 -->
    <div
      v-if="isLoggedIn && !$route.meta.noHeader && showInfoModal"
      class="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
      @click.self="showInfoModal = false"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 w-80 text-center relative modal-pop">
        <button
          class="absolute top-2 right-3 text-gray-400 text-xl hover:text-gray-600 btn-close"
          @click="showInfoModal = false"
        >
          <i class="bi bi-x-lg"></i>
        </button>
        <div class="info">
          <h2 class="text-lg font-semibold mb-4">LINK NEST란?</h2>
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

/* ✅ 상태 */
const showNav = ref(false);
const showInfoModal = ref(false);
const currentUser = ref<any>(null);

/* ✅ 로그인 여부 */
const isLoggedIn = computed(() => !!currentUser.value);

/* ✅ 보기 모드 */
const viewMode = ref(localStorage.getItem("defaultViewMode") || "card");
function onViewModeChanged(newMode: string) {
  viewMode.value = newMode;
  localStorage.setItem("defaultViewMode", newMode);
}

/* ✅ 그룹 데이터 */
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

/* ✅ Firebase 유저 상태 감시 */
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
  });
});

/* ✅ 로그아웃 */
async function handleLogout() {
  await signOut(auth);
  showNav.value = false;
  router.replace("/");
}

/* ✅ 네비게이션 이동 */
function handleNavGo(target: string) {
  showNav.value = false;
  if (target === "home") router.push("/home");
  else if (target === "info") showInfoModal.value = true;
}
</script>

<style scoped>
/* 전환 관련 스타일 없음 — 완전 정적 상태 */
</style>