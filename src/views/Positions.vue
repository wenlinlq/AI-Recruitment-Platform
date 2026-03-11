<template>
  <div class="positions-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">📋</span>
          招新大厅
        </h1>
        <p class="page-subtitle">浏览所有开放职位，找到最适合你的机会</p>
      </div>
    </div>

    <!-- 筛选栏 - 浮动卡片 -->
    <div class="filter-section">
      <div class="filter-card">
        <div class="search-row">
          <div class="search-box">
            <el-icon class="search-icon"><Search /></el-icon>
            <input
              v-model="searchQuery"
              type="text"
              class="search-field"
              placeholder="搜索职位、技能或团队..."
              @keyup.enter="searchPositions"
            />
            <el-button
              v-if="searchQuery"
              class="clear-btn"
              link
              circle
              @click="searchQuery = ''"
            >
              <el-icon><CircleClose /></el-icon>
            </el-button>
          </div>
          <button class="search-btn" @click="searchPositions">
            <el-icon><Search /></el-icon>
            <span>搜索</span>
          </button>
        </div>
        <div class="filter-row">
          <span class="filter-label">职位类型</span>
          <div class="filter-chips">
            <button
              v-for="opt in typeOptions"
              :key="opt.value"
              class="chip"
              :class="{ active: filterType === opt.value }"
              @click="filterType = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
          <button
            v-if="searchQuery || filterType"
            class="reset-btn"
            @click="handleReset"
          >
            重置筛选
          </button>
        </div>
      </div>
    </div>

    <!-- 职位列表 -->
    <div class="content-section">
      <div class="content-inner">
        <div v-if="positions.length > 0" class="results-info">
          共找到 <strong>{{ total }}</strong> 个职位
        </div>

        <div class="position-grid">
          <el-card
            v-for="position in displayPositions"
            :key="position._id"
            class="position-card"
            shadow="hover"
            @click="goToPositionDetail(position._id)"
          >
            <template #header>
              <div class="card-header">
                <span class="position-title">{{ position.title }}</span>
                <el-tag size="small" :type="getTagType(position.type)" round>
                  {{ position.type }}
                </el-tag>
              </div>
            </template>
            <p class="position-requirements">{{ position.requirements }}</p>
            <p class="position-responsibilities">
              {{ position.responsibilities }}
            </p>
            <div class="card-footer">
              <span class="deadline">
                <el-icon><Clock /></el-icon>
                {{ position.deadline }} 截止
              </span>
              <el-button type="primary" size="small" link>查看详情 →</el-button>
            </div>
          </el-card>
        </div>

        <div v-if="positions.length === 0 && !loading" class="empty-state">
          <el-empty description="暂无职位，敬请期待">
            <template #image>
              <div class="empty-icon">📭</div>
            </template>
          </el-empty>
        </div>

        <div v-if="total > pageSize" class="pagination-wrap">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Clock, Search, CircleClose } from "@element-plus/icons-vue";
import api from "../api";

const router = useRouter();
const route = useRoute();
const positions = ref([]);
const searchQuery = ref("");
const filterType = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(false);

const filteredPositions = computed(() => {
  let list = positions.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.requirements?.toLowerCase().includes(q),
    );
  }
  if (filterType.value) {
    list = list.filter((p) => p.type === filterType.value);
  }
  return list;
});

const total = computed(() => filteredPositions.value.length);

const displayPositions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredPositions.value.slice(start, start + pageSize.value);
});

const typeOptions = [
  { label: "全部", value: "" },
  { label: "实习", value: "实习" },
  { label: "全职", value: "全职" },
  { label: "兼职", value: "兼职" },
];

const getTagType = (type) => {
  const map = { 实习: "info", 全职: "success", 兼职: "warning" };
  return map[type] || "info";
};

const fetchPositions = async () => {
  loading.value = true;
  const response = await api.positions.getList();
  if (response.success) {
    positions.value = response.data || [];
  }
  loading.value = false;
};

const searchPositions = () => {
  currentPage.value = 1;
};

const handleReset = () => {
  searchQuery.value = "";
  filterType.value = "";
  currentPage.value = 1;
};

const goToPositionDetail = (id) => {
  router.push(`/position/${id}`);
};

const handleSizeChange = () => {
  currentPage.value = 1;
};

const handleCurrentChange = () => {};

watch([searchQuery, filterType], () => {
  currentPage.value = 1;
});

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
  fetchPositions();
});
</script>

<style scoped>
.positions-page {
  min-height: 100vh;
  background: #f7f8fc;
  padding-bottom: 48px;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48px 24px;
  color: #fff;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
  letter-spacing: 0.5px;
}

.title-icon {
  font-size: 32px;
}

.page-subtitle {
  font-size: 15px;
  opacity: 0.9;
  margin: 0;
}

/* 筛选区 - 浮动卡片 */
.filter-section {
  padding: 0 24px;
  margin-top: -28px;
  position: relative;
  z-index: 10;
}

.filter-card {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(102, 126, 234, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 24px 28px;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* 搜索框 */
.search-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.25s ease;
}

.search-box:focus-within {
  background: #fff;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.search-icon {
  font-size: 20px;
  color: #94a3b8;
  flex-shrink: 0;
}

.search-box:focus-within .search-icon {
  color: #667eea;
}

.search-field {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #1e293b;
  outline: none;
}

.search-field::placeholder {
  color: #94a3b8;
}

.clear-btn {
  color: #94a3b8 !important;
  padding: 4px !important;
}

.clear-btn:hover {
  color: #64748b !important;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.search-btn:active {
  transform: translateY(0);
}

.search-btn .el-icon {
  font-size: 18px;
}

/* 筛选标签 */
.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 13px;
  color: #64748b;
  flex-shrink: 0;
}

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip:hover {
  border-color: #667eea;
  color: #667eea;
}

.chip.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #fff;
}

.reset-btn {
  margin-left: auto;
  padding: 6px 12px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
}

.reset-btn:hover {
  color: #667eea;
}

/* 内容区 */
.content-section {
  padding: 32px 24px;
}

.content-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.results-info {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

.results-info strong {
  color: #667eea;
  font-weight: 600;
}

/* 职位卡片网格 */
.position-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
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
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.card-header {
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

.position-requirements,
.position-responsibilities {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.position-responsibilities {
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
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

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 24px;
  background: #fff;
  border-radius: 16px;
  border: 1px dashed #e2e8f0;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

/* 分页 */
.pagination-wrap {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.pagination-wrap :deep(.el-pagination) {
  --el-pagination-button-bg-color: #fff;
}

@media (max-width: 768px) {
  .filter-section {
    margin-top: -20px;
    padding: 0 16px;
  }

  .filter-card {
    padding: 20px;
  }

  .search-row {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
  }

  .filter-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .reset-btn {
    margin-left: 0;
  }

  .position-grid {
    grid-template-columns: 1fr;
  }
}
</style>
