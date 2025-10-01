<template>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium">이메일</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full border rounded px-3 py-2"
          placeholder="이메일을 입력하세요"
        />
      </div>
  
      <div>
        <label class="block mb-1 text-sm font-medium">비밀번호</label>
        <input
          v-model="password"
          type="password"
          required
          minlength="6"
          class="w-full border rounded px-3 py-2"
          placeholder="비밀번호를 입력하세요 (6자 이상)"
        />
      </div>
  
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
      >
        회원가입
      </button>
  
      <div v-if="errorMessage" class="text-red-500 mt-2 text-sm text-center">
        {{ errorMessage }}
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { createUserWithEmailAndPassword } from 'firebase/auth'
  import { auth } from '@/firebase'
  
  const router = useRouter()
  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')
  
  async function handleRegister() {
    errorMessage.value = ''
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      )
      console.log('✅ 등록 완료:', userCredential.user)
      router.push('/')
    } catch (err: any) {
      console.error('🚫 등록 실패:', err)
      // Firebase 에러 메시지에서 깔끔한 한글 변환도 추후 가능
      errorMessage.value = err.message
    }
  }
  </script>