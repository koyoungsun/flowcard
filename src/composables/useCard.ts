// src/composables/useCard.ts
import { ref, onMounted } from 'vue'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import { db } from '@/firebase'
import { currentUser } from './useAuth'

export interface Card {
  id?: string
  groupIndex: number
  question: string
  answer: string
  createdAt?: string
}

const cards = ref<Card[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useCard() {
  const fetchCards = async () => {
    if (!currentUser.value) {
      error.value = '로그인 상태가 아닙니다.'
      return
    }

    loading.value = true
    error.value = null

    try {
      const q = query(
        collection(db, 'cards'),
        where('uid', '==', currentUser.value.uid)
      )
      const querySnapshot = await getDocs(q)
      cards.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Card, 'id'>),
      }))
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addCard = async (card: Omit<Card, 'id'>) => {
    if (!currentUser.value) return
    await addDoc(collection(db, 'cards'), {
      ...card,
      uid: currentUser.value.uid,
      createdAt: new Date().toISOString(),
    })
    await fetchCards()
  }

  const updateCard = async (id: string, updatedCard: Partial<Card>) => {
    if (!id) return
    await updateDoc(doc(db, 'cards', id), updatedCard)
    await fetchCards()
  }

  const deleteCard = async (id: string) => {
    if (!id) return
    await deleteDoc(doc(db, 'cards', id))
    await fetchCards()
  }

  // 로그인 시 바로 불러오기
  onMounted(() => {
    fetchCards()
  })

  return {
    cards,
    loading,
    error,
    fetchCards,
    addCard,
    updateCard,
    deleteCard
  }
}