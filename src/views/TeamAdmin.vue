<template>
  <div class="team-admin-container">
    <el-container>
      <el-aside width="200px" class="team-admin-sidebar">
        <el-menu
          :default-active="activeMenu"
          class="team-admin-menu"
          router
        >
          <el-menu-item index="/team-admin/dashboard">
            <el-icon><DataBoard /></el-icon>
            <span>团队仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/team-admin/positions">
            <el-icon><Briefcase /></el-icon>
            <span>职位管理</span>
          </el-menu-item>
          <el-menu-item index="/team-admin/candidates">
            <el-icon><User /></el-icon>
            <span>候选人管理</span>
          </el-menu-item>
          <el-menu-item index="/team-admin/ai-interview">
            <el-icon><ChatDotRound /></el-icon>
            <span>AI面试中心</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="team-admin-header">
          <h1>团队管理后台</h1>
        </el-header>
        <el-main class="team-admin-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { DataBoard, Briefcase, User, ChatDotRound } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.team-admin-container {
  height: 100vh;
  overflow: hidden;
}

.team-admin-sidebar {
  background: #f0f2f5;
  height: 100%;
}

.team-admin-menu {
  height: 100%;
  border-right: none;
}

.team-admin-header {
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.team-admin-header h1 {
  margin: 0;
  font-size: 20px;
}

.team-admin-main {
  padding: 20px;
  overflow-y: auto;
}
</style>