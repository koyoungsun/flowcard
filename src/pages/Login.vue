<template>
  <section class="login-wrap">
    <nav
      class="flex items-center px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10 top-nav"
    >
      <a href="/"><h1>LINK<strong>NEST</strong></h1></a>
    </nav>

    <div class="login">
      <h1>로그인</h1>

      <!-- Google 로그인 -->
      <button class="btn-google-g" @click="loginWithGoogle">
        <i class="bi bi-google"></i> Google 로그인
      </button>

      <p class="add-coment">
        또는 <span><i class="bi bi-envelope"></i> 이메일로 로그인</span>
      </p>

      <!-- 이메일 로그인 -->
      <form class="space-y-4" @submit.prevent="loginWithEmail">
        <div class="ins-f">
          <input v-model="email" type="email" placeholder="Insert email" class="ins-email" />
        </div>
        <div class="ins-f">
          <input v-model="password" type="password" placeholder="password" class="ins-pass" />
        </div>
        <div>
          <button type="submit" class="btn-login">로그인</button>
        </div>
      </form>

      <p v-if="errorMsg" class="text-red-500 text-sm mt-3 caution">{{ errorMsg }}</p>

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
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'firebase/auth'

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const router = useRouter()

// ✅ Google 로그인
async function loginWithGoogle() {
  const provider = new GoogleAuthProvider()
  const ua = navigator.userAgent.toLowerCase()
  const currentUrl = window.location.href

  // 🔹 카카오톡, 인스타그램, 네이버 인앱 브라우저 감지
  if (ua.includes('kakao') || ua.includes('instagram') || ua.includes('naver')) {
    alert('인앱 브라우저에서는 로그인이 차단되어 외부 브라우저로 이동합니다.')
    // 카카오톡 외부 브라우저 호출
    window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`
    return
  }

  try {
    const result = await signInWithPopup(auth, provider)
    console.log('✅ Google 로그인 성공:', result.user)
    router.push('/')
  } catch (error: any) {
    console.error('❌ Google 로그인 실패:', error)
    alert('로그인에 실패했습니다. 외부 브라우저(Safari 또는 Chrome)에서 다시 시도해주세요.')
  }
}

// ✅ 이메일 로그인 (이메일 인증 필수)
async function loginWithEmail() {
  errorMsg.value = ''
  try {
    const result = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = result.user

    // 🔄 최신 상태 갱신
    await user.reload()

    // 이메일 인증 확인
    if (!user.emailVerified) {
      try {
        const lastSignIn = user.metadata.lastSignInTime
          ? new Date(user.metadata.lastSignInTime).getTime()
          : 0
        const now = Date.now()

        if (now - lastSignIn > 60000) {
          await sendEmailVerification(user)
          console.log('📨 인증 메일 재발송 완료')
        } else {
          console.log('최근에 이미 발송됨 → 재발송 생략')
        }
      } catch (err: any) {
        if (err.code === 'auth/too-many-requests') {
          errorMsg.value = '* 인증 메일 요청이 많습니다. 잠시 후 시도해주세요.'
        } else {
          console.error('메일 발송 실패:', err)
        }
      }

      router.push('/verify-email')
      setTimeout(async () => {
        await signOut(auth)
        console.log('🚪 비인증 유저 로그아웃 완료')
      }, 500)

      return
    }

    console.log('✅ 이메일 로그인 성공:', user)
    router.push('/')
  } catch (error: any) {
    console.error('이메일 로그인 실패:', error)
    errorMsg.value = error.message || '로그인에 실패했습니다.'
  }
}
</script>

<style scoped>
</style>