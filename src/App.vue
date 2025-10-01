<template>
  <div>
    <Navbar />

    <header class="w-full bg-gray-100 p-4 text-right text-sm" v-if="currentUser">
      <!-- <span class="mr-4">{{ currentUser.displayName || currentUser.email }}님 반갑습니다</span>
      <button @click="logout" class="text-blue-500 hover:underline">로그아웃</button> -->
    </header>

    <router-view />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import '@/assets/styles/main.scss'

import { useAuth, currentUser } from '@/composables/useAuth'

const { logout } = useAuth()
</script>