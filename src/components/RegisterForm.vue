<template>
  <form @submit.prevent="handleRegister" class="space-y-4">
    <div>
      <label class="block mb-1 text-sm font-medium">이메일</label>
      <input
        v-model="email"
        type="email"
        required
        class="w-full border rounded px-3 py-2"
        placeholder="이메일을 입력하세요"
      />
    </div>

    <div>
      <label class="block mb-1 text-sm font-medium">비밀번호</label>
      <input
        v-model="password"
        type="password"
        required
        minlength="6"
        class="w-full border rounded px-3 py-2"
        placeholder="비밀번호를 입력하세요 (6자 이상)"
      />
    </div>

    <button
      type="submit"
      class="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
    >
      회원가입
    </button>

    <div v-if="errorMessage" class="text-red-500 mt-2 text-sm text-center">
      {{ errorMessage }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

/* ✅ 회원가입 처리 */
async function handleRegister() {
  errorMessage.value = "";

  try {
    // 1️⃣ Firebase Auth 회원가입
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;

    console.log("✅ 회원가입 성공:", user.uid);

    // 2️⃣ Firestore에 users/{uid} 문서 생성
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
    });
    console.log("🪶 사용자 문서 생성 완료");

    // 3️⃣ 기본 그룹 생성
    const groupsRef = collection(db, "users", user.uid, "groups");
    await addDoc(groupsRef, {
      groupName: "기본 그룹",
      createdAt: new Date(),
    });
    console.log("🌱 기본 그룹 생성 완료");

    // 4️⃣ 홈으로 이동
    router.push("/home");
  } catch (err: any) {
    console.error("🚫 등록 실패:", err);
    errorMessage.value = err.message;
  }
}
</script>