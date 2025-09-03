<template>
  <nav class="top-nav bg-white shadow px-4 py-3 flex justify-between items-center">
    <router-link to="/" class="logo"><h1>Link Wallet</h1></router-link>
    <div class="login">
      <!-- <router-link :to="{ name: 'AddCard', params: { groupIndex: 0 } }">Add</router-link> -->
      <router-link to="/login">Login</router-link>
    </div>
  </nav>
</template>

<script setup lang="ts"></script>