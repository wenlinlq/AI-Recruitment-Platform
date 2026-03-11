<template>
  <div class="home">
    <div class="search-section">
      <div class="search-container">
        <h1>学生团队招聘系统</h1>
        <p>AI助力，找到最适合你的团队</p>
        <el-input
          v-model="searchQuery"
          placeholder="搜索职位、技能或团队"
          prefix-icon="Search"
          class="search-input"
        >
          <template #append>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>
    <el-carousel :interval="5000" type="card" height="400px">
      <el-carousel-item v-for="item in carouselItems" :key="item.id">
        <div class="carousel-item">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="features">
      <h2>AI增强功能</h2>
      <div class="feature-list">
        <div class="feature-item">
          <el-icon class="feature-icon"><Document /></el-icon>
          <h3>AI简历解析</h3>
          <p>自动提取简历信息，智能分析技能匹配度</p>
        </div>
        <div class="feature-item">
          <el-icon class="feature-icon"><ChatDotRound /></el-icon>
          <h3>AI模拟面试</h3>
          <p>实时生成面试问题，提供专业反馈</p>
        </div>

        <div class="feature-item">
          <el-icon class="feature-icon"><MagicStick /></el-icon>
          <h3>简历优化</h3>
          <p>AI驱动的简历改进建议，提升竞争力</p>
        </div>
      </div>
    </div>

    <div class="recent-positions">
      <h2>热门团队</h2>
      <el-card
        v-for="position in recentPositions"
        :key="position._id"
        class="position-card"
      >
        <template #header>
          <div class="position-header">
            <h3>{{ position.title }}</h3>
            <el-tag :type="position.type === '实习' ? 'info' : 'success'">
              {{ position.type }}
            </el-tag>
          </div>
        </template>
        <div class="position-body">
          <p class="requirements">{{ position.requirements }}</p>
          <div class="position-footer">
            <span class="deadline">截止日期：{{ position.deadline }}</span>
            <el-button
              type="primary"
              size="small"
              @click="goToPositionDetail(position._id)"
            >
              查看详情
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
    <div class="recent-positions">
      <h2>推荐职位</h2>
      <el-card
        v-for="position in recentPositions"
        :key="position._id"
        class="position-card"
      >
        <template #header>
          <div class="position-header">
            <h3>{{ position.title }}</h3>
            <el-tag :type="position.type === '实习' ? 'info' : 'success'">
              {{ position.type }}
            </el-tag>
          </div>
        </template>
        <div class="position-body">
          <p class="requirements">{{ position.requirements }}</p>
          <div class="position-footer">
            <span class="deadline">截止日期：{{ position.deadline }}</span>
            <el-button
              type="primary"
              size="small"
              @click="goToPositionDetail(position._id)"
            >
              查看详情
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <div class="stats-dashboard">
      <h2>招新数据看板</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon">
            <el-icon><OfficeBuilding /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.teams }}</div>
            <div class="stat-label">招募团队</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <el-icon><Briefcase /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.positions }}</div>
            <div class="stat-label">开放职位</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.applications }}</div>
            <div class="stat-label">已投递人数</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  Document,
  ChatDotRound,
  DataAnalysis,
  MagicStick,
  Search,
  OfficeBuilding,
  Briefcase,
  UserFilled,
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

const carouselItems = [
  {
    id: 1,
    title: "加入我们的学生团队",
    description: "与优秀的同学一起成长，共同打造精彩项目",
  },
  {
    id: 2,
    title: "AI助力招聘",
    description: "智能匹配，让你的才华得到更好的展示",
  },
  {
    id: 3,
    title: "丰富的实习机会",
    description: "提前接触行业，积累宝贵经验",
  },
  {
    id: 4,
    title: "丰富的实习机会1",
    description: "提前接触行业，积累宝贵经验",
  },
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
  padding: 0;
}

.search-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
  text-align: center;
  color: white;
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
}

.search-container h1 {
  font-size: 36px;
  margin-bottom: 10px;
  font-weight: bold;
}

.search-container p {
  font-size: 18px;
  margin-bottom: 30px;
  opacity: 0.9;
}

.search-input {
  max-width: 600px;
  margin: 0 auto;
}

.search-input .el-input__inner {
  height: 50px;
  font-size: 16px;
  border-radius: 25px 0 0 25px;
}

.search-input .el-button {
  height: 50px;
  border-radius: 0 25px 25px 0;
  padding: 0 30px;
  font-size: 16px;
}

.stats-dashboard {
  padding: 60px 20px;
  background: #f8f9fa;
}

.stats-dashboard h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 24px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.stat-icon .el-icon {
  font-size: 28px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.carousel-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  text-align: center;
  padding: 0 40px;
}

.carousel-item h3 {
  font-size: 28px;
  margin-bottom: 20px;
}

.carousel-item p {
  font-size: 16px;
  line-height: 1.5;
}

.features {
  margin: 60px 0;
}

.features h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 24px;
  color: #333;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-item {
  text-align: center;
  padding: 30px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 48px;
  color: #667eea;
  margin-bottom: 20px;
}

.feature-item h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.feature-item p {
  color: #666;
  line-height: 1.5;
}

.recent-positions {
  margin: 60px 0;
}

.recent-positions h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 24px;
  color: #333;
}

.position-card {
  margin-bottom: 20px;
  transition: box-shadow 0.3s ease;
}

.position-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.position-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.position-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.requirements {
  margin: 15px 0;
  color: #666;
  line-height: 1.5;
}

.position-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.deadline {
  color: #999;
  font-size: 14px;
}
</style>
