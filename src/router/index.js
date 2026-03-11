import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../store";
import { ElMessage } from "element-plus";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/positions",
    name: "Positions",
    component: () => import("../views/Positions.vue"),
  },
  {
    path: "/position/:id",
    name: "PositionDetail",
    component: () => import("../views/PositionDetail.vue"),
  },
  {
    path: "/ai-interview",
    name: "AIInterview",
    component: () => import("../views/AIInterview.vue"),
  },
  {
    path: "/applications",
    name: "Applications",
    component: () => import("../views/Applications.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
  },
  {
    path: "/team-admin",
    name: "TeamAdmin",
    component: () => import("../views/TeamAdmin.vue"),
    children: [
      {
        path: "dashboard",
        name: "TeamDashboard",
        component: () => import("../views/team-admin/Dashboard.vue"),
      },
      {
        path: "positions",
        name: "TeamPositions",
        component: () => import("../views/team-admin/Positions.vue"),
      },
      {
        path: "candidates",
        name: "TeamCandidates",
        component: () => import("../views/team-admin/Candidates.vue"),
      },
      {
        path: "ai-interview",
        name: "TeamAIInterview",
        component: () => import("../views/team-admin/AIInterviewCenter.vue"),
      },
    ],
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("../views/Admin.vue"),
    children: [
      {
        path: "users",
        name: "UserManagement",
        component: () => import("../views/admin/UserManagement.vue"),
      },
      {
        path: "teams",
        name: "TeamManagement",
        component: () => import("../views/admin/TeamManagement.vue"),
      },
      {
        path: "stats",
        name: "Statistics",
        component: () => import("../views/admin/Statistics.vue"),
      },
      {
        path: "settings",
        name: "SystemSettings",
        component: () => import("../views/admin/SystemSettings.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isLoggedIn = userStore.isLoggedIn;

  // 不需要登录的页面
  const publicPages = ["/", "/login", "/register"];
  const isPublicPage = publicPages.includes(to.path);

  // 如果访问的是公开页面，直接放行
  if (isPublicPage) {
    next();
    return;
  }

  // 如果未登录且访问非公开页面，跳转到登录页
  if (!isLoggedIn) {
    ElMessage.warning("请先登录");
    setTimeout(() => {
      next("/login");
    }, 1000);
  } else {
    // 如果已登录，放行
    next();
  }
});

export default router;
