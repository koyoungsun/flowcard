<template>
    <section class="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-sm text-center verify-email">
      <h1 class="text-xl font-bold text-indigo-600 mb-2">이메일 인증을 완료해주세요</h1>
      <p class="text-gray-600 text-sm">
        가입 시 입력하신 이메일로 인증 메일을 보냈습니다.<br />
        메일함에서 <span class="text-indigo-500 font-medium">"이메일 인증"</span> 버튼을 눌러주세요.
      </p>
      <p class="text-gray-500 text-xs mt-2">이메일 인증이 완료되어야 로그인할 수 있습니다.</p>
  
      <div class="mt-6 space-y-2">
        <button
          @click="resendVerification"
          class="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          인증 메일 다시 보내기
        </button>
        <button
          @click="goToLogin"
          class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        >
          로그인 화면으로 이동
        </button>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { auth, } from '@/firebase'
  import { sendEmailVerification } from 'firebase/auth'
  
  const router = useRouter()
  const email = ref(auth.currentUser?.email || '')
  
  async function resendVerification() {
    const user = auth.currentUser
    if (!user) {
      alert('로그인 후 재요청할 수 있습니다.')
      return
    }
    try {
      await sendEmailVerification(user)
      alert('인증 메일을 다시 보냈습니다. 메일함을 확인해주세요.')
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        alert('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
      } else {
        console.error('재발송 실패:', err)
        alert('재전송 중 오류가 발생했습니다.')
      }
    }
  }
  
  function goToLogin() {
    router.push('/login')
  }
  </script>