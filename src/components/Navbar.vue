<template>
  <nav class="top-nav">
    <router-link to="/" class="logo"><h1>Link Wallet</h1></router-link>

    <div class="t-log-area">
      <!-- 사용자 이름 표시 -->
      <span v-if="currentUser" class="t-log-tit"> {{ currentUser.displayName || currentUser.email }}님 반갑습니다.</span>

      <!-- 로그인 / 로그아웃 전환 -->
      <router-link v-if="!currentUser" to="/login" class="nt-t-login">로그인</router-link>
      <button v-else @click="logout" class="bt-t-logout">로그아웃</button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { currentUser, logout } = useAuth()
</script>