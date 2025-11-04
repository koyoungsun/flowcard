<template>
  <section
    class="max-w-2xl mx-auto text-sm leading-relaxed text-gray-700 bg-white rounded-lg shadow-sm mt-6"
  >
    <!-- 상단 돌아가기 헤더 (sticky + 무음영) -->
    <nav
      class="flex items-center px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10 top-nav"
    >
      <h1>LINK<strong>NEST</strong></h1>
      <button
        @click="goBack"
        class="flex items-center gap-1 text-gray-500 hover:text-indigo-600 text-sm btn-back"
      >
      <i class="bi bi-arrow-left"></i>
      </button>
    </nav>

    <div class="p-5 policy-wrap">
      <h1 class="text-lg font-semibold mb-6 text-center text-gray-800">
        LinkNest 이용약관 및 개인정보 처리방침
      </h1>

      <!-- 이용약관 -->
      <h2 class="text-base font-semibold mt-6 mb-2 text-gray-800">제1장 이용약관</h2>
      <div class="space-y-2">
        <p>
          본 약관은 LUNEST(이하 "회사")가 제공하는 LinkNest 서비스의 이용과
          관련하여 회원과 회사 간의 권리, 의무 및 책임 사항을 규정함을
          목적으로 합니다.
        </p>
        <p>
          <strong>제1조 (목적)</strong><br />본 약관은 회원이 LinkNest 서비스를
          이용함에 있어 회사와 회원 간의 권리·의무를 명확히 하는 것을
          목적으로 합니다.
        </p>
        <p>
          <strong>제2조 (회원가입)</strong><br />회원은 이메일과 비밀번호를
          입력하여 가입할 수 있으며, 회원 정보는 안전하게 Firebase에
          저장됩니다.
        </p>
        <p>
          <strong>제3조 (서비스 이용)</strong><br />회사는 안정적인 서비스
          제공을 위해 노력하나, 시스템 점검 등 불가피한 사유가 있는 경우
          일시적으로 중단될 수 있습니다.
        </p>
        <p>
          <strong>제4조 (책임의 제한)</strong><br />회사는 회원이 등록한 링크의
          내용에 대해 책임을 지지 않습니다.
        </p>
        <p>
          <strong>제5조 (약관 변경)</strong><br />회사는 필요 시 약관을 변경할
          수 있으며, 변경 시 공지사항을 통해 고지합니다.
        </p>
      </div>

      <!-- 개인정보 처리방침 -->
      <h2 class="text-base font-semibold mt-8 mb-2 text-gray-800">
        제2장 개인정보 처리방침
      </h2>
      <div class="space-y-2">
        <p>
          <strong>1. 수집 항목 및 이용 목적</strong><br />이메일, 비밀번호(암호화
          저장), 닉네임 — 회원 식별 및 서비스 제공을 위해 사용됩니다.
        </p>
        <p>
          <strong>2. 개인정보의 보유 및 이용 기간</strong><br />회원 탈퇴 시
          즉시 삭제하며, 법령에 따라 보존이 필요한 경우 해당 기간 동안
          보관합니다.
        </p>
        <p>
          <strong>3. 개인정보의 위탁 및 제공</strong><br />회사는 수집된
          개인정보를 제3자에게 제공하지 않으며, Firebase(Google LLC)에 위탁하여
          처리합니다.
        </p>
        <p>
          <strong>4. 개인정보의 파기 절차 및 방법</strong><br />회원 탈퇴 시
          Firestore 및 Storage 데이터는 즉시 삭제됩니다.
        </p>
        <p>
          <strong>5. 이용자 권리</strong><br />회원은 언제든지 개인정보 수정 및
          삭제를 요청할 수 있습니다.
        </p>
        <p>
          <strong>6. 개인정보 보호책임자</strong><br />담당자: Aiden (LUNEST 팀) /
          이메일: srrtr4@gmail.com
        </p>
      </div>

      <p class="mt-6 text-xs text-gray-500 text-center">
        본 약관 및 방침은 2025년 11월 1일부터 시행됩니다.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/"); // 직접 접근 시 홈으로 이동
  }
}
</script>

<style scoped>
.policy-wrap {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>