<template>
  <div class="interview-page">
    <div class="page-inner">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="title-icon">🤖</span>
          AI 面试模拟
        </h1>
        <p class="page-subtitle">选择职位和难度，与 AI 进行模拟面试练习</p>
      </div>

      <!-- 面试设置 -->
      <div v-if="!interviewStarted && !interviewCompleted" class="setup-card">
        <div class="setup-header">
          <span class="setup-icon">⚙️</span>
          <h2>面试设置</h2>
        </div>
        <el-form
          :model="interviewForm"
          :rules="rules"
          ref="interviewFormRef"
          label-position="top"
          class="setup-form"
        >
          <el-form-item label="选择职位" prop="position">
            <el-select
              v-model="interviewForm.position"
              placeholder="请选择模拟职位"
              class="position-select"
              size="large"
            >
              <el-option label="前端开发实习生" value="frontend" />
              <el-option label="后端开发实习生" value="backend" />
              <el-option label="UI设计实习生" value="ui" />
              <el-option label="产品经理实习生" value="product" />
            </el-select>
          </el-form-item>
          <el-form-item label="面试类型" prop="type">
            <div class="option-group">
              <button
                v-for="opt in typeOptions"
                :key="opt.value"
                type="button"
                class="option-btn"
                :class="{ active: interviewForm.type === opt.value }"
                @click="interviewForm.type = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </el-form-item>
          <el-form-item label="难度等级" prop="difficulty">
            <div class="option-group">
              <button
                v-for="opt in difficultyOptions"
                :key="opt.value"
                type="button"
                class="option-btn"
                :class="{ active: interviewForm.difficulty === opt.value }"
                @click="interviewForm.difficulty = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </el-form-item>
          <el-form-item label="题目数量" prop="questionCount">
            <el-input-number
              v-model="interviewForm.questionCount"
              :min="1"
              :max="10"
              size="large"
            />
          </el-form-item>
          <div class="form-actions">
            <button
              class="start-btn"
              :disabled="loading"
              @click="startInterview"
            >
              {{ loading ? '准备中...' : '开始面试' }}
            </button>
            <button type="button" class="reset-btn" @click="resetForm">重置</button>
          </div>
        </el-form>
      </div>

      <!-- 面试进行中 -->
      <div v-if="interviewStarted && !interviewCompleted" class="question-card">
        <div class="question-header">
          <span class="progress-badge">第 {{ currentQuestionIndex + 1 }} / {{ questions.length }} 题</span>
        </div>
        <div class="question-body">
          <div class="question-block">
            <span class="question-label">问题</span>
            <p class="question-text">{{ currentQuestion }}</p>
          </div>
          <div class="answer-block">
            <el-input
              v-model="answer"
              type="textarea"
              :rows="6"
              placeholder="请输入你的答案..."
              :disabled="isAnswering"
              class="answer-input"
            />
            <div class="answer-actions">
              <el-button type="primary" @click="submitAnswer" :loading="isAnswering">
                提交答案
              </el-button>
              <el-button @click="getHint" :disabled="isAnswering">
                获取提示
              </el-button>
              <el-button v-if="feedback" type="primary" @click="nextQuestion">
                下一题
              </el-button>
            </div>
          </div>
          <div v-if="feedback" class="feedback-block">
            <div class="feedback-inner" :class="feedback.type">
              <span class="feedback-title">{{ feedback.title }}</span>
              <p class="feedback-content">{{ feedback.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 面试结果 -->
      <div v-if="interviewCompleted" class="result-card">
        <div class="result-score">
          <span class="score-num">{{ finalScore }}</span>
          <span class="score-unit">分</span>
          <el-tag class="score-tag" :type="getScoreType(finalScore)">
            {{ getScoreLevel(finalScore) }}
          </el-tag>
        </div>
        <div class="result-details">
          <div class="detail-row">
            <span class="detail-label">回答题数</span>
            <span class="detail-value">{{ answeredCount }} / {{ questions.length }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">平均得分</span>
            <span class="detail-value">{{ averageScore }} 分</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">用时</span>
            <span class="detail-value">{{ duration }} 分钟</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">优势</span>
            <span class="detail-value">{{ strengths.join('、') }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">待提升</span>
            <span class="detail-value">{{ weaknesses.join('、') }}</span>
          </div>
        </div>
        <div class="result-suggestions">
          <h4>改进建议</h4>
          <div v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-item">
            <el-icon><Check /></el-icon>
            <span>{{ suggestion }}</span>
          </div>
        </div>
        <div class="result-actions">
          <el-button type="primary" size="large" @click="restartInterview">
            重新面试
          </el-button>
          <el-button size="large" @click="exportReport">
            导出报告
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

const typeOptions = [
  { label: '技术面试', value: 'technical' },
  { label: '行为面试', value: 'behavioral' },
  { label: '综合面试', value: 'comprehensive' },
]

const difficultyOptions = [
  { label: '简单', value: 'easy' },
  { label: '中等', value: 'medium' },
  { label: '困难', value: 'hard' },
]

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
.interview-page {
  min-height: 100vh;
  background: #f7f8fc;
  padding: 32px 24px 64px;
}

.page-inner {
  max-width: 720px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  margin-bottom: 32px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px;
}

.title-icon {
  font-size: 28px;
}

.page-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

/* 面试设置卡片 */
.setup-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.setup-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.setup-icon {
  font-size: 24px;
}

.setup-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.setup-form :deep(.el-form-item) {
  margin-bottom: 24px;
}

.setup-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #475569;
}

.position-select {
  width: 100%;
}

.position-select :deep(.el-input__wrapper) {
  border-radius: 10px;
  padding: 4px 16px;
}

.position-select :deep(.el-input__wrapper:hover),
.position-select :deep(.el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #667eea inset;
}

.option-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.option-btn {
  padding: 10px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.option-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #fff;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
}

.start-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.start-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.reset-btn {
  padding: 12px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  font-size: 15px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  border-color: #94a3b8;
  color: #475569;
}

/* 面试进行中 */
.question-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.question-header {
  margin-bottom: 24px;
}

.progress-badge {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
}

.question-block {
  margin-bottom: 28px;
}

.question-label {
  display: block;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 10px;
}

.question-text {
  font-size: 17px;
  color: #1e293b;
  line-height: 1.7;
  margin: 0;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.answer-block {
  margin-bottom: 24px;
}

.answer-input :deep(.el-textarea__inner) {
  border-radius: 12px;
  padding: 16px;
}

.answer-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.feedback-block {
  margin-top: 24px;
}

.feedback-inner {
  padding: 20px;
  border-radius: 12px;
}

.feedback-inner.success {
  background: rgba(103, 194, 58, 0.1);
  border: 1px solid rgba(103, 194, 58, 0.3);
}

.feedback-inner.warning {
  background: rgba(230, 162, 60, 0.1);
  border: 1px solid rgba(230, 162, 60, 0.3);
}

.feedback-inner.error {
  background: rgba(245, 108, 108, 0.1);
  border: 1px solid rgba(245, 108, 108, 0.3);
}

.feedback-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  display: block;
  margin-bottom: 8px;
}

.feedback-content {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

/* 面试结果 */
.result-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.result-score {
  text-align: center;
  margin-bottom: 40px;
}

.score-num {
  font-size: 64px;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
}

.score-unit {
  font-size: 24px;
  color: #64748b;
  margin-left: 4px;
}

.score-tag {
  display: block;
  margin-top: 12px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.result-details {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: #64748b;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.result-suggestions h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 10px;
}

.suggestion-item .el-icon {
  color: #67c23a;
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}
</style>