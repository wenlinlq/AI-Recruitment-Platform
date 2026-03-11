<script setup>
import { RouterView } from "vue-router";
import { useUserStore } from "./store";

const userStore = useUserStore();
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <h1>学生团队招聘系统</h1>
        </div>
        <nav class="nav">
          <router-link to="/" class="nav-item">首页</router-link>
          <router-link to="/positions" class="nav-item">招新大厅</router-link>
          <router-link to="/ai-interview" class="nav-item"
            >AI面试模拟</router-link
          >
          <router-link to="/profile" class="nav-item">个人中心</router-link>
          <router-link
            v-if="userStore.userRole === 'admin'"
            to="/admin"
            class="nav-item"
            >管理后台</router-link
          >
          <router-link
            v-if="userStore.userRole === 'team'"
            to="/team-admin/dashboard"
            class="nav-item"
            >团队管理</router-link
          >
          <div v-if="!userStore.isLoggedIn" class="auth-buttons">
            <router-link to="/login" class="nav-item">登录</router-link>
            <router-link to="/register" class="nav-item nav-button"
              >注册</router-link
            >
          </div>
          <div v-else class="user-info">
            <span class="user-name">{{ userStore.user?.username }}</span>
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-avatar :size="32" :src="userStore.user?.avatar">
                  {{ userStore.user?.username?.[0] }}
                </el-avatar>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="userStore.logout()"
                    >退出登录</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </nav>
      </div>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
    <footer class="app-footer">
      <p>© 2026 学生团队招聘系统（AI增强版）</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.logo h1 {
  font-size: 20px;
  color: #667eea;
  margin: 0;
}

.nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-item {
  text-decoration: none;
  color: #333;
  font-size: 14px;
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: #667eea;
}

.nav-button {
  background: #667eea;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
}

.nav-button:hover {
  background: #5a6fd8;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  font-size: 14px;
  color: #333;
}

.app-main {
  flex: 1;
  padding-bottom: 40px;
}

.app-footer {
  background: #f8f9fa;
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: auto;
}
</style>
