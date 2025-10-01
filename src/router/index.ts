import { createRouter, createWebHistory } from "vue-router";

import Home from "@/pages/Home.vue";
import AddCard from "@/pages/AddCard.vue";
import EditCard from "@/pages/EditCard.vue";
import Login from "@/pages/Login.vue";
import Me from "@/pages/Me.vue";
import CardList from "@/pages/CardList.vue";
import Welcome from "@/pages/Welcome.vue"; 
import Register from "@/pages/Register.vue";

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/welcome", name: "Welcome", component: Welcome }, // ✅ 리디렉션용


  {
    path: '/me',
    name: 'Me',
    component: Me,
    meta: { requiresAuth: true }
  },
  {
    path: '/list',
    name: 'CardList',
    component: CardList,
    meta: { requiresAuth: true }
  },
  {
    path: '/add/:groupIndex',
    name: 'AddCard',
    component: AddCard,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit/:groupIndex/:cardIndex',
    name: 'EditCard',
    component: EditCard,
    props: route => ({
      groupIndex: Number(route.params.groupIndex),
      cardIndex: Number(route.params.cardIndex)
    }),
    meta: { requiresAuth: true }
  },
  {
    path: '/group-settings',
    name: 'GroupSettings',
    component: () => import('@/pages/GroupSettings.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase"

let currentUser: any = null

onAuthStateChanged(auth, (user) => {
  currentUser = user
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) {
    next('/login') // 인증이 필요한데 로그인 안 된 경우
  } else {
    next() // 통과
  }
})