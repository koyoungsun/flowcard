<template>
  <nav class="top-nav bg-white shadow px-4 py-3 flex justify-between items-center">
    <router-link to="/" class="font-bold text-lg">Link Wallet</router-link>
    <div class="space-x-4">
      <router-link to="/add">Add</router-link>
      <router-link to="/login">Login</router-link>
    </div>
  </nav>
</template>

<script setup lang="ts"></script>