<template>
  <nav class="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-white shadow-sm top-nav">
    <a href="/" class="flex items-center gap-1 select-none">
      <h1 class="text-lg font-bold tracking-wide">
        <span class="text-lavender-700">LINK</span>
        <strong class="text-gray-800">NEST</strong>
      </h1>
    </a>
  </nav>

  <div class="join max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm">
    <!-- 가입 완료 후 안내 -->
    <div v-if="emailSent" class="text-center space-y-4">
      <h2 class="text-xl font-bold text-indigo-600">이메일 인증 요청 완료</h2>
      <p class="text-gray-600 text-sm">
        <strong>{{ email }}</strong> 주소로 인증 메일을 보냈습니다.<br />
        메일함에서 <span class="text-indigo-500 font-medium">"이메일 인증"</span> 버튼을 눌러주세요.
      </p>
      <p class="text-gray-500 text-xs">이메일 인증이 완료되어야 로그인할 수 있습니다.</p>
      <button
        @click="goToLogin"
        class="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded mt-4"
      >
        로그인 화면으로 이동
      </button>
    </div>

    <!-- 회원가입 폼 -->
    <form v-else @submit.prevent="handleRegister" class="space-y-4">
      <h1 class="text-xl font-bold mb-2">회원 가입</h1>
      <p class="cmt text-gray-600 text-sm mb-4">간단한 정보를 입력하고 회원으로 가입하세요.</p>

      <!-- 이메일 -->
      <div class="input-form">
        <label class="block mb-1 text-sm font-medium"><i class="bi bi-envelope"></i> 이메일</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full border rounded px-3 py-2"
          placeholder="이메일을 입력하세요"
        />
      </div>

      <!-- 비밀번호 -->
      <div class="input-form">
        <label class="block mb-1 text-sm font-medium"><i class="bi bi-lock"></i> 비밀번호</label>
        <input
          v-model="password"
          type="password"
          required
          minlength="6"
          class="w-full border rounded px-3 py-2"
          placeholder="비밀번호를 입력하세요 (6자 이상)"
        />
      </div>

      <!-- 비밀번호 확인 -->
      <div class="input-form">
        <label class="block mb-1 text-sm font-medium"><i class="bi bi-lock-fill"></i> 비밀번호 확인</label>
        <input
          v-model="confirmPassword"
          type="password"
          required
          minlength="6"
          class="w-full border rounded px-3 py-2"
          placeholder="비밀번호를 다시 입력하세요"
        />
      </div>

      <!-- 닉네임 -->
      <div class="input-form">
        <label class="block mb-1 text-sm font-medium"><i class="bi bi-person"></i> 닉네임</label>
        <input
          v-model="nickname"
          type="text"
          required
          class="w-full border rounded px-3 py-2"
          placeholder="닉네임을 입력하세요"
        />
      </div>

      <!-- 프로필 이미지 선택 -->
      <div class="profile-img">
        <label class="block mb-1 text-sm font-medium"><i class="bi bi-person-bounding-box"></i> <strong>프로필 이미지</strong> (선택)</label>
        <input type="file" @change="onFileChange" accept="image/*" class="text-sm" />
        <div class="mt-2 flex items-center gap-2">
          <img
            v-if="previewImage"
            :src="previewImage"
            class="w-12 h-12 rounded-full border object-cover"
          />
          <img
            v-else
            :src="defaultImage"
            class="w-12 h-12 rounded-full border object-cover opacity-60"
          />
          <span class="text-xs text-gray-500">선택하지 않으면 기본 이미지가 사용됩니다.</span>
        </div>
      </div>

      <!-- 약관 동의 -->
      <div class="privacy flex items-center gap-2 mt-3">
        <input type="checkbox" v-model="agree" id="agree" required />
        <label for="agree" class="text-sm text-gray-700">
          <router-link to="/policy" class="text-blue-600 hover:underline">
            이용약관 및 개인정보 처리방침
          </router-link>
          에 동의합니다.
        </label>
      </div>

      <!-- 가입 버튼 -->
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded mt-4 btn-join-ok"
      >
        회원가입
      </button>

      <!-- 에러 메시지 -->
      <div v-if="errorMessage" class="text-red-500 mt-2 text-sm text-center">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { auth, db, storage } from "@/firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

/* 상태 변수 */
const router = useRouter();
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const nickname = ref("");
const agree = ref(false);
const errorMessage = ref("");
const selectedFile = ref<File | null>(null);
const previewImage = ref("");
const emailSent = ref(false);
const defaultImage = "https://cdn.lunest.app/avatars/default1.png";

/* 파일 선택 시 미리보기 */
function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
    previewImage.value = URL.createObjectURL(selectedFile.value);
  }
}

/* 회원가입 처리 */
async function handleRegister() {
  errorMessage.value = "";

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "비밀번호가 일치하지 않습니다.";
    return;
  }
  if (!agree.value) {
    errorMessage.value = "약관에 동의해야 가입할 수 있습니다.";
    return;
  }

  try {
    // 1️⃣ Firebase Auth 생성
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    // 2️⃣ 프로필 이미지 업로드
    let photoURL = defaultImage;
    if (selectedFile.value) {
      const filePath = `profiles/${user.uid}_${Date.now()}`;
      const fileRef = storageRef(storage, filePath);
      await uploadBytes(fileRef, selectedFile.value);
      photoURL = await getDownloadURL(fileRef);
    }

    // 3️⃣ 사용자 프로필 업데이트
    await updateProfile(user, {
      displayName: nickname.value,
      photoURL,
    });

    // 4️⃣ Firestore 사용자 문서 생성
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: nickname.value,
      photoURL,
      createdAt: new Date(),
      verified: false,
    });

    // 5️⃣ 인증 이메일 발송
    await sendEmailVerification(user);
    emailSent.value = true; // UI 전환
    console.log("✅ 이메일 인증 발송 완료");

    // 6️⃣ 기본 그룹 생성 (옵션)
    const groupsRef = collection(db, "users", user.uid, "groups");
    await addDoc(groupsRef, {
      groupName: "기본 그룹",
      createdAt: new Date(),
    });
  } catch (err: any) {
    console.error("🚫 회원가입 실패:", err);
    errorMessage.value = "회원가입 중 오류가 발생했습니다.";
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
</style>