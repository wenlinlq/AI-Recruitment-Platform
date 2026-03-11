<template>
  <div class="detail-page">
    <div v-if="position" class="detail-content">
      <!-- 页面头部 -->
      <div class="page-header">
        <button class="back-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </button>
        <div class="header-content">
          <h1 class="page-title">{{ position.title }}</h1>
          <div class="header-meta">
            <el-tag size="small" :type="getTagType(position.type)">{{
              position.type
            }}</el-tag>
            <span class="deadline-text">
              <el-icon><Clock /></el-icon>
              {{ position.deadline }} 截止
            </span>
          </div>
        </div>
      </div>

      <div class="main-layout">
        <!-- 左侧：职位信息 -->
        <div class="info-column">
          <article class="info-card">
            <div class="card-accent"></div>
            <div class="card-icon-wrap card-icon-blue">
              <el-icon><Document /></el-icon>
            </div>
            <h3 class="card-title">职位要求</h3>
            <p class="card-text">{{ position.requirements }}</p>
          </article>
          <article class="info-card">
            <div class="card-accent"></div>
            <div class="card-icon-wrap card-icon-purple">
              <el-icon><Briefcase /></el-icon>
            </div>
            <h3 class="card-title">工作职责</h3>
            <p class="card-text">{{ position.responsibilities }}</p>
          </article>
          <article class="info-card ai-card" v-if="position.aiAnalysis">
            <div class="card-accent card-accent-gradient"></div>
            <div class="ai-header">
              <span class="ai-badge">AI 分析</span>
              <h3 class="card-title">智能洞察</h3>
            </div>
            <div class="ai-content">
              <div class="ai-block">
                <span class="ai-block-label">所需技能</span>
                <div class="skill-tags">
                  <span
                    v-for="skill in position.aiAnalysis.skills"
                    :key="skill"
                    class="skill-tag"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
              <div class="ai-stats">
                <div class="ai-stat">
                  <span class="ai-stat-value">{{ difficultyText }}</span>
                  <span class="ai-stat-label">难度</span>
                </div>
                <div class="ai-stat">
                  <span class="ai-stat-value">{{
                    position.aiAnalysis.estimatedApplicants
                  }}</span>
                  <span class="ai-stat-label">预计申请人数</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- 右侧：申请表单 -->
        <aside class="apply-column">
          <div class="apply-card">
            <div class="apply-card-header">
              <div class="apply-icon-wrap">
                <el-icon><EditPen /></el-icon>
              </div>
              <h3>立即申请</h3>
              <p>填写信息，一键投递简历</p>
            </div>
            <el-form
              :model="applicationForm"
              :rules="rules"
              ref="applicationFormRef"
              label-position="top"
              class="apply-form"
            >
              <el-form-item label="简历" prop="resume">
                <el-upload
                  class="resume-upload"
                  action="#"
                  :auto-upload="false"
                  :on-change="handleFileChange"
                  :file-list="fileList"
                >
                  <template #trigger>
                    <div
                      class="upload-area"
                      :class="{ hasFile: fileList.length }"
                    >
                      <div class="upload-inner">
                        <el-icon class="upload-icon"><UploadFilled /></el-icon>
                        <span class="upload-text">{{
                          fileList.length
                            ? fileList[0]?.name
                            : "点击或拖拽上传简历"
                        }}</span>
                        <span class="upload-tip">PDF、Word · 10MB 以内</span>
                      </div>
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item label="自我介绍" prop="selfIntro">
                <el-input
                  v-model="applicationForm.selfIntro"
                  type="textarea"
                  :rows="4"
                  placeholder="简要介绍你的经历、优势及申请理由..."
                  class="intro-input"
                />
              </el-form-item>
              <div class="form-actions">
                <button
                  class="apply-btn"
                  :disabled="loading"
                  @click="handleApply"
                >
                  <el-icon v-if="!loading"><Check /></el-icon>
                  <span>{{ loading ? "提交中..." : "一键投递" }}</span>
                </button>
                <button
                  class="ai-parse-btn"
                  :disabled="analyzing"
                  @click="analyzeResume"
                >
                  <el-icon><MagicStick /></el-icon>
                  <span>{{ analyzing ? "解析中..." : "AI 简历解析" }}</span>
                </button>
              </div>
            </el-form>
          </div>
        </aside>
      </div>
    </div>

    <div v-else class="loading-state">
      <div class="loading-inner">
        <el-skeleton :rows="10" animated />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  ArrowLeft,
  Clock,
  EditPen,
  UploadFilled,
  Check,
  MagicStick,
  Document,
  Briefcase,
} from "@element-plus/icons-vue";
import api from "../api";

const route = useRoute();
const router = useRouter();
const position = ref(null);
const applicationForm = ref({
  resume: "",
  selfIntro: "",
});
const fileList = ref([]);
const loading = ref(false);
const analyzing = ref(false);
const applicationFormRef = ref(null);

const getTagType = (type) => {
  const map = { 实习: "info", 全职: "success", 兼职: "warning" };
  return map[type] || "info";
};

const difficultyText = computed(() => {
  if (!position.value?.aiAnalysis?.difficulty) return "";
  const d = position.value.aiAnalysis.difficulty;
  return d === "easy" ? "简单" : d === "medium" ? "中等" : "困难";
});

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/positions");
  }
};

const rules = {
  resume: [{ required: true, message: "请上传简历", trigger: "change" }],
  selfIntro: [{ required: true, message: "请填写自我介绍", trigger: "blur" }],
};

const fetchPositionDetail = async () => {
  const id = route.params.id;
  const response = await api.positions.getDetail(id);
  if (response.success) {
    position.value = response.data;
  }
};

const handleFileChange = (file) => {
  fileList.value = [file];
  applicationForm.value.resume = file.name;
};

const analyzeResume = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning("请先上传简历");
    return;
  }

  analyzing.value = true;
  try {
    const response = await api.ai.parseResume(
      fileList.value[0]?.raw || fileList.value[0],
    );
    if (response.success) {
      ElMessage.success("简历解析成功");
      console.log("解析结果:", response.data);
    }
  } catch (error) {
    ElMessage.error("解析失败，请稍后重试");
  } finally {
    analyzing.value = false;
  }
};

const handleApply = async () => {
  if (!applicationFormRef.value) return;

  await applicationFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const response = await api.applications.create({
          positionId: route.params.id,
          ...applicationForm.value,
        });
        if (response.success) {
          ElMessage.success("投递成功");
        }
      } catch (error) {
        ElMessage.error("投递失败，请稍后重试");
      } finally {
        loading.value = false;
      }
    }
  });
};

onMounted(() => {
  window.scrollTo(0, 0);
  fetchPositionDetail();
});
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f1f5f9 0%, #f8fafc 100%);
  padding-bottom: 64px;
}

.detail-content {
  max-width: 1140px;
  margin: 0 auto;
  padding: 32px 24px 0;
}

/* 顶部 Banner */
.hero-banner {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 0 24px 24px;
  padding: 32px 32px 48px;
  margin: 0 -24px 40px;
  overflow: hidden;
}

.hero-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(
      circle at 20% 50%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 40%
    );
  pointer-events: none;
}

.back-btn {
  margin-left: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
}

.back-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.hero-body {
  position: relative;
}

.hero-badge {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 16px;
}

.hero-title {
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 700;
  color: #fff;
  margin: 0 0 16px;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.hero-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.95);
}

.meta-pill .el-icon {
  font-size: 16px;
}
.page-header {
  margin-bottom: 32px;
}
.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.header-meta :deep(.el-tag) {
  font-size: 12px;
  height: 24px;
  line-height: 22px;
  border-radius: 6px;
}

.deadline-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #64748b;
}

.deadline-text .el-icon {
  font-size: 16px;
  color: #94a3b8;
}

/* 双栏布局 */
.main-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: start;
}

@media (max-width: 920px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
}

/* 左侧信息卡片 */
.info-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.info-card:hover {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.12);
}

.card-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #667eea, #764ba2);
  border-radius: 4px 0 0 4px;
}

.card-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.card-icon-wrap .el-icon {
  font-size: 22px;
  color: #fff;
}

.card-icon-blue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.card-icon-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-title {
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px;
}

.card-text {
  font-size: 15px;
  color: #475569;
  line-height: 1.75;
  margin: 0;
}

/* AI 卡片 */
.ai-card {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.08) 0%,
    rgba(118, 75, 162, 0.06) 100%
  );
  border-color: rgba(102, 126, 234, 0.25);
}

.card-accent-gradient {
  background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
}

.ai-header {
  margin-bottom: 20px;
}

.ai-badge {
  display: inline-block;
  padding: 4px 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.ai-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ai-block-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  display: block;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  padding: 8px 16px;
  background: #fff;
  border-radius: 10px;
  font-size: 14px;
  color: #475569;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.ai-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.ai-stat {
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.ai-stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
}

.ai-stat-label {
  font-size: 12px;
  color: #64748b;
}

/* 右侧申请卡片 */
.apply-column {
  position: sticky;
  top: 24px;
}

.apply-card {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.apply-card-header {
  text-align: center;
  margin-bottom: 28px;
}

.apply-icon-wrap {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.apply-icon-wrap .el-icon {
  font-size: 28px;
  color: #fff;
}

.apply-card-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px;
}

.apply-card-header p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.apply-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.apply-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #475569;
}

/* 上传区 */
.resume-upload :deep(.el-upload) {
  width: 100%;
}

.upload-area {
  width: 100%;
  padding: 24px;
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover,
.upload-area.hasFile {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.06);
}

.upload-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  font-size: 36px;
  color: #94a3b8;
}

.upload-area:hover .upload-icon,
.upload-area.hasFile .upload-icon {
  color: #667eea;
}

.upload-text {
  font-size: 15px;
  color: #475569;
  font-weight: 500;
}

.upload-area.hasFile .upload-text {
  color: #667eea;
}

.upload-tip {
  font-size: 12px;
  color: #94a3b8;
}

.intro-input :deep(.el-textarea__inner) {
  border-radius: 12px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
}

.intro-input :deep(.el-textarea__inner:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.apply-btn,
.ai-parse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}

.apply-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.apply-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.apply-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.ai-parse-btn {
  background: #f1f5f9;
  color: #475569;
}

.ai-parse-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.ai-parse-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 加载状态 */
.loading-state {
  max-width: 800px;
  margin: 0 auto;
  padding: 64px 24px;
}

.loading-inner {
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}
</style>
