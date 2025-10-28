<template>
  <nav class="top-nav flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-white">
    <!-- 로고 -->
    <router-link to="/" class="logo">
      <h1 class="text-lg font-bold">
        LINK <strong>WALLET</strong>
      </h1>
    </router-link>

    <!-- 오른쪽 영역 -->
    <div class="flex items-center gap-3">
      <!-- 사용자 이름 -->
      <span v-if="currentUser" class="t-log-tit text-sm text-gray-600">
        {{ currentUser.displayName || currentUser.email }}님 반갑습니다.
      </span>

      <!-- 로그인 / 로그아웃 -->
      <router-link
        v-if="!currentUser"
        to="/login"
        class="nt-t-login text-indigo-500 hover:underline"
      >
        로그인
      </router-link>

      <button
        v-else
        @click="handleLogout"
        class="bt-t-logout text-gray-600 hover:text-red-500"
      >
        로그아웃
      </button>

      <!-- 햄버거 버튼 -->
      <button
        class="ml-2 text-2xl text-gray-700 hover:text-indigo-500"
        @click="$emit('toggleNav')"
      >
        ☰
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const { currentUser, logout } = useAuth();
const router = useRouter();

async function handleLogout() {
  try {
    await logout();
    router.push("/login");
  } catch (err) {
    console.error("로그아웃 실패:", err);
  }
}
</script>