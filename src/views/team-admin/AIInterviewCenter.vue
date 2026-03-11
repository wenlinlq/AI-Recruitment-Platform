<template>
  <div class="ai-interview-center">
    <div class="page-header">
      <h2>AI面试中心</h2>
      <el-button type="primary" @click="showCreateDialog">
        <el-icon><Plus /></el-icon> 创建面试
      </el-button>
    </div>

    <el-card class="interviews-card">
      <el-table :data="interviews" style="width: 100%">
        <el-table-column label="候选人" width="200">
          <template #default="scope">
            <div class="candidate-info">
              <el-avatar :size="40" :src="scope.row.avatar">
                {{ scope.row.candidateName?.[0] }}
              </el-avatar>
              <div class="candidate-name">{{ scope.row.candidateName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="申请职位" width="150" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="AI评分" width="100">
          <template #default="scope">
            <span :style="{ color: getScoreColor(scope.row.score) }">
              {{ scope.row.score }}分
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="viewInterview(scope.row)">
              查看详情
            </el-button>
            <el-button size="small" type="primary" @click="startInterview(scope.row)" :disabled="scope.row.status !== 'pending'">
              开始面试
            </el-button>
            <el-button size="small" type="danger" @click="deleteInterview(scope.row._id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建面试对话框 -->
    <el-dialog v-model="dialogVisible" title="创建AI面试" width="600px">
      <el-form :model="interviewForm" :rules="rules" ref="interviewFormRef" label-width="120px">
        <el-form-item label="选择候选人" prop="candidateId">
          <el-select v-model="interviewForm.candidateId" placeholder="请选择候选人">
            <el-option v-for="candidate in candidates" :key="candidate._id" :label="candidate.name" :value="candidate._id" />
          </el-select>
        </el-form-item>
        <el-form-item label="面试类型" prop="type">
          <el-radio-group v-model="interviewForm.type">
            <el-radio label="technical">技术面试</el-radio>
            <el-radio label="behavioral">行为面试</el-radio>
            <el-radio label="comprehensive">综合面试</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度等级" prop="difficulty">
          <el-radio-group v-model="interviewForm.difficulty">
            <el-radio label="easy">简单</el-radio>
            <el-radio label="medium">中等</el-radio>
            <el-radio label="hard">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目数量" prop="questionCount">
          <el-input-number v-model="interviewForm.questionCount" :min="1" :max="10" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveInterview" :loading="loading">
          创建
        </el-button>
      </template>
    </el-dialog>

    <!-- 面试详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="面试详情" width="900px">
      <div v-if="currentInterview" class="interview-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="候选人">{{ currentInterview.candidateName }}</el-descriptions-item>
          <el-descriptions-item label="申请职位">{{ currentInterview.position }}</el-descriptions-item>
          <el-descriptions-item label="面试类型">{{ getInterviewTypeText(currentInterview.type) }}</el-descriptions-item>
          <el-descriptions-item label="难度等级">{{ getDifficultyText(currentInterview.difficulty) }}</el-descriptions-item>
          <el-descriptions-item label="题目数量">{{ currentInterview.questionCount }}题</el-descriptions-item>
          <el-descriptions-item label="AI评分">{{ currentInterview.score }}分</el-descriptions-item>
        </el-descriptions>

        <div class="questions-section">
          <h3>面试问题</h3>
          <div v-for="(question, index) in currentInterview.questions" :key="index" class="question-item">
            <div class="question-header">
              <span class="question-number">问题{{ index + 1 }}</span>
              <el-tag :type="getQuestionType(question.type)" size="small">{{ getQuestionTypeText(question.type) }}</el-tag>
            </div>
            <div class="question-content">{{ question.content }}</div>
            <div class="answer-section">
              <div class="answer-label">候选人答案：</div>
              <div class="answer-content">{{ question.answer }}</div>
              <div class="ai-feedback">
                <div class="feedback-label">AI评价：</div>
                <div class="feedback-content">{{ question.feedback }}</div>
                <div class="feedback-score">得分：{{ question.score }}分</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const interviews = ref([
  {
    _id: '1',
    candidateName: '张三',
    position: '前端开发实习生',
    createTime: '2026-03-05 14:30',
    status: 'completed',
    score: 85,
    type: 'technical',
    difficulty: 'medium',
    questionCount: 5,
    questions: [
      {
        type: 'technical',
        content: '请介绍一下Vue 3的响应式原理',
        answer: 'Vue 3的响应式原理基于Proxy对象，通过劫持对象属性的get和set操作来实现数据劫持。当数据变化时，会自动触发视图更新。',
        feedback: '回答准确，对Vue 3的响应式原理理解深入，能够清晰阐述核心概念。',
        score: 90
      },
      {
        type: 'technical',
        content: '如何优化Vue应用的性能？',
        answer: '可以通过虚拟DOM、代码分割、懒加载、缓存等方式来优化Vue应用性能。虚拟DOM可以减少真实DOM操作，代码分割可以实现按需加载，懒加载可以延迟加载非关键资源，缓存可以减少重复计算。',
        feedback: '回答全面，提到了多种性能优化方法，有实际项目经验。',
        score: 85
      }
    ]
  },
  {
    _id: '2',
    candidateName: '李四',
    position: '后端开发实习生',
    createTime: '2026-03-06 10:15',
    status: 'in_progress',
    score: 0,
    type: 'behavioral',
    difficulty: 'medium',
    questionCount: 3,
    questions: []
  }
])

const candidates = ref([
  { _id: '1', name: '张三' },
  { _id: '2', name: '李四' },
  { _id: '3', name: '王五' }
])

const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const loading = ref(false)
const interviewFormRef = ref(null)
const currentInterview = ref(null)

const interviewForm = ref({
  candidateId: '',
  type: 'technical',
  difficulty: 'medium',
  questionCount: 5
})

const rules = {
  candidateId: [
    { required: true, message: '请选择候选人', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择面试类型', trigger: 'change' }
  ],
  difficulty: [
    { required: true, message: '请选择难度等级', trigger: 'change' }
  ],
  questionCount: [
    { required: true, message: '请输入题目数量', trigger: 'blur' }
  ]
}

const getStatusType = (status) => {
  switch (status) {
    case 'pending': return 'info'
    case 'in_progress': return 'warning'
    case 'completed': return 'success'
    default: return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return '待开始'
    case 'in_progress': return '进行中'
    case 'completed': return '已完成'
    default: return status
  }
}

const getScoreColor = (score) => {
  if (score >= 90) return '#67c23a'
  if (score >= 80) return '#67c23a'
  if (score >= 70) return '#e6a23c'
  return '#f56c6c'
}

const getInterviewTypeText = (type) => {
  switch (type) {
    case 'technical': return '技术面试'
    case 'behavioral': return '行为面试'
    case 'comprehensive': return '综合面试'
    default: return type
  }
}

const getDifficultyText = (difficulty) => {
  switch (difficulty) {
    case 'easy': return '简单'
    case 'medium': return '中等'
    case 'hard': return '困难'
    default: return difficulty
  }
}

const getQuestionType = (type) => {
  switch (type) {
    case 'technical': return 'primary'
    case 'behavioral': return 'success'
    default: return 'info'
  }
}

const getQuestionTypeText = (type) => {
  switch (type) {
    case 'technical': return '技术题'
    case 'behavioral': return '行为题'
    default: return '综合题'
  }
}

const showCreateDialog = () => {
  interviewForm.value = {
    candidateId: '',
    type: 'technical',
    difficulty: 'medium',
    questionCount: 5
  }
  dialogVisible.value = true
}

const viewInterview = (interview) => {
  currentInterview.value = interview
  detailDialogVisible.value = true
}

const startInterview = (interview) => {
  ElMessageBox.confirm(`确定要开始${interview.candidateName}的AI面试吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    interview.status = 'in_progress'
    ElMessage.success('面试已开始')
  }).catch(() => {})
}

const deleteInterview = (id) => {
  ElMessageBox.confirm('确定要删除该面试吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    interviews.value = interviews.value.filter(i => i._id !== id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const saveInterview = async () => {
  if (!interviewFormRef.value) return
  
  await interviewFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const candidate = candidates.value.find(c => c._id === interviewForm.value.candidateId)
        interviews.value.push({
          ...interviewForm.value,
          _id: Date.now().toString(),
          candidateName: candidate?.name || '未知',
          position: '待定',
          createTime: new Date().toLocaleString(),
          status: 'pending',
          score: 0,
          questions: []
        })
        dialogVisible.value = false
        ElMessage.success('创建成功')
      } catch (error) {
        ElMessage.error('创建失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.ai-interview-center {
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

.interviews-card {
  transition: box-shadow 0.3s ease;
}

.interviews-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.candidate-info {
  display: flex;
  align-items: center;
}

.candidate-name {
  margin-left: 15px;
  font-weight: bold;
  color: #333;
}

.interview-detail {
  padding: 20px 0;
}

.questions-section {
  margin-top: 30px;
}

.questions-section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.question-item {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.question-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.question-number {
  font-weight: bold;
  color: #667eea;
  margin-right: 10px;
}

.question-content {
  font-size: 16px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 20px;
}

.answer-section {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.answer-label {
  font-weight: bold;
  color: #666;
  margin-bottom: 10px;
}

.answer-content {
  color: #333;
  line-height: 1.6;
  margin-bottom: 20px;
}

.ai-feedback {
  background: #f0f9ff;
  padding: 15px;
  border-radius: 6px;
}

.feedback-label {
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
}

.feedback-content {
  color: #333;
  line-height: 1.6;
  margin-bottom: 10px;
}

.feedback-score {
  font-weight: bold;
  color: #67c23a;
}
</style>