<template>
  <div class="team-management">
    <h2>团队管理</h2>
    <div class="actions">
      <el-button type="primary" @click="addTeam">
        <el-icon><Plus /></el-icon> 新增团队
      </el-button>
    </div>

    <el-table :data="teams" style="width: 100%">
      <el-table-column prop="name" label="团队名称" width="200" />
      <el-table-column prop="department" label="所属部门" width="150" />
      <el-table-column prop="description" label="团队描述" />
      <el-table-column prop="leaderId" label="负责人" width="150" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="editTeam(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="deleteTeam(scope.row._id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="teams.length === 0" class="empty-state">
      <el-empty description="暂无团队" />
    </div>

    <!-- 新增/编辑团队对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑团队' : '新增团队'">
      <el-form :model="teamForm" :rules="rules" ref="teamFormRef" label-width="80px">
        <el-form-item label="团队名称" prop="name">
          <el-input v-model="teamForm.name" />
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-input v-model="teamForm.department" />
        </el-form-item>
        <el-form-item label="团队描述" prop="description">
          <el-input v-model="teamForm.description" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="负责人" prop="leaderId">
          <el-input v-model="teamForm.leaderId" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTeam">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const teams = ref([
  {
    _id: '1',
    name: '前端开发团队',
    department: '技术部',
    description: '负责前端项目开发',
    leaderId: 'team1'
  },
  {
    _id: '2',
    name: '后端开发团队',
    department: '技术部',
    description: '负责后端服务开发',
    leaderId: 'team2'
  },
  {
    _id: '3',
    name: '设计团队',
    department: '设计部',
    description: '负责UI/UX设计',
    leaderId: 'team3'
  }
])
const dialogVisible = ref(false)
const isEdit = ref(false)
const teamForm = ref({})
const teamFormRef = ref(null)

const rules = {
  name: [
    { required: true, message: '请输入团队名称', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请输入所属部门', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入团队描述', trigger: 'blur' }
  ],
  leaderId: [
    { required: true, message: '请输入负责人', trigger: 'blur' }
  ]
}

const addTeam = () => {
  isEdit.value = false
  teamForm.value = {
    name: '',
    department: '',
    description: '',
    leaderId: ''
  }
  dialogVisible.value = true
}

const editTeam = (team) => {
  isEdit.value = true
  teamForm.value = { ...team }
  dialogVisible.value = true
}

const deleteTeam = (id) => {
  ElMessageBox.confirm('确定要删除该团队吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    teams.value = teams.value.filter(team => team._id !== id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const saveTeam = async () => {
  if (!teamFormRef.value) return
  
  await teamFormRef.value.validate(async (valid) => {
    if (valid) {
      if (isEdit.value) {
        const index = teams.value.findIndex(team => team._id === teamForm.value._id)
        if (index !== -1) {
          teams.value[index] = { ...teamForm.value }
        }
      } else {
        teams.value.push({
          ...teamForm.value,
          _id: Date.now().toString()
        })
      }
      ElMessage.success('保存成功')
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.team-management {
  padding: 20px;
}

.team-management h2 {
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.actions {
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}
</style>