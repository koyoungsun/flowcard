<template>
  <!-- 오버레이 -->
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black/30 z-40" @click="$emit('close')"></div>
  </transition>

  <!-- 사이드 패널 -->
  <transition name="slide">
    <aside
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-[70vw] max-w-sm bg-white shadow-2xl z-50 flex flex-col justify-between relative"
    >
      <!-- 닫기 버튼 -->
      <button
        @click="$emit('close')"
        class="absolute top-3 right-4 text-2xl text-gray-500 hover:text-gray-700 btn-close"
      >
        <i class="bi bi-x-lg"></i>
      </button>

      <!-- 상단 프로필 -->
      <div class="p-6 border-b border-gray-200 mt-8">
        <div class="flex items-center mb-4 profile">
          <img
            :src="user?.photoURL || '/default-profile.png'"
            alt="Profile"
            class="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p class="user-name font-semibold">
              {{ user?.displayName || "Guest" }}<span>님 환영합니다.</span>
            </p>
            <p v-if="user?.email" class="text-xs text-gray-500">{{ user.email }}</p>
          </div>
        </div>

        <!-- 그룹/링크 개수 -->
        <div
          v-if="groupCount !== undefined && linkCount !== undefined"
          class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 text-xs text-gray-600 mb-4 status-view"
        >
          <h3>현재 진행중 링크</h3>
          <span>그룹: <strong class="text-gray-800">{{ groupCount }}</strong>개</span><i></i>
          <span>링크: <strong class="text-gray-800">{{ linkCount }}</strong>개</span>
        </div>

        <!-- 설정 -->
        <div class="setting">
          <!-- 보기 모드 -->
          <div class="mt-4 noline">
            <h4 class="text-sm font-medium text-gray-700 mb-2">기본 보기 모드</h4>
            <div class="flex items-center gap-3 text-sm">
              <label class="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="viewMode"
                  value="card"
                  v-model="selectedView"
                  class="text-indigo-500"
                  @change="applyViewMode"
                />
                카드형
              </label>
              <label class="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="viewMode"
                  value="list"
                  v-model="selectedView"
                  class="text-indigo-500"
                  @change="applyViewMode"
                />
                리스트형
              </label>
            </div>
          </div>

          <!-- 테마 (숨김) -->
          <div class="mt-4" style="display: none;">
            <h4 class="text-sm font-medium text-gray-700 mb-2">테마 전환</h4>
            <div class="flex items-center gap-3 text-sm">
              <label class="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="themeMode"
                  value="light"
                  v-model="selectedTheme"
                  class="text-indigo-500"
                  @change="applyTheme"
                />
                라이트
              </label>
              <label class="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="themeMode"
                  value="dark"
                  v-model="selectedTheme"
                  class="text-indigo-500"
                  @change="applyTheme"
                />
                다크
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단 -->
      <div class="p-6 border-t border-gray-200 text-center service">
        <p>
          <strong><i class="bi bi-envelope"></i> 서비스 이용 문의하기</strong> (메일전송)
        </p>
        <a
          href="mailto:srrtr4@gmail.com?subject=LinkNest%20피드백&body=안녕하세요%2C%20LUNEST%20팀에게%20전달할%20의견이나%20제안사항을%20작성해주세요.%0A%0A감사합니다!"
          class="inline-block text-indigo-500 font-medium hover:underline mb-3"
        >
          문의하기
        </a>

        <!-- ✅ 약관 링크 추가 -->
        <router-link
          to="/policy"
          class="block text-sm text-gray-600 hover:text-indigo-600 mb-3"
          @click="$emit('close')"
        >
          이용약관 및 개인정보 처리방침
        </router-link>

        <!-- 로그아웃 -->
        <button
          @click="$emit('logout')"
          class="text-red-500 font-medium hover:underline w-full text-left mb-3"
        >
          로그아웃
        </button>
      </div>

      <!-- 푸터 -->
      <div class="footer">
        <p class="item text-xs text-gray-400 text-center leading-tight mt-3">
          <strong>LINK NEST</strong> ver. 0.1.0 / 2025.10.29
        </p>
        <p class="company text-center text-xs text-gray-400">
          <strong>© LUNEST</strong> From Seeds to Systems.
        </p>
      </div>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const emit = defineEmits(["close", "go", "showInfo", "viewModeChanged", "logout"]);

defineProps<{
  isOpen: boolean;
  user?: any;
  groupCount?: number;
  linkCount?: number;
}>();

/* ✅ 보기 모드 */
const selectedView = ref(localStorage.getItem("defaultViewMode") || "card");
function applyViewMode() {
  localStorage.setItem("defaultViewMode", selectedView.value);
  emit("viewModeChanged", selectedView.value);
}

/* ✅ 테마 */
const selectedTheme = ref(localStorage.getItem("theme") || "light");
onMounted(() => {
  if (selectedTheme.value === "dark") {
    document.documentElement.classList.add("dark");
  }
});
function applyTheme() {
  if (selectedTheme.value === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", selectedTheme.value);
}
</script>

<style scoped>
.service a.router-link-active {
  font-weight: 500;
  color: #4f46e5;
}
</style>