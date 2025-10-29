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
      <button @click="$emit('close')" class="absolute top-3 right-4 text-2xl text-gray-500 hover:text-gray-700">
        ×
      </button>

      <!-- 상단 프로필 -->
      <div class="p-6 border-b border-gray-200 mt-8">
        <div class="flex items-center mb-4">
          <img
            :src="user?.photoURL || '/default-profile.png'"
            alt="Profile"
            class="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p class="font-semibold">{{ user?.displayName || "Guest" }}</p>
            <p v-if="user?.email" class="text-xs text-gray-500">{{ user.email }}</p>
          </div>
        </div>

        <!-- 그룹/링크 개수 -->
        <div
          v-if="groupCount !== undefined && linkCount !== undefined"
          class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 text-xs text-gray-600 mb-4"
        >
          <span>그룹: <strong class="text-gray-800">{{ groupCount }}</strong>개</span>
          <span>링크: <strong class="text-gray-800">{{ linkCount }}</strong>개</span>
        </div>

        <!-- ✅ 기본 보기 모드 -->
        <div class="mt-4">
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

        <!-- ✅ 테마 전환 (UI 통일) -->
        <div class="mt-6">
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

      <!-- 하단 -->
      <div class="p-6 border-t border-gray-200 text-center">
        <a
          href="mailto:linknest.app@gmail.com?subject=LinkNest%20피드백&body=안녕하세요%2C%20LUNEST%20팀에게%20전달할%20의견이나%20제안사항을%20작성해주세요.%0A%0A감사합니다!"
          class="inline-block text-indigo-500 font-medium hover:underline mb-3"
        >
          📩 메일 보내기
        </a>

        <button
          @click="logout"
          class="text-red-500 font-medium hover:underline w-full text-left mb-3"
        >
          로그아웃
        </button>

        <p class="text-xs text-gray-400 text-center leading-tight mt-3">
          ver. 0.1.0 / 2025.10.29<br />
          © LUNEST<br />
          From Seeds to Systems.
        </p>
      </div>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

/* ✅ 이벤트 정의 */
const emit = defineEmits(["close", "viewModeChanged"]);

defineProps<{
  isOpen: boolean;
  user?: any;
  groupCount?: number;
  linkCount?: number;
}>();

const router = useRouter();
const auth = getAuth();

/* 로그아웃 */
function logout() {
  signOut(auth)
    .then(() => router.push("/login"))
    .catch((err) => console.error("로그아웃 실패:", err));
}

/* ✅ 보기 모드 (즉시 적용 + 이벤트 전달) */
const selectedView = ref(localStorage.getItem("defaultViewMode") || "card");
function applyViewMode() {
  localStorage.setItem("defaultViewMode", selectedView.value);
  emit("viewModeChanged", selectedView.value); // App.vue에 전달
  console.log("보기 모드 변경:", selectedView.value);
}

/* ✅ 테마 모드 (즉시 적용) */
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
  console.log("테마 변경:", selectedTheme.value);
}
</script>

<style scoped>
aside {
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  height: 100vh;
  background: #fff;
  z-index: 9999;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

/* 슬라이드 효과 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* 페이드 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>