<template>
  <div class="team-positions">
    <div class="page-header">
      <h2>职位管理</h2>
      <el-button type="primary" @click="showCreateDialog">
        <el-icon><Plus /></el-icon> 发布职位
      </el-button>
    </div>

    <el-card class="positions-card">
      <el-table :data="positions" style="width: 100%">
        <el-table-column prop="title" label="职位名称" width="200" />
        <el-table-column prop="type" label="职位类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeColor(scope.row.type)">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="requirements" label="职位要求" />
        <el-table-column prop="deadline" label="截止日期" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="viewPosition(scope.row)">
              查看
            </el-button>
            <el-button size="small" type="primary" @click="editPosition(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deletePosition(scope.row._id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建/编辑职位对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑职位' : '发布职位'" width="600px">
      <el-form :model="positionForm" :rules="rules" ref="positionFormRef" label-width="100px">
        <el-form-item label="职位名称" prop="title">
          <el-input v-model="positionForm.title" placeholder="请输入职位名称" />
        </el-form-item>
        <el-form-item label="职位类型" prop="type">
          <el-select v-model="positionForm.type" placeholder="请选择职位类型">
            <el-option label="实习" value="实习" />
            <el-option label="全职" value="全职" />
            <el-option label="兼职" value="兼职" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位要求" prop="requirements">
          <el-input v-model="positionForm.requirements" type="textarea" rows="4" placeholder="请输入职位要求" />
        </el-form-item>
        <el-form-item label="工作职责" prop="responsibilities">
          <el-input v-model="positionForm.responsibilities" type="textarea" rows="4" placeholder="请输入工作职责" />
        </el-form-item>
        <el-form-item label="截止日期" prop="deadline">
          <el-date-picker v-model="positionForm.deadline" type="date" placeholder="选择截止日期" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePosition" :loading="loading">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const positions = ref([
  {
    _id: '1',
    title: '前端开发实习生',
    type: '实习',
    requirements: '熟悉Vue 3、JavaScript，了解前端工程化',
    responsibilities: '参与前端项目开发，协助完成页面搭建和功能实现',
    deadline: '2026-04-01',
    status: 'active'
  },
  {
    _id: '2',
    title: '后端开发实习生',
    type: '实习',
    requirements: '熟悉Node.js、MongoDB，了解RESTful API开发',
    responsibilities: '参与后端服务开发，负责API接口实现和数据库操作',
    deadline: '2026-04-15',
    status: 'active'
  },
  {
    _id: '3',
    title: 'UI设计实习生',
    type: '实习',
    requirements: '熟悉Figma、Photoshop，有良好的审美能力',
    responsibilities: '参与产品UI设计，协助完成界面原型和视觉设计',
    deadline: '2026-03-31',
    status: 'closed'
  }
])

const dialogVisible = ref(false)
const isEdit = ref(false)
const loading = ref(false)
const positionFormRef = ref(null)
const positionForm = ref({
  title: '',
  type: '实习',
  requirements: '',
  responsibilities: '',
  deadline: ''
})

const rules = {
  title: [
    { required: true, message: '请输入职位名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择职位类型', trigger: 'change' }
  ],
  requirements: [
    { required: true, message: '请输入职位要求', trigger: 'blur' }
  ],
  responsibilities: [
    { required: true, message: '请输入工作职责', trigger: 'blur' }
  ],
  deadline: [
    { required: true, message: '请选择截止日期', trigger: 'change' }
  ]
}

const getTypeColor = (type) => {
  switch (type) {
    case '实习': return 'info'
    case '全职': return 'success'
    case '兼职': return 'warning'
    default: return ''
  }
}

const getStatusType = (status) => {
  switch (status) {
    case 'active': return 'success'
    case 'closed': return 'info'
    case 'draft': return 'warning'
    default: return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'active': return '招聘中'
    case 'closed': return '已结束'
    case 'draft': return '草稿'
    default: return status
  }
}

const showCreateDialog = () => {
  isEdit.value = false
  positionForm.value = {
    title: '',
    type: '实习',
    requirements: '',
    responsibilities: '',
    deadline: ''
  }
  dialogVisible.value = true
}

const editPosition = (row) => {
  isEdit.value = true
  positionForm.value = { ...row }
  dialogVisible.value = true
}

const viewPosition = (row) => {
  console.log('查看职位:', row)
}

const deletePosition = (id) => {
  ElMessageBox.confirm('确定要删除该职位吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    positions.value = positions.value.filter(p => p._id !== id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const savePosition = async () => {
  if (!positionFormRef.value) return
  
  await positionFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (isEdit.value) {
          const index = positions.value.findIndex(p => p._id === positionForm.value._id)
          if (index !== -1) {
            positions.value[index] = { ...positionForm.value }
          }
        } else {
          positions.value.push({
            ...positionForm.value,
            _id: Date.now().toString(),
            status: 'active'
          })
        }
        dialogVisible.value = false
        ElMessage.success(isEdit.value ? '更新成功' : '发布成功')
      } catch (error) {
        ElMessage.error('保存失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.team-positions {
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

.positions-card {
  transition: box-shadow 0.3s ease;
}

.positions-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style>