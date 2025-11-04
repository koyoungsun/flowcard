<template>
  <form @submit.prevent="handleLogin" class="space-y-4 max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm">
    <h1 class="text-xl font-bold mb-2">로그인</h1>
    <p class="text-gray-600 text-sm mb-4">이메일과 비밀번호를 입력하세요.</p>

    <div>
      <label class="block mb-1 text-sm font-medium">이메일</label>
      <input
        v-model="email"
        type="email"
        required
        class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lavender-400"
        placeholder="이메일 입력"
      />
    </div>

    <div>
      <label class="block mb-1 text-sm font-medium">비밀번호</label>
      <input
        v-model="password"
        type="password"
        required
        class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lavender-400"
        placeholder="비밀번호 입력"
      />
    </div>

    <button
      type="submit"
      class="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded transition-colors"
    >
      로그인
    </button>

    <div v-if="errorMessage" class="text-red-500 mt-3 text-sm text-center">
      {{ errorMessage }}
    </div>

    <div v-if="infoMessage" class="text-indigo-600 mt-3 text-sm text-center">
      {{ infoMessage }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/firebase";

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const infoMessage = ref("");

async function handleLogin() {
  errorMessage.value = "";
  infoMessage.value = "";

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    // ✅ 이메일 인증 여부 확인
    if (!user.emailVerified) {
      await signOut(auth); // 인증 안 됐으면 즉시 로그아웃
      errorMessage.value = "이메일 인증 후 로그인할 수 있습니다.";
      infoMessage.value = "메일함에서 '이메일 인증' 버튼을 눌러주세요.";
      return;
    }

    console.log("✅ 로그인 성공:", user.email);
    router.push("/"); // 홈으로 이동
  } catch (err: any) {
    console.error("🚫 로그인 실패:", err);
    if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
      errorMessage.value = "이메일 또는 비밀번호가 올바르지 않습니다.";
    } else if (err.code === "auth/user-not-found") {
      errorMessage.value = "가입된 사용자를 찾을 수 없습니다.";
    } else {
      errorMessage.value = "로그인 중 오류가 발생했습니다.";
    }
  }
}
</script>

<style scoped>
input {
  transition: all 0.2s ease;
}
input:focus {
  border-color: #a78bfa;
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.3);
}
</style>