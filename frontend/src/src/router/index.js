import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/auth/RegisterView.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/groups",
    name: "Groups",
    component: () => import("@/views/GroupsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/groups/:id",
    name: "GroupDetail",
    component: () => import("@/views/GroupDetailView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/collaboration/:groupId?",
    name: "Collaboration",
    component: () => import("@/views/CollaborationView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/ProfileView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫 - 需要成员A完成认证后集成
router.beforeEach((to, from, next) => {
  // 临时模拟认证状态
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
