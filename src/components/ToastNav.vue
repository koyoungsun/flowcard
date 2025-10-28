<template>
    <transition name="slide">
      <aside
        v-if="isOpen"
        class="fixed top-0 right-0 w-64 h-full bg-white shadow-lg flex flex-col justify-between z-50"
      >
        <!-- 상단: 프로필 -->
        <div class="p-6">
          <div class="flex items-center mb-6">
            <img
              v-if="user?.photoURL"
              :src="user.photoURL"
              alt="Profile"
              class="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p class="font-semibold">{{ user?.displayName || "Guest" }}</p>
              <p class="text-xs text-gray-500">{{ user?.email }}</p>
            </div>
          </div>
  
          <!-- 메뉴 -->
          <ul class="space-y-3 text-sm">
            <li><button @click="$emit('go', 'home')">🏠 내 링크 관리</button></li>
            <li><button @click="$emit('go', 'settings')">⚙️ 설정</button></li>
            <li><button @click="$emit('go', 'profile')">👤 내 정보</button></li>
          </ul>
        </div>
  
        <!-- 하단: 로그아웃 + 브랜드 -->
        <div class="p-6 border-t border-gray-200">
          <button
            @click="logout"
            class="text-red-500 font-medium hover:underline w-full text-left mb-3"
          >
            🚪 로그아웃
          </button>
  
          <p class="text-xs text-gray-400 leading-tight text-center">
            ver. 0.1.0<br />
            © <strong>LUNEST</strong><br />
            <em>From Seeds to Systems.</em>
          </p>
        </div>
      </aside>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { getAuth, signOut } from "firebase/auth";
  import { useRouter } from "vue-router";
  
  defineProps<{ isOpen: boolean }>();
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  
  function logout() {
    signOut(auth)
      .then(() => {
        console.log("🚪 로그아웃 성공");
        router.push("/login");
      })
      .catch((err) => console.error("로그아웃 실패:", err));
  }
  </script>
  
  <style scoped>
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s ease;
  }
  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(100%);
  }
  </style>