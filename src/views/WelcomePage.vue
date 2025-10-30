<template>
    <section
      class="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-mint-50 via-ivory-50 to-white"
    >
      <!-- 일러스트 -->
      <img
        src="/empty-boy.png"
        alt="빈 바구니를 든 소년"
        class="w-40 h-auto mb-6 select-none"
      />
  
      <!-- 타이틀 -->
      <h1 class="text-2xl font-semibold text-lavender-700 mb-2">
        어서 와요, <span class="text-lavender-500">LINK NEST</span>에 🌿
      </h1>
  
      <!-- 설명문 -->
      <p class="text-gray-600 leading-relaxed mb-8">
        자주 쓰는 링크를 따뜻하게 담아둘 수 있는,<br />
        나만의 작은 공간이에요.
      </p>
  
      <!-- 로그인 버튼 -->
      <button
        @click="$router.push('/login')"
        class="px-6 py-2.5 rounded-full text-white font-medium
               bg-gradient-to-r from-lavender-400 to-mint-400
               shadow-md hover:opacity-90 transition"
      >
        로그인하고 시작하기
      </button>
  
      <!-- 오늘 하루 보지 않기 팝업 -->
      <transition name="fade">
        <div
          v-if="showIntro"
          class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div
            class="bg-white rounded-xl shadow-lg p-6 w-80 text-center relative"
          >
            <button
              @click="hideIntroForToday"
              class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <i class="bi bi-x-lg"></i>
            </button>
            <h3 class="text-lg font-semibold text-lavender-700 mb-3">
              LINK NEST 소개
            </h3>
            <p class="text-sm text-gray-600 mb-5">
              나만의 링크를 그룹으로 정리하고,<br />
              클릭 한 번으로 빠르게 열어보세요.
            </p>
            <button
              @click="hideIntroForToday"
              class="px-4 py-1.5 text-sm bg-lavender-500 text-white rounded-full hover:opacity-90"
            >
              오늘 하루 보지 않기
            </button>
          </div>
        </div>
      </transition>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  
  const showIntro = ref(false);
  
  onMounted(() => {
    const hiddenToday = localStorage.getItem("hideIntroToday");
    if (!hiddenToday) showIntro.value = true;
  });
  
  function hideIntroForToday() {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("hideIntroToday", today);
    showIntro.value = false;
  }
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* 배경 파스텔 컬러 정의 */
  .bg-mint-50 {
    background-color: #e5f9f5;
  }
  .bg-ivory-50 {
    background-color: #fdfaf6;
  }
  .text-lavender-700 {
    color: #7c6db0;
  }
  .text-lavender-500 {
    color: #b8a8e6;
  }
  .bg-lavender-500 {
    background-color: #b8a8e6;
  }
  </style>