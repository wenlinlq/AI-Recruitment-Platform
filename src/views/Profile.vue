<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="profile-header">
          <h2>个人资料</h2>
        </div>
      </template>
      <div class="profile-body">
        <div class="avatar-section">
          <el-avatar :size="120" :src="user.avatar || defaultAvatar" class="avatar">
            {{ user.username?.[0] || 'U' }}
          </el-avatar>
          <el-button type="primary" size="small" style="margin-top: 10px;">
            更换头像
          </el-button>
        </div>
        <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" type="email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="userForm.realName" placeholder="请输入真实姓名" />
          </el-form-item>
          <el-form-item label="学号" prop="studentId">
            <el-input v-model="userForm.studentId" placeholder="请输入学号" />
          </el-form-item>
          <el-form-item label="专业" prop="major">
            <el-input v-model="userForm.major" placeholder="请输入专业" />
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-input v-model="userForm.grade" placeholder="请输入年级" />
          </el-form-item>
          <el-form-item label="技能" prop="skills">
            <el-select v-model="userForm.skills" multiple placeholder="请选择技能">
              <el-option v-for="skill in skillOptions" :key="skill.value" :label="skill.label" :value="skill.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="项目经历">
            <el-input v-model="userForm.projects" type="textarea" rows="4" placeholder="请输入项目经历" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpdate" :loading="loading">
              保存修改
            </el-button>
            <el-button @click="resetForm">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="resume-section" style="margin-top: 30px;">
      <template #header>
        <div class="resume-header">
          <h3>简历管理</h3>
        </div>
      </template>
      <div class="resume-body">
        <el-upload
          class="upload-demo"
          action="#"
          :auto-upload="false"
          :on-change="handleResumeChange"
          :file-list="resumeFileList"
        >
          <el-button type="primary">上传简历</el-button>
          <template #tip>
            <div class="el-upload__tip">
              支持 PDF、Word 格式，大小不超过 10MB
            </div>
          </template>
        </el-upload>
        <div class="resume-actions" style="margin-top: 20px;">
          <el-button @click="analyzeResume">
            AI简历解析
          </el-button>
          <el-button @click="optimizeResume">
            简历优化建议
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../store'
import api from '../api'

const userStore = useUserStore()
const user = ref(userStore.user || {})
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const userForm = ref({
  username: '',
  email: '',
  realName: '',
  studentId: '',
  major: '',
  grade: '',
  skills: [],
  projects: ''
})
const resumeFileList = ref([])
const loading = ref(false)
const userFormRef = ref(null)

const skillOptions = [
  { label: 'Vue', value: 'Vue' },
  { label: 'React', value: 'React' },
  { label: 'Node.js', value: 'Node.js' },
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'Python', value: 'Python' },
  { label: 'Java', value: 'Java' },
  { label: 'C++', value: 'C++' },
  { label: 'UI设计', value: 'UI设计' },
  { label: '产品经理', value: '产品经理' },
  { label: '数据分析', value: '数据分析' }
]

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  major: [
    { required: true, message: '请输入专业', trigger: 'blur' }
  ],
  grade: [
    { required: true, message: '请输入年级', trigger: 'blur' }
  ]
}

const initForm = () => {
  userForm.value = {
    username: user.value.username || '',
    email: user.value.email || '',
    realName: user.value.realName || '',
    studentId: user.value.studentId || '',
    major: user.value.major || '',
    grade: user.value.grade || '',
    skills: user.value.skills || [],
    projects: user.value.projects || ''
  }
}

const handleUpdate = async () => {
  if (!userFormRef.value) return
  
  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟更新
        userStore.setUser(userForm.value)
        ElMessage.success('更新成功')
      } catch (error) {
        ElMessage.error('更新失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}

const resetForm = () => {
  initForm()
}

const handleResumeChange = (file) => {
  resumeFileList.value = [file]
}

const analyzeResume = async () => {
  if (resumeFileList.value.length === 0) {
    ElMessage.warning('请先上传简历')
    return
  }
  
  try {
    const response = await api.ai.parseResume(resumeFileList.value[0])
    if (response.success) {
      ElMessage.success('简历解析成功')
      // 更新表单数据
      userForm.value.realName = response.data.name || userForm.value.realName
      userForm.value.skills = response.data.skills || userForm.value.skills
    }
  } catch (error) {
    ElMessage.error('解析失败，请稍后重试')
  }
}

const optimizeResume = async () => {
  if (resumeFileList.value.length === 0) {
    ElMessage.warning('请先上传简历')
    return
  }
  
  try {
    const response = await api.ai.optimizeResume({})
    if (response.success) {
      ElMessage.success('获取优化建议成功')
      console.log('优化建议:', response.data.suggestions)
      // 显示优化建议
    }
  } catch (error) {
    ElMessage.error('获取优化建议失败，请稍后重试')
  }
}

onMounted(() => {
  initForm()
})
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.avatar-section {
  text-align: center;
  margin-bottom: 30px;
}

.avatar {
  margin-bottom: 10px;
}

.resume-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.resume-actions {
  display: flex;
  gap: 10px;
}
</style>