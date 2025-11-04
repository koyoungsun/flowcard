// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
import Home from "@/pages/Home.vue";
import AddCard from "@/pages/AddCard.vue";
import EditCard from "@/pages/EditCard.vue";
import Login from "@/pages/Login.vue";
import Me from "@/pages/Me.vue";
import CardList from "@/pages/CardList.vue";
import Welcome from "@/pages/Welcome.vue";
import Register from "@/pages/Register.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

/* 전역 로딩 상태 (App.vue와 공유용) */
export const isPageLoading = ref(false);

/* 라우트 정의 */
const routes = [
  // 🔸 비로그인 기본 페이지
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
    meta: { hideHeader: true },
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

  // 카드 추가 / 수정
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

  // 로그인 / 회원가입 / 이메일 인증 안내
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { hideHeader: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { hideHeader: true },
  },
  {
    path: "/verify-email",
    name: "VerifyEmail",
    component: () => import("@/views/VerifyEmail.vue"),
    meta: { hideHeader: true },
  },

  // 그룹 설정
  {
    path: "/group-settings",
    name: "GroupSettings",
    component: () => import("@/pages/GroupSettings.vue"),
    meta: { requiresAuth: true },
  },

  // 약관 및 개인정보 처리방침
  {
    path: "/policy",
    name: "Policy",
    component: () => import("@/views/Policy.vue"),
    meta: { public: true, authLayout: true, hideHeader: true },
  },

  // 404 페이지
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
    meta: { public: true, hideHeader: true },
  },
];

/* 라우터 인스턴스 생성 */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* Firebase 인증 상태 관리 */
let isAuthChecked = false;
let currentUser: any = null;

/* 인증 확인 함수 */
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

/* 전역 가드 */
router.beforeEach(async (to, from, next) => {
  isPageLoading.value = true;

  const auth = getAuth();
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  const isPublic = to.matched.some((r) => r.meta.public);

  if (!isAuthChecked) await getAuthState();

  const isLoggedIn = !!auth.currentUser;

  if (requiresAuth && !isLoggedIn) {
    next("/");
  } else if (isLoggedIn && ["/", "/login", "/register"].includes(to.path)) {
    next("/home");
  } else {
    next();
  }
});

/* 전환 후 로딩 해제 */
router.afterEach(() => {
  setTimeout(() => {
    isPageLoading.value = false;
  }, 300);
});

export default router;