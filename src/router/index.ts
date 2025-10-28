// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import AddCard from "@/pages/AddCard.vue";
import EditCard from "@/pages/EditCard.vue";
import Login from "@/pages/Login.vue";
import Me from "@/pages/Me.vue";
import CardList from "@/pages/CardList.vue";
import Welcome from "@/pages/Welcome.vue";
import Register from "@/pages/Register.vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

// ✅ 라우트 정의
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/welcome",
    name: "Welcome",
    component: Welcome,
  },
  {
    path: "/me",
    name: "Me",
    component: Me,
    meta: { requiresAuth: true },
  },
  {
    path: "/list",
    name: "CardList",
    component: CardList,
    meta: { requiresAuth: true },
  },

  // ✅ Firestore 그룹 기반 카드 추가
  {
    path: "/add/:groupId",
    name: "AddCard",
    component: AddCard,
    props: true,
    meta: { requiresAuth: true },
  },

  // ✅ Firestore 카드 수정 (groupId + cardId 기반)
  {
    path: "/edit/:groupId/:cardId",
    name: "EditCard",
    component: EditCard,
    props: route => ({
      groupId: route.params.groupId as string,
      cardId: route.params.cardId as string,
    }),
    meta: { requiresAuth: true },
  },

  // ✅ 그룹 설정 페이지 (선택적)
  {
    path: "/group-settings",
    name: "GroupSettings",
    component: () => import("@/pages/GroupSettings.vue"),
    meta: { requiresAuth: true },
  },

  // ✅ /home 접근 시 자동 리디렉션 (오류 방지)
  {
    path: "/home",
    redirect: "/",
  },

  // ✅ 존재하지 않는 경로 → 홈으로 리디렉션
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

// ✅ 라우터 인스턴스 생성
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Firebase 인증 상태 캐시
let isAuthReady = false;
let currentUser: any = null;

// ✅ 인증 상태 구독
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  isAuthReady = true;
});

// ✅ 인증 가드
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // 아직 인증 상태를 모르면 일시 대기
  if (!isAuthReady) {
    const unwatch = onAuthStateChanged(auth, (user) => {
      currentUser = user;
      isAuthReady = true;
      unwatch();
      proceed();
    });
  } else {
    proceed();
  }

  // 라우팅 진행 함수
  function proceed() {
    if (requiresAuth && !currentUser) {
      next("/login");
    } else if ((to.path === "/login" || to.path === "/register") && currentUser) {
      next("/");
    } else {
      next();
    }
  }
});

export default router;