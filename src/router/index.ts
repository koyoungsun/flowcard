import { createRouter, createWebHistory } from "vue-router";

import Home from "@/pages/Home.vue";
import AddCard from "@/pages/AddCard.vue";
import EditCard from "@/pages/EditCard.vue";
import Login from "@/pages/Login.vue";
import Me from "@/pages/Me.vue";
import CardList from "@/pages/CardList.vue";


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: "/login", component: Login },
  { path: "/me", component: Me },
  { path: "/list", component: CardList },
  {
    path: '/add/:groupIndex',
    name: 'AddCard',
    component: AddCard
  },
  {
    path: '/edit/:groupIndex/:cardIndex',
    name: 'EditCard',
    component: () => import('@/views/EditCard.vue')
  },
  {
    path: '/group-settings',
    name: 'GroupSettings',
    component: () => import('@/pages/GroupSettings.vue')
  }
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;