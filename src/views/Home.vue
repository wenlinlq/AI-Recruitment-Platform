<template>
  <div class="home">
    <!-- 英雄区 -->
    <div class="hero-section">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <h1 class="hero-title">学生团队招聘系统</h1>
        <p class="hero-subtitle">AI 助力，找到最适合你的团队</p>
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索职位、技能或团队..."
            prefix-icon="Search"
            class="search-input"
            size="large"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button type="primary" @click="handleSearch" class="search-btn">
                搜索
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 轮播区 -->
    <div class="section carousel-section">
      <div class="section-inner">
        <el-carousel :interval="4500" type="card" height="320px" indicator-position="outside">
          <el-carousel-item v-for="(item, idx) in carouselItems" :key="item.id">
            <div class="carousel-item" :class="`carousel-gradient-${(idx % 3) + 1}`">
              <span class="carousel-label">招新进行中</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <!-- AI 功能 -->
    <div class="section features-section">
      <div class="section-inner">
        <h2 class="section-title">
          <span class="section-icon">✨</span>
          AI 增强功能
        </h2>
        <div class="feature-grid">
          <div class="feature-card" v-for="feat in features" :key="feat.title">
            <div class="feature-icon-wrap" :style="{ background: feat.gradient }">
              <el-icon class="feature-icon"><component :is="feat.icon" /></el-icon>
            </div>
            <h3>{{ feat.title }}</h3>
            <p>{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据看板 -->
    <div class="section stats-section">
      <div class="section-inner">
        <h2 class="section-title">
          <span class="section-icon">📊</span>
          招新数据看板
        </h2>
        <div class="stats-grid">
          <div class="stat-card" v-for="(stat, idx) in statList" :key="stat.label">
            <div class="stat-icon" :class="`stat-icon-${idx}`">
              <el-icon><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门团队 & 推荐职位 -->
    <div class="section positions-section">
      <div class="section-inner">
        <h2 class="section-title">
          <span class="section-icon">🔥</span>
          热门职位
        </h2>
        <div class="position-grid">
          <el-card
            v-for="position in recentPositions"
            :key="position._id"
            class="position-card"
            shadow="hover"
            @click="goToPositionDetail(position._id)"
          >
            <template #header>
              <div class="position-header">
                <span class="position-title">{{ position.title }}</span>
                <el-tag size="small" :type="position.type === '实习' ? 'info' : 'success'" round>
                  {{ position.type }}
                </el-tag>
              </div>
            </template>
            <p class="position-desc">{{ position.requirements }}</p>
            <div class="position-meta">
              <span class="deadline">
                <el-icon><Clock /></el-icon>
                {{ position.deadline }} 截止
              </span>
              <el-button type="primary" size="small" link>查看详情 →</el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  Document,
  ChatDotRound,
  MagicStick,
  OfficeBuilding,
  Briefcase,
  UserFilled,
  Clock,
} from "@element-plus/icons-vue";
import api from "../api";

const router = useRouter();
const recentPositions = ref([]);
const searchQuery = ref("");

const stats = ref({
  teams: 12,
  positions: 35,
  applications: 256,
});

const statList = computed(() => [
  { icon: OfficeBuilding, value: stats.value.teams, label: "招募团队" },
  { icon: Briefcase, value: stats.value.positions, label: "开放职位" },
  { icon: UserFilled, value: stats.value.applications, label: "已投递人数" },
]);

const features = [
  {
    icon: Document,
    title: "AI 简历解析",
    desc: "自动提取简历信息，智能分析技能匹配度",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    icon: ChatDotRound,
    title: "AI 模拟面试",
    desc: "实时生成面试问题，提供专业反馈",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    icon: MagicStick,
    title: "简历优化",
    desc: "AI 驱动的简历改进建议，提升竞争力",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
];

const carouselItems = [
  { id: 1, title: "加入我们的学生团队", description: "与优秀的同学一起成长，共同打造精彩项目" },
  { id: 2, title: "AI 助力招聘", description: "智能匹配，让你的才华得到更好的展示" },
  { id: 3, title: "丰富的实习机会", description: "提前接触行业，积累宝贵经验" },
];

onMounted(async () => {
  const response = await api.positions.getList();
  if (response.success) {
    recentPositions.value = response.data.slice(0, 3);
  }
});

const goToPositionDetail = (id) => {
  router.push(`/position/${id}`);
};

const handleSearch = () => {
  if (searchQuery.value) {
    router.push({ path: "/positions", query: { search: searchQuery.value } });
  }
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f7f8fc;
}

/* 英雄区 */
.hero-section {
  position: relative;
  padding: 100px 24px 80px;
  text-align: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
}

.hero-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.6;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}

.hero-title {
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
  letter-spacing: 1px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
}

.hero-subtitle {
  font-size: clamp(16px, 2.5vw, 20px);
  color: rgba(255, 255, 255, 0.92);
  margin: 0 0 36px;
  font-weight: 400;
}

.search-box {
  max-width: 560px;
  margin: 0 auto;
}

.search-box :deep(.el-input-group) {
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.search-box :deep(.el-input__wrapper) {
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 28px 0 0 28px;
}

.search-btn {
  padding: 0 28px !important;
  font-weight: 500;
}

/* 通用区块 */
.section {
  padding: 64px 24px;
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 26px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 40px;
}

.section-icon {
  font-size: 28px;
}

/* 轮播 */
.carousel-section {
  padding-top: 48px;
}

.carousel-section :deep(.el-carousel__item) {
  border-radius: 16px;
  overflow: hidden;
}

.carousel-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-align: center;
  padding: 40px 32px;
}

.carousel-gradient-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.carousel-gradient-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.carousel-gradient-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.carousel-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.9;
  margin-bottom: 12px;
}

.carousel-item h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px;
}

.carousel-item p {
  font-size: 15px;
  line-height: 1.6;
  opacity: 0.95;
  margin: 0;
}

/* AI 功能卡片 */
.features-section {
  background: #fff;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
}

.feature-card {
  text-align: center;
  padding: 40px 28px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #eee;
  transition: all 0.35s ease;
  cursor: default;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
  border-color: transparent;
}

.feature-icon-wrap {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon {
  font-size: 36px;
  color: #fff;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 10px;
}

.feature-card p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* 数据看板 */
.stats-section {
  padding: 48px 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  padding: 32px 28px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon .el-icon {
  font-size: 26px;
  color: #fff;
}

.stat-icon-0 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon-1 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon-2 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

/* 职位卡片 */
.positions-section {
  background: #fff;
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.position-card {
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.position-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.position-card :deep(.el-card__header) {
  padding: 18px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.position-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.position-title {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a2e;
  flex: 1;
}

.position-card :deep(.el-card__body) {
  padding: 20px;
}

.position-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.position-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deadline {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #94a3b8;
}

.deadline .el-icon {
  font-size: 14px;
}
</style>
