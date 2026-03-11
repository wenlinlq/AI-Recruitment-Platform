<template>
  <div class="positions-container">
    <div class="search-bar">
      <el-input v-model="searchQuery" placeholder="搜索职位" prefix-icon="Search">
        <template #append>
          <el-button type="primary" @click="searchPositions">搜索</el-button>
        </template>
      </el-input>
      <el-select v-model="filterType" placeholder="职位类型" style="margin-left: 10px;">
        <el-option label="全部" value="" />
        <el-option label="实习" value="实习" />
        <el-option label="全职" value="全职" />
        <el-option label="兼职" value="兼职" />
      </el-select>
    </div>

    <el-card v-for="position in positions" :key="position._id" class="position-card">
      <template #header>
        <div class="position-header">
          <h3>{{ position.title }}</h3>
          <el-tag :type="position.type === '实习' ? 'info' : position.type === '全职' ? 'success' : 'warning'">
            {{ position.type }}
          </el-tag>
        </div>
      </template>
      <div class="position-body">
        <p class="requirements">{{ position.requirements }}</p>
        <p class="responsibilities">{{ position.responsibilities }}</p>
        <div class="position-footer">
          <span class="deadline">截止日期：{{ position.deadline }}</span>
          <el-button type="primary" size="small" @click="goToPositionDetail(position._id)">
            查看详情
          </el-button>
        </div>
      </div>
    </el-card>

    <div v-if="positions.length === 0" class="empty-state">
      <el-empty description="暂无职位" />
    </div>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()
const positions = ref([])
const searchQuery = ref('')
const filterType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchPositions = async () => {
  const response = await api.positions.getList()
  if (response.success) {
    positions.value = response.data
    total.value = response.data.length
  }
}

const searchPositions = () => {
  // 模拟搜索功能
  console.log('搜索:', searchQuery.value, filterType.value)
}

const goToPositionDetail = (id) => {
  router.push(`/position/${id}`)
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (current) => {
  currentPage.value = current
}

onMounted(() => {
  fetchPositions()
})
</script>

<style scoped>
.positions-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
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

.requirements,
.responsibilities {
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

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>