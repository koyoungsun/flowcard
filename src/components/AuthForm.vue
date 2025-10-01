<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">이메일</label>
      <input
        v-model="email"
        type="email"
        class="w-full px-3 py-2 border rounded"
        placeholder="your@email.com"
        required
      />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">비밀번호</label>
      <input
        v-model="password"
        type="password"
        class="w-full px-3 py-2 border rounded"
        placeholder="비밀번호"
        required
      />
    </div>

    <div class="flex justify-between items-center">
      <button type="submit" class="bg-indigo-500 text-white px-4 py-2 rounded">
        {{ isLogin ? "로그인" : "회원가입" }}
      </button>
      <button type="button" class="text-sm text-gray-600" @click="toggleMode">
        {{ isLogin ? "회원가입" : "로그인" }}으로 전환
      </button>
    </div>

    <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { loginUser, registerUser } from '@/services/auth'

const email = ref('')
const password = ref('')
const isLogin = ref(true)
const error = ref('')

function toggleMode() {
  isLogin.value = !isLogin.value
  error.value = ''
}

async function onSubmit() {
  error.value = ''
  try {
    if (isLogin.value) {
      await loginUser(email.value, password.value)
      alert('로그인 성공!')
    } else {
      await registerUser(email.value, password.value)
      alert('회원가입 성공! 이제 로그인해주세요.')
      isLogin.value = true
    }
  } catch (err: any) {
    error.value = err.message || '오류가 발생했습니다.'
  }
}
</script>