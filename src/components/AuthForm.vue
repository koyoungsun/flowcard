<template>
    <form class="space-y-4">
      <input v-model="email" placeholder="이메일" class="input" />
      <input v-model="password" type="password" placeholder="비밀번호" class="input" />
      <button @click.prevent="onLogin" class="btn">로그인</button>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  const email = ref("");
  const password = ref("");
  
  function onLogin() {
    console.log("로그인 시도:", email.value);
  }
  </script>