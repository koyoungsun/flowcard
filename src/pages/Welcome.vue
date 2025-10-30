<template>
  <section
    class="welcome-wrap min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-indigo-50 to-white text-center px-6"
  >
    <div class="wrap">
      <!-- 로고 -->
      <h1 class="text-3xl font-bold text-indigo-600 mb-2 tracking-wide">
        <i class="bi bi-arrow-90deg-right"></i> LINK <span class="text-gray-800">NEST</span>
      </h1>
      <em class="ico-ig"></em>
      <!-- 서비스 요약 문구 -->
      <h3 class="text-gray-600 mb-10 text-base leading-relaxed max-w-md">
        <strong><i class="bi bi-balloon-fill"></i>흩어진 링크를 한곳에 모아보세요.<i class="bi bi-balloon-fill"></i></strong>
        나만의 링크 그룹을 만들고,<br /> 한 번의 클릭으로 바로 실행하는<br />
        버튼한번으로 복사해서 전달까지!<br />
        <span class="font-semibold text-indigo-500">스마트 링크 보관함!!</span>
      </h3>

      <!-- (이미지 자리)
      <img :src="emptyBasket" alt="illustration" class="w-40 mb-8" />
      -->

      <!-- 기능 포인트 -->
      <div class="mb-12 space-y-3 text-sm text-gray-700 leading-relaxed">
        <ol>
          <li><i class="bi bi-1-circle"></i>그룹별로 링크를 <strong>정리</strong>하고 한눈에 <strong>관리</strong>하세요.</li>
          <li><i class="bi bi-2-circle"></i>필요한 순간, 북마크 없이 <strong>바로 실행!</strong></li>
          <li><i class="bi bi-3-circle"></i>깔끔하고 심플한 인터페이스로 <strong>어디서나 연결</strong>.</li>
        </ol>
      </div>
      <!-- 하단 문구 -->
      <p class="mt-10 text-sm text-gray-400 tit-point">
        지금 나만의 링크 공간을 만들어보세요.
      </p>
      <!-- 버튼 그룹 -->
      <div class="flex gap-3 btn-bx">
        <router-link
          to="/login"
          class="px-5 py-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600 transition aqua-btn"
        >
          로그인
        </router-link>
        <router-link
          to="/register"
          class="px-5 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300 transition aqua-btn"
        >
          회원가입
        </router-link>
      </div>

      
  </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
section {
  animation: fadeIn 0.6s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>