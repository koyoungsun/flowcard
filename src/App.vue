<template>
  <Navbar />
  <router-view />
</template>

<script setup lang="ts">
  import Navbar from '@/components/Navbar.vue'
  import '@/assets/styles/main.scss'
</script>