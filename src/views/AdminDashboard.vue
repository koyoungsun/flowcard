<template>
    <section class="admin-dashboard p-6 bg-gray-50 min-h-screen">
      <h2 class="text-2xl font-bold mb-6">📊 LinkNest Admin Dashboard</h2>
  
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="(item, key) in stats" :key="key" class="bg-white p-4 rounded shadow text-center">
          <h3 class="text-sm text-gray-500 mb-1">{{ labels[key] }}</h3>
          <p class="text-xl font-bold text-indigo-600">{{ item }}</p>
        </div>
      </div>
  
      <p class="text-xs text-gray-400 mt-6 text-right">
        Last Updated: {{ stats.lastUpdated }}
      </p>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { doc, onSnapshot } from "firebase/firestore";
  import { db, auth } from "@/firebase";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const stats = ref<any>({});
  const labels = {
    totalUsers: "가입자 수",
    totalGroups: "그룹 수",
    totalLinks: "링크 수",
    activeUsers: "현재 접속자",
  };
  
  onMounted(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user?.email !== "aiden@lunest.io") {
        alert("관리자 전용 페이지입니다.");
        router.push("/");
        return;
      }
  
      // 실시간 통계 구독
      const statsRef = doc(db, "stats", "global");
      onSnapshot(statsRef, (snap) => {
        stats.value = snap.data() || {};
      });
    });
  });
  </script>