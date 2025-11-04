<template>
  <section class="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm mt-10">
    <!-- 프로필 영역 -->
    <div class="flex flex-col items-center text-center">
      <img
        v-if="photoURL"
        :src="photoURL"
        alt="프로필 이미지"
        class="w-24 h-24 rounded-full border border-gray-200 shadow-sm"
      />
      <div
        v-else
        class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold text-gray-600"
      >
        {{ displayName?.charAt(0) || "?" }}
      </div>

      <h2 class="mt-4 text-xl font-semibold text-gray-800">
        {{ displayName || "사용자 이름 없음" }}
      </h2>
      <p class="text-gray-500 text-sm">{{ email || "이메일 정보 없음" }}</p>
    </div>

    <!-- 로그아웃 버튼 -->
    <div class="mt-8 flex justify-center">
      <button
        @click="manualSignOut"
        class="px-5 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
      >
        로그아웃
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAuthWatcher } from "@/composables/useAuthWatcher";
import { ref } from "vue";

// composable 가져오기
const { user, displayName, email, photoURL, manualSignOut } = useAuthWatcher();

// 반응형 데이터 디버깅용 (원할 경우 제거 가능)
console.log("🔍 Me.vue 사용자 정보:", {
  name: displayName.value,
  email: email.value,
  photo: photoURL.value,
});
</script>

<style scoped>
section {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>