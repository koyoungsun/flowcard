<template>
  <div
    @click="goToEdit"
    class="p-4 rounded-lg shadow bg-white flex items-center space-x-3 cursor-pointer hover:bg-gray-50"
  >
    <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
      {{ initials }}
    </div>
    <div class="flex flex-col">
      <p class="text-gray-900 font-semibold">{{ card.name }}</p>
      <p class="text-blue-600 text-sm truncate">{{ card.link }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  card: {
    name: string
    link: string
  }
  groupIndex: number
  cardIndex: number
}>()

const router = useRouter()

const goToEdit = () => {
  router.push({
    name: 'EditCard',
    params: {
      groupIndex: props.groupIndex,
      cardIndex: props.cardIndex
    }
  })
}

const initials = props.card.name
  .split(' ')
  .map(word => word.charAt(0))
  .join('')
  .toUpperCase()
</script>