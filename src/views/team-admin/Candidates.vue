<template>
  <div class="team-candidates">
    <div class="page-header">
      <h2>候选人管理</h2>
      <div class="search-bar">
        <el-input v-model="searchQuery" placeholder="搜索候选人" prefix-icon="Search" style="width: 300px;">
          <template #append>
            <el-button type="primary" @click="searchCandidates">搜索</el-button>
          </template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="状态" style="width: 150px; margin-left: 10px;">
          <el-option label="全部" value="" />
          <el-option label="待处理" value="pending" />
          <el-option label="面试中" value="interview" />
          <el-option label="已录用" value="accepted" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
      </div>
    </div>

    <el-card class="candidates-card">
      <el-table :data="candidates" style="width: 100%">
        <el-table-column label="候选人" width="200">
          <template #default="scope">
            <div class="candidate-info">
              <el-avatar :size="40" :src="scope.row.avatar">
                {{ scope.row.name?.[0] }}
              </el-avatar>
              <div class="candidate-details">
                <div class="candidate-name">{{ scope.row.name }}</div>
                <div class="candidate-major">{{ scope.row.major }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="申请职位" width="150" />
        <el-table-column prop="applyDate" label="申请日期" width="120" />
        <el-table-column prop="aiMatch" label="AI匹配度" width="120">
          <template #default="scope">
            <el-progress :percentage="scope.row.aiMatch" :color="getMatchColor(scope.row.aiMatch)" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="viewResume(scope.row)">
              查看简历
            </el-button>
            <el-button size="small" type="primary" @click="arrangeInterview(scope.row)" :disabled="scope.row.status === 'accepted' || scope.row.status === 'rejected'">
              安排面试
            </el-button>
            <el-button size="small" type="success" @click="acceptCandidate(scope.row)" :disabled="scope.row.status === 'accepted'">
              录用
            </el-button>
            <el-button size="small" type="danger" @click="rejectCandidate(scope.row)" :disabled="scope.row.status === 'rejected'">
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 简历详情对话框 -->
    <el-dialog v-model="resumeDialogVisible" title="简历详情" width="800px">
      <div v-if="currentCandidate" class="resume-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ currentCandidate.name }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{ currentCandidate.studentId }}</el-descriptions-item>
          <el-descriptions-item label="专业">{{ currentCandidate.major }}</el-descriptions-item>
          <el-descriptions-item label="年级">{{ currentCandidate.grade }}</el-descriptions-item>
          <el-descriptions-item label="技能">
            <el-tag v-for="skill in currentCandidate.skills" :key="skill" size="small" style="margin-right: 5px;">
              {{ skill }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="项目经历" :span="2">
            {{ currentCandidate.projects }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const filterStatus = ref('')
const candidates = ref([
  {
    _id: '1',
    name: '张三',
    studentId: '2021001',
    major: '计算机科学与技术',
    grade: '大三',
    position: '前端开发实习生',
    applyDate: '2026-03-01',
    aiMatch: 85,
    status: 'pending',
    skills: ['Vue', 'JavaScript', 'CSS', 'HTML'],
    projects: '参与校园官网开发，负责前端页面搭建和交互实现'
  },
  {
    _id: '2',
    name: '李四',
    studentId: '2021002',
    major: '软件工程',
    grade: '大四',
    position: '后端开发实习生',
    applyDate: '2026-03-02',
    aiMatch: 92,
    status: 'interview',
    skills: ['Node.js', 'MongoDB', 'Express', 'RESTful API'],
    projects: '开发学生管理系统后端API，负责数据库设计和接口开发'
  },
  {
    _id: '3',
    name: '王五',
    studentId: '2021003',
    major: '计算机科学与技术',
    grade: '大二',
    position: 'UI设计实习生',
    applyDate: '2026-03-03',
    aiMatch: 78,
    status: 'accepted',
    skills: ['Figma', 'Photoshop', 'UI设计', '用户体验'],
    projects: '设计多个产品界面，参与用户体验优化项目'
  }
])

const resumeDialogVisible = ref(false)
const currentCandidate = ref(null)

const searchCandidates = () => {
  console.log('搜索:', searchQuery.value, filterStatus.value)
}

const getMatchColor = (match) => {
  if (match >= 80) return '#67c23a'
  if (match >= 60) return '#e6a23c'
  return '#f56c6c'
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

const viewResume = (candidate) => {
  currentCandidate.value = candidate
  resumeDialogVisible.value = true
}

const arrangeInterview = (candidate) => {
  ElMessageBox.confirm(`确定要为${candidate.name}安排面试吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    candidate.status = 'interview'
    ElMessage.success('面试安排成功')
  }).catch(() => {})
}

const acceptCandidate = (candidate) => {
  ElMessageBox.confirm(`确定要录用${candidate.name}吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    candidate.status = 'accepted'
    ElMessage.success('录用成功')
  }).catch(() => {})
}

const rejectCandidate = (candidate) => {
  ElMessageBox.confirm(`确定要拒绝${candidate.name}吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    candidate.status = 'rejected'
    ElMessage.success('已拒绝')
  }).catch(() => {})
}
</script>

<style scoped>
.team-candidates {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.search-bar {
  display: flex;
  align-items: center;
}

.candidates-card {
  transition: box-shadow 0.3s ease;
}

.candidates-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.candidate-info {
  display: flex;
  align-items: center;
}

.candidate-details {
  margin-left: 15px;
}

.candidate-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 3px;
}

.candidate-major {
  font-size: 12px;
  color: #666;
}

.resume-detail {
  padding: 20px 0;
}
</style>