<template>
  <div class="system-settings">
    <h2>系统配置</h2>
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <h3>基础设置</h3>
        </div>
      </template>
      <el-form
        :model="settings"
        :rules="rules"
        ref="settingsFormRef"
        label-width="100px"
      >
        <el-form-item label="系统名称" prop="systemName">
          <el-input
            v-model="settings.systemName"
            placeholder="请输入系统名称"
          />
        </el-form-item>
        <el-form-item label="Logo上传" prop="logo">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleLogoChange"
            :file-list="logoFileList"
          >
            <el-button type="primary">
              <el-icon><Paperclip /></el-icon> 选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="备案号" prop="icp">
          <el-input v-model="settings.icp" placeholder="请输入备案号" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="settings-card" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <h3>AI模型配置</h3>
        </div>
      </template>
      <el-form :model="settings.ai" :rules="aiRules" label-width="100px">
        <el-form-item label="AI服务商" prop="provider">
          <el-select
            v-model="settings.ai.provider"
            placeholder="请选择AI服务商"
          >
            <el-option label="通义千问" value="qwen" />
            <el-option label="OpenAI" value="openai" />
            <el-option label="智谱AI" value="zhipu" />
            <el-option label="文心一言" value="ernie" />
          </el-select>
        </el-form-item>
        <el-form-item label="API Key" prop="apiKey">
          <el-input
            v-model="settings.ai.apiKey"
            type="password"
            placeholder="请输入API Key"
          >
            <template #append>
              <el-button @click="updateApiKey">更新</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="模型选择" prop="model">
          <el-select v-model="settings.ai.model" placeholder="请选择模型">
            <el-option label="qwen-plus" value="qwen-plus" />
            <el-option label="qwen-turbo" value="qwen-turbo" />
            <el-option label="gpt-3.5-turbo" value="gpt-3.5-turbo" />
            <el-option label="gpt-4" value="gpt-4" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用功能">
          <el-checkbox-group v-model="settings.ai.features">
            <el-checkbox value="resumeParse">简历解析</el-checkbox>
            <el-checkbox value="smartMatch">智能匹配</el-checkbox>
            <el-checkbox value="aiInterview">AI面试</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="settings-card" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <h3>权限配置</h3>
        </div>
      </template>
      <div class="permission-section">
        <h4>团队负责人权限</h4>
        <el-checkbox-group v-model="settings.permissions.team">
          <el-checkbox value="publishPosition">发布职位</el-checkbox>
          <el-checkbox value="screenResume">筛选简历</el-checkbox>
          <el-checkbox value="deletePosition">删除职位</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="permission-section" style="margin-top: 20px">
        <h4>学生权限</h4>
        <el-checkbox-group v-model="settings.permissions.student">
          <el-checkbox value="browse">浏览</el-checkbox>
          <el-checkbox value="apply">投递</el-checkbox>
          <el-checkbox value="viewOthers">查看他人信息</el-checkbox>
        </el-checkbox-group>
      </div>
    </el-card>

    <div class="action-buttons" style="margin-top: 30px">
      <el-button type="primary" @click="saveSettings" :loading="loading">
        保存配置
      </el-button>
      <el-button @click="resetToDefault"> 恢复默认 </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Paperclip } from "@element-plus/icons-vue";

const settingsFormRef = ref(null);
const loading = ref(false);
const logoFileList = ref([]);

const settings = ref({
  systemName: "学生团队招聘系统",
  logo: "",
  icp: "",
  ai: {
    provider: "qwen",
    apiKey: "********************",
    model: "qwen-plus",
    features: ["resumeParse", "smartMatch", "aiInterview"],
  },
  permissions: {
    team: ["publishPosition", "screenResume"],
    student: ["browse", "apply"],
  },
});

const rules = {
  systemName: [{ required: true, message: "请输入系统名称", trigger: "blur" }],
};

const aiRules = {
  provider: [{ required: true, message: "请选择AI服务商", trigger: "change" }],
  apiKey: [{ required: true, message: "请输入API Key", trigger: "blur" }],
  model: [{ required: true, message: "请选择模型", trigger: "change" }],
};

const handleLogoChange = (file) => {
  logoFileList.value = [file];
  settings.value.logo = file.name;
};

const updateApiKey = () => {
  // 模拟更新API Key
  ElMessage.success("API Key已更新");
};

const saveSettings = async () => {
  if (!settingsFormRef.value) return;

  await settingsFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // 模拟保存配置
        setTimeout(() => {
          ElMessage.success("配置保存成功");
          loading.value = false;
        }, 1000);
      } catch (error) {
        ElMessage.error("保存失败，请稍后重试");
        loading.value = false;
      }
    }
  });
};

const resetToDefault = () => {
  ElMessageBox.confirm("确定要恢复默认配置吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      settings.value = {
        systemName: "学生团队招聘系统",
        logo: "",
        icp: "",
        ai: {
          provider: "qwen",
          apiKey: "********************",
          model: "qwen-plus",
          features: ["resumeParse", "smartMatch", "aiInterview"],
        },
        permissions: {
          team: ["publishPosition", "screenResume"],
          student: ["browse", "apply"],
        },
      };
      logoFileList.value = [];
      ElMessage.success("已恢复默认配置");
    })
    .catch(() => {});
};

onMounted(() => {
  // 模拟加载配置
  console.log("加载配置");
});
</script>

<style scoped>
.system-settings {
  padding: 20px;
}

.system-settings h2 {
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.settings-card {
  transition: box-shadow 0.3s ease;
}

.settings-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.permission-section h4 {
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 10px;
}
</style>
