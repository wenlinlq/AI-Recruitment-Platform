<template>
  <div class="admin-container">
    <el-container>
      <el-aside width="200px" class="admin-sidebar">
        <el-menu :default-active="activeMenu" class="admin-menu" router>
          <el-menu-item index="/admin/users">
            <el-icon><UserFilled /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/teams">
            <el-icon><Avatar /></el-icon>
            <span>团队管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/stats">
            <el-icon><DataAnalysis /></el-icon>
            <span>数据统计</span>
          </el-menu-item>
          <el-menu-item index="/admin/settings">
            <el-icon><Setting /></el-icon>
            <span>系统配置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="admin-header">
          <h1>系统管理后台</h1>
        </el-header>
        <el-main class="admin-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import {
  UserFilled,
  Avatar,
  DataAnalysis,
  Setting,
} from "@element-plus/icons-vue";

const route = useRoute();
const activeMenu = computed(() => route.path);
</script>

<style scoped>
.admin-container {
  height: 100vh;
  overflow: hidden;
}

.admin-sidebar {
  background: #f0f2f5;
  height: 100%;
}

.admin-menu {
  height: 100%;
  border-right: none;
}

.admin-header {
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.admin-header h1 {
  margin: 0;
  font-size: 20px;
}

.admin-main {
  padding: 20px;
  overflow-y: auto;
}
</style>
