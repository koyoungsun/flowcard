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
import { getAuth, onAuthStateChanged } from "firebase/auth";

/* ✅ 라우트 정의 */
const routes = [
  // 🔸 비로그인 기본 페이지 (소개 / 웰컴)
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
  },

  // 🔒 로그인 후 내부 페이지
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/list",
    name: "CardList",
    component: CardList,
    meta: { requiresAuth: true },
  },
  {
    path: "/me",
    name: "Me",
    component: Me,
    meta: { requiresAuth: true },
  },

  // ✅ 카드 추가 / 수정
  {
    path: "/add/:groupId",
    name: "AddCard",
    component: AddCard,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit/:groupId/:cardId",
    name: "EditCard",
    component: EditCard,
    props: (route) => ({
      groupId: route.params.groupId as string,
      cardId: route.params.cardId as string,
    }),
    meta: { requiresAuth: true },
  },

  // ✅ 로그인 / 회원가입
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

  // ✅ 그룹 설정 페이지
  {
    path: "/group-settings",
    name: "GroupSettings",
    component: () => import("@/pages/GroupSettings.vue"),
    meta: { requiresAuth: true },
  },

  // ✅ 약관 및 개인정보 처리방침 페이지 (공개 접근)
  {
    path: "/policy",
    name: "Policy",
    component: () => import("@/views/Policy.vue"),
    meta: { public: true }, // 🔹 로그인 불필요하게 처리
  },

  // ✅ 존재하지 않는 경로 → 웰컴 리디렉션
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

/* ✅ 라우터 인스턴스 생성 */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* ✅ Firebase 인증 상태 관리 */
let isAuthChecked = false;
let currentUser: any = null;

/* 🔐 인증 확인 함수 */
function getAuthState() {
  const auth = getAuth();
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      currentUser = user;
      isAuthChecked = true;
      unsubscribe();
      resolve(user);
    });
  });
}

/* ✅ 전역 인증 가드 */
router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isPublic = to.matched.some((record) => record.meta.public);

  // Firebase 상태 미확인 시 대기
  if (!isAuthChecked) {
    await getAuthState();
  }

  const isLoggedIn = !!auth.currentUser;

  // 🚫 로그인 필요 페이지 접근 시 → 웰컴으로 이동
  if (requiresAuth && !isLoggedIn) {
    next("/");
  }
  // 🚫 로그인 상태에서 로그인/회원가입/웰컴 진입 → 홈으로 리디렉션
  else if (isLoggedIn && ["/", "/login", "/register"].includes(to.path)) {
    next("/home");
  }
  // ✅ 약관 등 공개 페이지는 항상 허용
  else if (isPublic) {
    next();
  }
  // ✅ 정상 이동
  else {
    next();
  }
});

export default router;