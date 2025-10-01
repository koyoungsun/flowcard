<template>
  <section class="login-wrap">
    <div class="login">
      <h1 class="">로그인</h1>
      <button class="btn-google" @click="loginWithGoogle">
        Google로 로그인
      </button>

      <p class="add-coment">또는 이메일로 로그인</p>
      <form class="space-y-4" @submit.prevent="loginWithEmail">
        <div class="ins-f">
          <input v-model="email" type="email" placeholder="email" class="ins-email" />
      </div>
      <div class="ins-f">
        <input v-model="password" type="password" placeholder="password" class="ins-pass" />
      </div>
      <div>
        <button type="submit" class="btn-login">로그인</button>
    </div>
      </form>

      <p class="etc">
        계정이 없으신가요?
        <router-link to="/register" class="text-blue-500">회원가입</router-link>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from 'firebase/auth'

const email = ref('')
const password = ref('')
const router = useRouter()

// ✅ Google 로그인
async function loginWithGoogle() {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    console.log('로그인 성공:', result.user)
    router.push('/')
  } catch (error) {
    console.error('Google 로그인 실패:', error)
    alert('로그인에 실패했습니다.')
  }
}

// ✅ 이메일 로그인
async function loginWithEmail() {
  try {
    const result = await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log('이메일 로그인 성공:', result.user)
    router.push('/')
  } catch (error: any) {
    console.error('이메일 로그인 실패:', error)
    alert(error.message || '로그인에 실패했습니다.')
  }
}
</script>