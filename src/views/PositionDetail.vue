<template>
  <div class="position-detail-container">
    <el-card v-if="position" class="position-detail-card">
      <template #header>
        <div class="position-detail-header">
          <h2>{{ position.title }}</h2>
          <el-tag :type="position.type === '实习' ? 'info' : position.type === '全职' ? 'success' : 'warning'">
            {{ position.type }}
          </el-tag>
        </div>
      </template>
      <div class="position-detail-body">
        <div class="section">
          <h3>职位要求</h3>
          <p>{{ position.requirements }}</p>
        </div>
        <div class="section">
          <h3>工作职责</h3>
          <p>{{ position.responsibilities }}</p>
        </div>
        <div class="section">
          <h3>截止日期</h3>
          <p>{{ position.deadline }}</p>
        </div>
        <div class="section ai-analysis">
          <h3>AI分析</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="所需技能">
              <el-tag v-for="skill in position.aiAnalysis.skills" :key="skill" size="small" style="margin-right: 5px;">
                {{ skill }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="难度">
              {{ position.aiAnalysis.difficulty === 'easy' ? '简单' : position.aiAnalysis.difficulty === 'medium' ? '中等' : '困难' }}
            </el-descriptions-item>
            <el-descriptions-item label="预计申请人数">
              {{ position.aiAnalysis.estimatedApplicants }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="application-section">
          <h3>申请职位</h3>
          <el-form :model="applicationForm" :rules="rules" ref="applicationFormRef">
            <el-form-item label="简历上传" prop="resume">
              <el-upload
                class="upload-demo"
                action="#"
                :auto-upload="false"
                :on-change="handleFileChange"
                :file-list="fileList"
              >
                <el-button type="primary">选择文件</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    支持 PDF、Word 格式，大小不超过 10MB
                  </div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item label="自我介绍" prop="selfIntro">
              <el-input v-model="applicationForm.selfIntro" type="textarea" rows="4" placeholder="请简要介绍自己" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleApply" :loading="loading">
                一键投递
              </el-button>
              <el-button @click="analyzeResume" :loading="analyzing">
                AI简历解析
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
    <div v-else class="loading-state">
      <el-skeleton :rows="10" animated />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'

const route = useRoute()
const position = ref(null)
const applicationForm = ref({
  resume: '',
  selfIntro: ''
})
const fileList = ref([])
const loading = ref(false)
const analyzing = ref(false)
const applicationFormRef = ref(null)

const rules = {
  resume: [
    { required: true, message: '请上传简历', trigger: 'change' }
  ],
  selfIntro: [
    { required: true, message: '请填写自我介绍', trigger: 'blur' }
  ]
}

const fetchPositionDetail = async () => {
  const id = route.params.id
  const response = await api.positions.getDetail(id)
  if (response.success) {
    position.value = response.data
  }
}

const handleFileChange = (file) => {
  fileList.value = [file]
  applicationForm.value.resume = file.name
}

const analyzeResume = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先上传简历')
    return
  }
  
  analyzing.value = true
  try {
    const response = await api.ai.parseResume(fileList.value[0])
    if (response.success) {
      ElMessage.success('简历解析成功')
      console.log('解析结果:', response.data)
    }
  } catch (error) {
    ElMessage.error('解析失败，请稍后重试')
  } finally {
    analyzing.value = false
  }
}

const handleApply = async () => {
  if (!applicationFormRef.value) return
  
  await applicationFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const response = await api.applications.create({
          positionId: route.params.id,
          ...applicationForm.value
        })
        if (response.success) {
          ElMessage.success('投递成功')
        }
      } catch (error) {
        ElMessage.error('投递失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  fetchPositionDetail()
})
</script>

<style scoped>
.position-detail-container {
  padding: 20px;
}

.position-detail-card {
  max-width: 800px;
  margin: 0 auto;
}

.position-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.position-detail-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.section {
  margin: 30px 0;
}

.section h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  border-left: 4px solid #667eea;
  padding-left: 10px;
}

.section p {
  color: #666;
  line-height: 1.5;
}

.ai-analysis {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.application-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eaeaea;
}

.application-section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.loading-state {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>