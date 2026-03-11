<template>
  <div class="applications-container">
    <h2>我的申请</h2>
    <el-table :data="applications" style="width: 100%">
      <el-table-column prop="positionTitle" label="职位" width="200" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="applyDate" label="申请日期" width="150" />
      <el-table-column prop="aiMatch" label="AI匹配度" width="120">
        <template #default="scope">
          <div v-if="scope.row.aiMatch">
            <el-progress :percentage="scope.row.aiMatch" :color="getMatchColor(scope.row.aiMatch)" />
          </div>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="viewDetail(scope.row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="applications.length === 0" class="empty-state">
      <el-empty description="暂无申请记录" />
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
import api from '../api'

const applications = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 模拟申请数据
const mockApplications = [
  {
    _id: '1',
    positionTitle: '前端开发实习生',
    status: 'pending',
    applyDate: '2026-03-01',
    aiMatch: 85
  },
  {
    _id: '2',
    positionTitle: '后端开发实习生',
    status: 'interview',
    applyDate: '2026-02-28',
    aiMatch: 90
  },
  {
    _id: '3',
    positionTitle: 'UI设计实习生',
    status: 'rejected',
    applyDate: '2026-02-25',
    aiMatch: 70
  }
]

const fetchApplications = async () => {
  const response = await api.applications.getStudentList()
  if (response.success) {
    applications.value = response.data.length > 0 ? response.data : mockApplications
    total.value = applications.value.length
  } else {
    applications.value = mockApplications
    total.value = mockApplications.length
  }
}

const getStatusType = (status) => {
  switch (status) {
    case 'pending': return 'info'
    case 'interview': return 'warning'
    case 'accepted': return 'success'
    case 'rejected': return 'danger'
    default: return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return '待处理'
    case 'interview': return '面试中'
    case 'accepted': return '已录用'
    case 'rejected': return '已拒绝'
    default: return status
  }
}

const getMatchColor = (match) => {
  if (match >= 80) return '#67c23a'
  if (match >= 60) return '#e6a23c'
  return '#f56c6c'
}

const viewDetail = (application) => {
  console.log('查看详情:', application)
  // 跳转到申请详情页面
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (current) => {
  currentPage.value = current
}

onMounted(() => {
  fetchApplications()
})
</script>

<style scoped>
.applications-container {
  padding: 20px;
}

.applications-container h2 {
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
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