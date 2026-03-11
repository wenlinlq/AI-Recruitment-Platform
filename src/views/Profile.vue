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
          <div class="avatar-container">
            <el-avatar
              :size="120"
              :src="user.avatar || defaultAvatar"
              class="avatar"
            >
              {{ user.username?.[0] || "U" }}
            </el-avatar>
            <div class="avatar-overlay">
              <el-button type="primary" size="small" class="avatar-button">
                更换头像
              </el-button>
            </div>
          </div>
          <div class="user-basic-info">
            <h3>{{ userForm.realName || userForm.username }}</h3>
            <p>{{ userForm.major }} · {{ userForm.grade }}</p>
          </div>
        </div>
        <el-form
          :model="userForm"
          :rules="rules"
          ref="userFormRef"
          label-width="100px"
          class="user-form"
        >
          <div class="form-grid">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="userForm.username"
                placeholder="请输入用户名"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="userForm.email"
                type="email"
                placeholder="请输入邮箱"
              />
            </el-form-item>
            <el-form-item label="真实姓名" prop="realName">
              <el-input
                v-model="userForm.realName"
                placeholder="请输入真实姓名"
              />
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
          </div>
          <el-form-item label="技能" prop="skills">
            <el-select
              v-model="userForm.skills"
              multiple
              placeholder="请选择技能"
              class="skill-select"
            >
              <el-option
                v-for="skill in skillOptions"
                :key="skill.value"
                :label="skill.label"
                :value="skill.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="项目经历">
            <el-input
              v-model="userForm.projects"
              type="textarea"
              rows="4"
              placeholder="请输入项目经历"
              class="projects-textarea"
            />
          </el-form-item>
          <el-form-item class="form-actions">
            <el-button
              type="primary"
              @click="handleUpdate"
              :loading="loading"
              class="submit-button"
            >
              保存修改
            </el-button>
            <el-button @click="resetForm" class="reset-button">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="resume-section" style="margin-top: 30px">
      <template #header>
        <div class="resume-header">
          <h3>简历管理</h3>
        </div>
      </template>
      <div class="resume-body">
        <div class="upload-section">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleResumeChange"
            :file-list="resumeFileList"
            :class="{ 'has-file': resumeFileList.length > 0 }"
          >
            <div class="upload-content">
              <el-icon class="upload-icon"><Upload /></el-icon>
              <div class="upload-text">
                <h4>上传简历</h4>
                <p>支持 PDF、Word 格式，大小不超过 10MB</p>
              </div>
            </div>
          </el-upload>
        </div>
        <div class="resume-actions" style="margin-top: 20px">
          <el-button
            @click="analyzeResume"
            class="ai-button"
            :disabled="resumeFileList.length === 0"
          >
            <el-icon><MagicStick /></el-icon> AI简历解析
          </el-button>
          <el-button
            @click="optimizeResume"
            class="ai-button"
            :disabled="resumeFileList.length === 0"
          >
            <el-icon><Star /></el-icon> 简历优化建议
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../store";
import api from "../api";
import { Upload, MagicStick, Star } from "@element-plus/icons-vue";

const userStore = useUserStore();
const user = ref(userStore.user || {});
const defaultAvatar =
  "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
const userForm = ref({
  username: "",
  email: "",
  realName: "",
  studentId: "",
  major: "",
  grade: "",
  skills: [],
  projects: "",
});
const resumeFileList = ref([]);
const loading = ref(false);
const userFormRef = ref(null);

const skillOptions = [
  { label: "Vue", value: "Vue" },
  { label: "React", value: "React" },
  { label: "Node.js", value: "Node.js" },
  { label: "JavaScript", value: "JavaScript" },
  { label: "Python", value: "Python" },
  { label: "Java", value: "Java" },
  { label: "C++", value: "C++" },
  { label: "UI设计", value: "UI设计" },
  { label: "产品经理", value: "产品经理" },
  { label: "数据分析", value: "数据分析" },
];

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  realName: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
  studentId: [{ required: true, message: "请输入学号", trigger: "blur" }],
  major: [{ required: true, message: "请输入专业", trigger: "blur" }],
  grade: [{ required: true, message: "请输入年级", trigger: "blur" }],
};

const initForm = () => {
  userForm.value = {
    username: user.value.username || "",
    email: user.value.email || "",
    realName: user.value.realName || "",
    studentId: user.value.studentId || "",
    major: user.value.major || "",
    grade: user.value.grade || "",
    skills: user.value.skills || [],
    projects: user.value.projects || "",
  };
};

const handleUpdate = async () => {
  if (!userFormRef.value) return;

  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // 模拟更新
        userStore.setUser(userForm.value);
        ElMessage.success("更新成功");
      } catch (error) {
        ElMessage.error("更新失败，请稍后重试");
      } finally {
        loading.value = false;
      }
    }
  });
};

const resetForm = () => {
  initForm();
};

const handleResumeChange = (file) => {
  resumeFileList.value = [file];
};

const analyzeResume = async () => {
  if (resumeFileList.value.length === 0) {
    ElMessage.warning("请先上传简历");
    return;
  }

  try {
    const response = await api.ai.parseResume(resumeFileList.value[0]);
    if (response.success) {
      ElMessage.success("简历解析成功");
      // 更新表单数据
      userForm.value.realName = response.data.name || userForm.value.realName;
      userForm.value.skills = response.data.skills || userForm.value.skills;
    }
  } catch (error) {
    ElMessage.error("解析失败，请稍后重试");
  }
};

const optimizeResume = async () => {
  if (resumeFileList.value.length === 0) {
    ElMessage.warning("请先上传简历");
    return;
  }

  try {
    const response = await api.ai.optimizeResume({});
    if (response.success) {
      ElMessage.success("获取优化建议成功");
      console.log("优化建议:", response.data.suggestions);
      // 显示优化建议
    }
  } catch (error) {
    ElMessage.error("获取优化建议失败，请稍后重试");
  }
};

onMounted(() => {
  initForm();
});
</script>

<style scoped>
.profile-container {
  padding: 20px;
  min-height: 100vh;
  background: #f7f8fc;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.profile-card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.profile-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.avatar-container {
  position: relative;
  margin-right: 30px;
}

.avatar {
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar-overlay {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition:
    opacity 0.3s ease,
    bottom 0.3s ease;
  background: rgba(0, 0, 0, 0.7);
  padding: 5px 10px;
  border-radius: 20px;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
  bottom: -20px;
}

.avatar-button {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 15px;
}

.user-basic-info h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
}

.user-basic-info p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.user-form {
  padding: 0 30px 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.skill-select {
  width: 100%;
}

.projects-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.submit-button {
  padding: 10px 30px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.reset-button {
  padding: 10px 30px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.reset-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.resume-section {
  max-width: 800px;
  margin: 30px auto 0;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.resume-section:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.resume-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.upload-section {
  margin-bottom: 20px;
}

.upload-demo {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-demo:hover {
  border-color: #667eea;
  background: #f0f2f5;
}

.upload-demo.has-file {
  border-color: #67c23a;
  background: #f0f9eb;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.upload-icon {
  font-size: 48px;
  color: #667eea;
  margin-bottom: 10px;
}

.upload-text h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.upload-text p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.resume-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.ai-button {
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  border: none;
  color: white;
}

.ai-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(103, 194, 58, 0.4);
}

.ai-button:disabled {
  background: #909399;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }

  .avatar-container {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .resume-actions {
    flex-direction: column;
  }
}
</style>
