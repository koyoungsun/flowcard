<template>
  <nav class="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-white shadow-sm top-nav">
    <a href="/" class="flex items-center gap-1 select-none">
      <h1 class="text-lg font-bold tracking-wide">
        <span class="text-lavender-700">LINK</span>
        <strong class="text-gray-800">NEST</strong>
      </h1>
    </a>
  </nav>

  <div class="join max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm relative">
    <!-- 이메일 인증 안내 -->
    <div v-if="emailSent" class="text-center space-y-4 send-chk">
      <em></em>
      <h2 class="text-xl font-bold text-indigo-600">이메일 인증 요청 완료</h2>
      <p class="text-gray-600 text-sm">
        <strong>{{ email }}</strong> 주소로 인증 메일을 보냈습니다.<br />
        메일함에서 <span class="text-indigo-500 font-medium">"이메일 인증"</span> 버튼을 눌러주세요.
      </p>
      <p class="text-gray-500 text-xs">이메일 인증이 완료되어야 로그인할 수 있습니다.</p>
      <button @click="goToLogin" class="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded mt-4">
        로그인 화면으로 이동
      </button>
    </div>
<!-- 회원가입 폼 -->
<form v-else @submit.prevent="handleRegister" class="space-y-4">
  <h1 class="text-xl font-bold mb-2">회원 가입</h1>
  <p class="cmt text-gray-600 text-sm mb-4">이메일 주소와 비밀번호로 가입하세요.</p>

  <!-- 이메일 -->
  <div class="input-form">
    <label class="block mb-1 text-sm font-medium"><i class="bi bi-envelope"></i> 이메일</label>
    <input
      v-model="email"
      type="email"
      @blur="validateEmail"
      class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lavender-400"
      placeholder="이메일을 입력하세요"
    />
    <p v-if="emailError" class="ico-alert">{{ emailError }}</p>
  </div>

  <!-- 비밀번호 -->
  <div class="input-form">
    <label class="block mb-1 text-sm font-medium"><i class="bi bi-lock"></i> 비밀번호</label>
    <input
      v-model="password"
      type="password"
      @blur="validatePassword"
      class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lavender-400"
      placeholder="비밀번호를 입력하세요 (6자 이상)"
    />
    <p v-if="passwordError" class="ico-alert">{{ passwordError }}</p>
  </div>

  <!-- 비밀번호 확인 -->
  <div class="input-form">
    <label class="block mb-1 text-sm font-medium"><i class="bi bi-lock-fill"></i> 비밀번호 확인</label>
    <input
      v-model="confirmPassword"
      type="password"
      @blur="validateConfirm"
      class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lavender-400"
      placeholder="비밀번호를 다시 입력하세요"
    />
    <p v-if="confirmError" class="ico-alert">{{ confirmError }}</p>
  </div>

  <!-- 닉네임 -->
  <div class="input-form">
    <label class="block mb-1 text-sm font-medium"><i class="bi bi-person"></i> 닉네임</label>
    <input
      v-model="nickname"
      type="text"
      @blur="validateNickname"
      class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lavender-400"
      placeholder="닉네임을 입력하세요"
    />
    <p v-if="nicknameError" class="ico-alert">{{ nicknameError }}</p>
  </div>

  <!-- 약관 동의 -->
  <div class="privacy flex items-center gap-2 mt-3">
    <input type="checkbox" v-model="agree" id="agree" />
    <label for="agree" class="text-sm text-gray-700">
      <router-link to="/policy" class="text-blue-600 hover:underline">이용약관 및 개인정보 처리방침</router-link>
      에 동의합니다.
    </label>
  </div>
  <p v-if="agreeError" class="ico-alert">{{ agreeError }}</p>

  <!-- 가입 버튼 -->
  <button
    type="submit"
    :disabled="!isFormValid"
    class="w-full py-2 rounded mt-4 btn-join-ok transition-colors font-medium"
    :class="isFormValid ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
  >
    회원가입
  </button>
</form>
</div>

</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

/* 라우터 */
const router = useRouter();

/* 상태값 */
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const nickname = ref("");
const agree = ref(false);

const emailError = ref("");
const passwordError = ref("");
const confirmError = ref("");
const nicknameError = ref("");
const agreeError = ref("");

const emailChecked = ref(false);
const emailSent = ref(false);
const defaultImage = "../../img/noimg.png";

/* 이메일 유효성 검사 */
async function validateEmail() {
  emailError.value = "";
  emailChecked.value = false;

  if (!email.value) {
    emailError.value = "이메일을 입력해주세요.";
    return;
  }

  const emailPattern = /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/;
  if (!emailPattern.test(email.value)) {
    emailError.value = "올바른 이메일 주소를 입력해주세요.";
    return;
  }

  try {
    const methods = await fetchSignInMethodsForEmail(auth, email.value);
    if (methods.length > 0) {
      emailError.value = "이미 가입된 이메일입니다.";
      return;
    }
    emailChecked.value = true;
  } catch (err) {
    console.error(" 이메일 중복 확인 오류:", err);
    emailError.value = "이메일 확인 중 오류가 발생했습니다.";
  }
}

/* 비밀번호 검사 */
function validatePassword() {
  passwordError.value = "";
  if (!password.value) passwordError.value = "비밀번호를 입력해주세요.";
  else if (password.value.length < 6)
    passwordError.value = "비밀번호는 6자 이상이어야 합니다.";
}

/* 비밀번호 확인 검사 */
function validateConfirm() {
  confirmError.value = "";
  if (confirmPassword.value !== password.value)
    confirmError.value = "비밀번호가 일치하지 않습니다.";
}

/* 닉네임 검사 */
function validateNickname() {
  nicknameError.value = "";
  if (!nickname.value) nicknameError.value = "닉네임을 입력해주세요.";
}

/* 폼 전체 유효성 검사 */
const isFormValid = computed(() => {
  return (
    email.value &&
    password.value.length >= 6 &&
    confirmPassword.value === password.value &&
    nickname.value &&
    agree.value &&
    emailChecked.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmError.value &&
    !nicknameError.value
  );
});

/* 회원가입 처리 */
async function handleRegister() {
  console.log("회원가입 클릭됨");
  await validateEmail();
  validatePassword();
  validateConfirm();
  validateNickname();

  agreeError.value = agree.value ? "" : "약관에 동의해야 가입할 수 있습니다.";
  if (!isFormValid.value) return;

  try {
    console.log("📩 Firebase 회원 생성 시도:", email.value);
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    console.log("Firebase 사용자 생성 완료:", user.uid);

    await updateProfile(user, {
      displayName: nickname.value,
      photoURL: defaultImage
    });
    console.log("👤 프로필 업데이트 완료");

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: nickname.value,
      photoURL: defaultImage,
      createdAt: new Date(),
      verified: false
    });
    console.log("📘 Firestore에 유저 정보 저장 완료");

    // 인증 메일 발송 (중복 방지 + 에러 처리)
    try {
      await sendEmailVerification(user);
      console.log("📨 인증 이메일 발송 완료");
      emailSent.value = true;
    } catch (err: any) {
      if (err.code === "auth/too-many-requests") {
        console.warn("⚠ 인증 메일 과다 요청: 잠시 후 재시도");
      } else {
        console.error("메일 발송 실패:", err);
      }
    }

    // 기본 그룹 생성 (메일 발송 완료 후)
    const groupsRef = collection(db, "users", user.uid, "groups");
    await addDoc(groupsRef, {
      groupName: "기본 그룹",
      createdAt: new Date()
    });
    console.log("📁 기본 그룹 생성 완료");

    // 로그아웃 (Firestore sync 보장 후 1초 딜레이)
    setTimeout(async () => {
      await signOut(auth);
      console.log("🚪 로그아웃 완료");
    }, 1000);
  } catch (err: any) {
    console.error(" 회원가입 전체 실패:", err);
    if (err.code) console.error("🔥 Firebase 에러 코드:", err.code);
    emailError.value = err.message || "회원가입 중 오류가 발생했습니다.";
  }
}

/* 로그인 페이지로 이동 */
function goToLogin() {
  router.push("/login");
}
</script>
<style scoped>
.join input[type="checkbox"] {
  accent-color: #2563eb;
}

.ico-alert {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1.3;
}
.ico-alert::before {
  content: "⚠";
  font-size: 0.75rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
