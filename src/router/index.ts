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

const routes = [
  { path: "/", name: "Home", component: Home, meta: { requiresAuth: true } },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/welcome", name: "Welcome", component: Welcome },

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
  {
    path: "/add/:groupIndex",
    name: "AddCard",
    component: AddCard,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit/:groupIndex/:cardIndex",
    name: "EditCard",
    component: EditCard,
    props: route => ({
      groupIndex: Number(route.params.groupIndex),
      cardIndex: Number(route.params.cardIndex),
    }),
    meta: { requiresAuth: true },
  },
  {
    path: "/group-settings",
    name: "GroupSettings",
    component: () => import("@/pages/GroupSettings.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ 로그인 상태 캐시
let isAuthReady = false;
let currentUser: any = null;

// ✅ Firebase 인증 상태 확인
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  isAuthReady = true;
});

// ✅ 네비게이션 가드
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // 아직 Auth 초기화 안 된 경우 대기
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

  function proceed() {
    if (requiresAuth && !currentUser) {
      next("/login");
    } else if ((to.path === "/login" || to.path === "/register") && currentUser) {
      // 이미 로그인된 사용자가 로그인/회원가입 페이지 접근 시 홈으로 리디렉트
      next("/");
    } else {
      next();
    }
  }
});

export default router;