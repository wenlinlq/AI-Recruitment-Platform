<template>
  <div class="ai-interview-container">
    <h2>AI面试模拟</h2>
    <el-card class="interview-card">
      <template #header>
        <div class="card-header">
          <h3>面试设置</h3>
        </div>
      </template>
      <el-form :model="interviewForm" :rules="rules" ref="interviewFormRef" label-width="120px">
        <el-form-item label="选择职位" prop="position">
          <el-select v-model="interviewForm.position" placeholder="请选择职位">
            <el-option label="前端开发实习生" value="frontend" />
            <el-option label="后端开发实习生" value="backend" />
            <el-option label="UI设计实习生" value="ui" />
            <el-option label="产品经理实习生" value="product" />
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
        <el-form-item>
          <el-button type="primary" @click="startInterview" :loading="loading">
            开始面试
          </el-button>
          <el-button @click="resetForm">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="interviewStarted" class="interview-card" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <h3>面试进行中</h3>
          <el-tag type="success">第 {{ currentQuestionIndex + 1 }} / {{ questions.length }} 题</el-tag>
        </div>
      </template>
      <div class="question-container">
        <div class="question-content">
          <h4>问题：</h4>
          <p>{{ currentQuestion }}</p>
        </div>
        <div class="answer-section">
          <el-input
            v-model="answer"
            type="textarea"
            :rows="6"
            placeholder="请输入你的答案..."
            :disabled="isAnswering"
          />
          <div class="answer-actions">
            <el-button type="primary" @click="submitAnswer" :loading="isAnswering">
              提交答案
            </el-button>
            <el-button @click="getHint" :disabled="isAnswering">
              获取提示
            </el-button>
          </div>
        </div>
        <div v-if="feedback" class="feedback-section">
          <el-alert :title="feedback.title" :type="feedback.type" :description="feedback.content" show-icon />
        </div>
      </div>
    </el-card>

    <el-card v-if="interviewCompleted" class="interview-card" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <h3>面试结果</h3>
        </div>
      </template>
      <div class="result-container">
        <div class="score-section">
          <h4>综合评分</h4>
          <div class="score-display">
            <span class="score-number">{{ finalScore }}</span>
            <span class="score-label">分</span>
          </div>
          <div class="score-level">
            <el-tag :type="getScoreType(finalScore)">
              {{ getScoreLevel(finalScore) }}
            </el-tag>
          </div>
        </div>
        <div class="details-section">
          <h4>详细分析</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="回答问题数">
              {{ answeredCount }} / {{ questions.length }}
            </el-descriptions-item>
            <el-descriptions-item label="平均得分">
              {{ averageScore }} 分
            </el-descriptions-item>
            <el-descriptions-item label="用时">
              {{ duration }} 分钟
            </el-descriptions-item>
            <el-descriptions-item label="优势">
              {{ strengths.join('、') }}
            </el-descriptions-item>
            <el-descriptions-item label="待提升">
              {{ weaknesses.join('、') }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="suggestions-section">
          <h4>改进建议</h4>
          <div v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-item">
            <el-icon><Check /></el-icon>
            <span>{{ suggestion }}</span>
          </div>
        </div>
        <div class="action-buttons">
          <el-button type="primary" @click="restartInterview">
            重新面试
          </el-button>
          <el-button @click="exportReport">
            导出报告
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check } from '@element-plus/icons-vue'

const interviewFormRef = ref(null)
const loading = ref(false)
const interviewForm = ref({
  position: '',
  type: 'technical',
  difficulty: 'medium',
  questionCount: 5
})

const rules = {
  position: [
    { required: true, message: '请选择职位', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择面试类型', trigger: 'change' }
  ],
  difficulty: [
    { required: true, message: '请选择难度等级', trigger: 'change' }
  ]
}

const interviewStarted = ref(false)
const interviewCompleted = ref(false)
const questions = ref([])
const currentQuestionIndex = ref(0)
const currentQuestion = ref('')
const answer = ref('')
const isAnswering = ref(false)
const feedback = ref(null)

const finalScore = ref(0)
const answeredCount = ref(0)
const averageScore = ref(0)
const duration = ref(0)
const strengths = ref([])
const weaknesses = ref([])
const suggestions = ref([])

const mockQuestions = {
  frontend: [
    '请介绍一下Vue 3的响应式原理',
    '如何优化Vue应用的性能？',
    '请解释一下虚拟DOM的作用',
    'Vue中的computed和watch有什么区别？',
    '如何处理Vue组件间的通信？'
  ],
  backend: [
    '请介绍一下Node.js的事件循环机制',
    '如何设计RESTful API？',
    'MongoDB的索引是如何工作的？',
    '如何处理高并发请求？',
    '请解释一下JWT认证的原理'
  ],
  ui: [
    '请介绍一下你的设计理念',
    '如何平衡美观和可用性？',
    '请描述一下你的设计流程',
    '如何进行用户体验测试？',
    '请展示一个你满意的设计作品'
  ],
  product: [
    '请介绍一下产品经理的核心职责',
    '如何进行用户需求分析？',
    '请描述一下产品迭代的过程',
    '如何评估产品的成功与否？',
    '请分享一个你主导的产品案例'
  ]
}

const startInterview = async () => {
  if (!interviewFormRef.value) return
  
  await interviewFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟生成面试题目
        setTimeout(() => {
          const positionQuestions = mockQuestions[interviewForm.value.position] || mockQuestions.frontend
          questions.value = positionQuestions.slice(0, interviewForm.value.questionCount)
          currentQuestionIndex.value = 0
          currentQuestion.value = questions.value[0]
          interviewStarted.value = true
          loading.value = false
        }, 1000)
      } catch (error) {
        ElMessage.error('生成题目失败，请稍后重试')
        loading.value = false
      }
    }
  })
}

const submitAnswer = async () => {
  if (!answer.value.trim()) {
    ElMessage.warning('请输入答案')
    return
  }
  
  isAnswering.value = true
  try {
    // 模拟AI评分
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 60
      feedback.value = {
        title: '评分结果',
        type: score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error',
        content: `你的答案得分：${score}分。${score >= 80 ? '回答很棒！' : score >= 60 ? '回答不错，还有提升空间。' : '需要加强相关知识的学习。'}`
      }
      isAnswering.value = false
    }, 1500)
  } catch (error) {
    ElMessage.error('评分失败，请稍后重试')
    isAnswering.value = false
  }
}

const getHint = () => {
  ElMessage.info('提示：可以从基本概念开始回答，然后逐步深入细节。')
}

const nextQuestion = () => {
  feedback.value = null
  answer.value = ''
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    currentQuestion.value = questions.value[currentQuestionIndex.value]
  } else {
    completeInterview()
  }
}

const completeInterview = () => {
  interviewCompleted.value = true
  finalScore.value = Math.floor(Math.random() * 30) + 70
  answeredCount.value = questions.value.length
  averageScore.value = Math.floor(Math.random() * 20) + 70
  duration.value = Math.floor(Math.random() * 20) + 10
  strengths.value = ['逻辑清晰', '表达流畅', '技术扎实']
  weaknesses.value = ['深度不够', '缺乏实际案例']
  suggestions.value = [
    '建议加强对Vue 3新特性的学习',
    '多参与实际项目，积累经验',
    '关注行业最新动态和技术趋势',
    '提升代码质量和性能优化能力'
  ]
}

const getScoreType = (score) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'success'
  if (score >= 70) return 'warning'
  return 'danger'
}

const getScoreLevel = (score) => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '中等'
  if (score >= 60) return '及格'
  return '待提升'
}

const resetForm = () => {
  interviewForm.value = {
    position: '',
    type: 'technical',
    difficulty: 'medium',
    questionCount: 5
  }
}

const restartInterview = () => {
  interviewStarted.value = false
  interviewCompleted.value = false
  questions.value = []
  currentQuestionIndex.value = 0
  currentQuestion.value = ''
  answer.value = ''
  feedback.value = null
  resetForm()
}

const exportReport = () => {
  ElMessage.success('报告导出成功')
}
</script>

<style scoped>
.ai-interview-container {
  padding: 20px;
}

.ai-interview-container h2 {
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.interview-card {
  max-width: 800px;
  margin: 0 auto;
  transition: box-shadow 0.3s ease;
}

.interview-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.question-container {
  padding: 20px 0;
}

.question-content {
  margin-bottom: 30px;
}

.question-content h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.question-content p {
  font-size: 18px;
  color: #666;
  line-height: 1.6;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.answer-section {
  margin-bottom: 20px;
}

.answer-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.feedback-section {
  margin-top: 20px;
}

.result-container {
  padding: 20px 0;
}

.score-section {
  text-align: center;
  margin-bottom: 40px;
}

.score-section h4 {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.score-display {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 15px;
}

.score-number {
  font-size: 72px;
  font-weight: bold;
  color: #667eea;
}

.score-label {
  font-size: 24px;
  color: #666;
}

.score-level {
  margin-top: 10px;
}

.details-section {
  margin-bottom: 40px;
}

.details-section h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.suggestions-section {
  margin-bottom: 40px;
}

.suggestions-section h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.suggestion-item .el-icon {
  color: #67c23a;
  font-size: 20px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>