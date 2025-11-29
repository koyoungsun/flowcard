<template>
  <section
    class="welcome-wrap min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-indigo-50 to-white text-center px-6"
  >
    <div class="wrap">
      <!-- 로고 -->
      <h1 class="text-3xl font-bold text-indigo-600 mb-2 tracking-wide">
        <i class="bi bi-arrow-90deg-right"></i> LINK <span class="text-gray-800">NEST</span>
      </h1>
      

      <!-- 서비스 요약 문구 -->
      <h3 class="text-gray-600 mb-10 text-base leading-relaxed max-w-md">
        <strong>내 링크들을 한곳에!</strong>
        브라우저 상단 북마크를 내아이디에 저장해서<br />
        그룹에서 바로 찾아 이동하고<br />
        버튼 한번으로 복사, 전달, 이동까지!<br />
        <span class="font-semibold text-indigo-500">내 전용 북마커</span>
      </h3>
      <em class="ico-ig"></em>
      <!-- 기능 포인트 -->
      <div class="mb-12 space-y-3 text-sm text-gray-700 leading-relaxed">
        <ol>
          <li>
            <i class="bi bi-1-circle"></i>그룹별로 링크를 <strong>정리</strong>하고 한눈에 <strong>관리</strong>하세요.
          </li>
          <li>
            <i class="bi bi-2-circle"></i>필요한 순간, 북마크 없이 <strong>바로 실행!</strong>
          </li>
          <li>
            <i class="bi bi-3-circle"></i>깔끔하고 심플한 인터페이스로 <strong>어디서나 연결</strong>.
          </li>
        </ol>
      </div>


      <!-- 버튼 그룹 -->
      <div class="flex gap-3 btn-bx">
        <button
          @click="handleLoginClick"
          class="px-5 py-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600 transition aqua-btn btn-login-w"
        >
          로그인
        </button>
        <router-link
          to="/register"
          class="px-5 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300 transition aqua-btn"
        >
          회원가입
        </router-link>
      </div>

      <div class="wel-footer">
        <p class="company"><strong>© LUNEST</strong> From Seeds to Systems.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
function handleLoginClick() {
  const ua = navigator.userAgent.toLowerCase();
  const loginUrl = `${window.location.origin}/login`;

  // 카카오톡, 인스타그램, 네이버 인앱 브라우저 감지
  if (ua.includes("kakao") || ua.includes("instagram") || ua.includes("naver")) {
    alert("인앱 브라우저에서는 로그인이 차단되어 외부 브라우저로 이동합니다.");
    // 카카오톡 외부 브라우저 호출 스킴
    window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(loginUrl)}`;
  } else {
    // 일반 브라우저는 직접 이동
    window.location.href = loginUrl;
  }
}
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