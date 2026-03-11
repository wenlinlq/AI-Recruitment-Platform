<template>
  <div class="user-management">
    <h2>用户管理</h2>
    <div class="search-bar">
      <el-input v-model="searchQuery" placeholder="搜索用户" prefix-icon="Search">
        <template #append>
          <el-button type="primary" @click="searchUsers">搜索</el-button>
        </template>
      </el-input>
      <el-select v-model="filterRole" placeholder="角色" style="margin-left: 10px;">
        <el-option label="全部" value="" />
        <el-option label="学生" value="student" />
        <el-option label="团队管理员" value="team" />
        <el-option label="系统管理员" value="admin" />
      </el-select>
    </div>

    <el-table :data="users" style="width: 100%">
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="email" label="邮箱" width="250" />
      <el-table-column prop="role" label="角色" width="120">
        <template #default="scope">
          <el-tag :type="getRoleType(scope.row.role)">
            {{ getRoleText(scope.row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="editUser(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="deleteUser(scope.row._id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="users.length === 0" class="empty-state">
      <el-empty description="暂无用户" />
    </div>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑用户对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑用户">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" type="email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role">
            <el-option label="学生" value="student" />
            <el-option label="团队管理员" value="team" />
            <el-option label="系统管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  {
    _id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2026-01-01'
  },
  {
    _id: '2',
    username: 'team1',
    email: 'team1@example.com',
    role: 'team',
    createdAt: '2026-01-02'
  },
  {
    _id: '3',
    username: 'student1',
    email: 'student1@example.com',
    role: 'student',
    createdAt: '2026-01-03'
  }
])
const searchQuery = ref('')
const filterRole = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(users.value.length)
const dialogVisible = ref(false)
const editForm = ref({})
const editFormRef = ref(null)

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const searchUsers = () => {
  // 模拟搜索功能
  console.log('搜索:', searchQuery.value, filterRole.value)
}

const getRoleType = (role) => {
  switch (role) {
    case 'admin': return 'danger'
    case 'team': return 'warning'
    case 'student': return 'info'
    default: return ''
  }
}

const getRoleText = (role) => {
  switch (role) {
    case 'admin': return '系统管理员'
    case 'team': return '团队管理员'
    case 'student': return '学生'
    default: return role
  }
}

const editUser = (user) => {
  editForm.value = { ...user }
  dialogVisible.value = true
}

const deleteUser = (id) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    users.value = users.value.filter(user => user._id !== id)
    total.value = users.value.length
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const saveUser = async () => {
  if (!editFormRef.value) return
  
  await editFormRef.value.validate(async (valid) => {
    if (valid) {
      const index = users.value.findIndex(user => user._id === editForm.value._id)
      if (index !== -1) {
        users.value[index] = { ...editForm.value }
        ElMessage.success('保存成功')
        dialogVisible.value = false
      }
    }
  })
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (current) => {
  currentPage.value = current
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.user-management h2 {
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.search-bar {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>