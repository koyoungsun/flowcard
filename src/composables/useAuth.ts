// src/composables/useAuth.ts
import { ref, onMounted } from 'vue'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '@/firebase'

const currentUser = ref<User | null>(null)

export function useAuth() {
  const logout = async () => {
    try {
      await signOut(auth)
      currentUser.value = null
      // 필요 시 아래 주석 해제
      // const router = useRouter()
      // router.push('/login')
    } catch (err) {
      console.error('🚫 로그아웃 실패:', err)
    }
  }

  onMounted(() => {
    onAuthStateChanged(auth, (user) => {
      currentUser.value = user
    })
  })

  return {
    currentUser,
    logout,
  }
}

export { currentUser }