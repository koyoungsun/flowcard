import { createRouter, createWebHistory } from "vue-router";

import Home from "@/pages/Home.vue";
import AddCard from "@/pages/AddCard.vue";
import EditCard from "@/pages/EditCard.vue";
import Login from "@/pages/Login.vue";
import Me from "@/pages/Me.vue";
import CardList from "@/pages/CardList.vue";


const routes = [
  { path: "/", component: Home },
  { path: "/add", component: AddCard },
  { path: "/edit", component: EditCard },
  { path: "/edit/:index", component: EditCard },
  { path: "/login", component: Login },
  { path: "/me", component: Me },
  { path: "/list", component: CardList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;