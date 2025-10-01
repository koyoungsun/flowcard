<template>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium">이메일</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full border rounded px-3 py-2"
          placeholder="이메일 입력"
        />
      </div>
  
      <div>
        <label class="block mb-1 text-sm font-medium">비밀번호</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full border rounded px-3 py-2"
          placeholder="비밀번호 입력"
        />
      </div>
  
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
      >
        로그인
      </button>
  
      <div v-if="errorMessage" class="text-red-500 mt-2 text-sm">
        {{ errorMessage }}
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { signInWithEmailAndPassword } from 'firebase/auth'
  import { auth } from '@/firebase'
  
  const router = useRouter()
  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')
  
  async function handleLogin() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      )
      console.log('✅ 로그인 성공:', userCredential.user)
      router.push('/')
    } catch (err: any) {
      errorMessage.value = err.message
      console.error('🚫 로그인 실패:', err)
    }
  }
  </script>