<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="createUser" class="create-button">
        <el-icon><Plus /></el-icon> 新增用户
      </el-button>
    </div>

    <el-card class="search-card">
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户"
          prefix-icon="Search"
          class="search-input"
        >
          <template #append>
            <el-button
              type="primary"
              @click="searchUsers"
              class="search-button"
            >
              搜索
            </el-button>
          </template>
        </el-input>
        <el-select
          v-model="filterRole"
          placeholder="角色"
          style="margin-left: 10px"
          class="role-select"
        >
          <el-option label="全部" value="" />
          <el-option label="学生" value="student" />
          <el-option label="团队管理员" value="team" />
          <el-option label="系统管理员" value="admin" />
        </el-select>
      </div>
    </el-card>

    <el-card class="users-card">
      <el-table :data="users" style="width: 100%" class="users-table">
        <el-table-column prop="username" label="用户名" width="180">
          <template #default="scope">
            <div class="user-info">
              <el-avatar :size="32" :src="scope.row.avatar">
                {{ scope.row.username?.[0] }}
              </el-avatar>
              <span class="username">{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="250" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="scope">
            <el-tag :type="getRoleType(scope.row.role)" class="role-tag">
              {{ getRoleText(scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <div class="table-actions">
              <el-button
                size="small"
                @click="editUser(scope.row)"
                class="edit-button"
              >
                <el-icon><Edit /></el-icon> 编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="deleteUser(scope.row._id)"
                class="delete-button"
              >
                <el-icon><Delete /></el-icon> 删除
              </el-button>
            </div>
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
          class="pagination-component"
        />
      </div>
    </el-card>

    <!-- 编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isCreate ? '新增用户' : '编辑用户'"
      width="500px"
      class="user-dialog"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editFormRef"
        label-width="100px"
        class="user-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="editForm.email"
            type="email"
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option label="学生" value="student" />
            <el-option label="团队管理员" value="team" />
            <el-option label="系统管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="editForm.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" class="cancel-button"
            >取消</el-button
          >
          <el-button type="primary" @click="saveUser" class="save-button"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Plus, Edit, Delete, Search } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";

const users = ref([
  {
    _id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    createdAt: "2026-01-01",
  },
  {
    _id: "2",
    username: "team1",
    email: "team1@example.com",
    role: "team",
    createdAt: "2026-01-02",
  },
  {
    _id: "3",
    username: "student1",
    email: "student1@example.com",
    role: "student",
    createdAt: "2026-01-03",
  },
]);

const searchQuery = ref("");
const filterRole = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(users.value.length);
const dialogVisible = ref(false);
const isCreate = ref(false);
const editForm = ref({});
const editFormRef = ref(null);

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const getRoleType = (role) => {
  switch (role) {
    case "admin":
      return "danger";
    case "team":
      return "warning";
    case "student":
      return "info";
    default:
      return "";
  }
};

const getRoleText = (role) => {
  switch (role) {
    case "admin":
      return "系统管理员";
    case "team":
      return "团队管理员";
    case "student":
      return "学生";
    default:
      return role;
  }
};

const searchUsers = () => {
  console.log("搜索:", searchQuery.value, filterRole.value);
};

const createUser = () => {
  isCreate.value = true;
  editForm.value = {
    username: "",
    email: "",
    role: "student",
    password: "",
  };
  dialogVisible.value = true;
};

const editUser = (user) => {
  isCreate.value = false;
  editForm.value = { ...user };
  dialogVisible.value = true;
};

const deleteUser = (id) => {
  ElMessageBox.confirm("确定要删除该用户吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      users.value = users.value.filter((user) => user._id !== id);
      total.value = users.value.length;
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

const saveUser = async () => {
  if (!editFormRef.value) return;

  const valid = await editFormRef.value.validate();
  if (valid) {
    if (isCreate.value) {
      // 新增用户
      users.value.push({
        ...editForm.value,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      });
      ElMessage.success("新增成功");
    } else {
      // 编辑用户
      const index = users.value.findIndex(
        (user) => user._id === editForm.value._id,
      );
      if (index !== -1) {
        users.value[index] = { ...editForm.value };
        ElMessage.success("保存成功");
      }
    }
    total.value = users.value.length;
    dialogVisible.value = false;
  }
};

const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (current) => {
  currentPage.value = current;
};
</script>

<style scoped>
.user-management {
  min-height: 100vh;

  padding: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.create-button {
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.create-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.search-card {
  margin-bottom: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.search-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.search-bar {
  display: flex;
  padding: 20px;
  gap: 15px;
}

.search-input {
  flex: 1;
  max-width: 400px;
  border-radius: 8px;
}

.role-select {
  width: 150px;
  border-radius: 8px;
}

.users-card {
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.users-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.users-table {
  overflow: hidden;
}

.users-table .el-table__header-wrapper th {
  font-weight: 500;
  font-size: 14px;
  height: 56px;
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.role-tag {
  border-radius: 16px;
  padding: 4px 16px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state {
  padding: 60px 0;
  display: flex;
  justify-content: center;
}

.table-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.edit-button {
  padding: 6px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 13px;
}

.delete-button {
  padding: 6px 16px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 13px;
}

.pagination {
  display: flex;
  justify-content: center;
  padding: 24px;
}

.user-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.user-dialog .el-dialog__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 16px 16px 0 0;
}

.user-form {
  padding: 30px 24px;
}

.user-form .el-form-item {
  margin-bottom: 24px;
}

.user-form .el-input {
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.user-form .el-input:hover {
  border-color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.user-form .el-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 24px;
  background: #f5f7fa;
  border-radius: 0 0 16px 16px;
}

.cancel-button {
  font-size: 14px;
  border: 1px solid #e4e7ed;
  background: white;
  border-radius: 8px;
  padding: 10px 30px;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.save-button {
  border-radius: 8px;
  padding: 10px 30px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-management {
    padding: 20px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding-bottom: 15px;
  }

  .page-header h2 {
    font-size: 24px;
  }

  .search-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
    padding: 20px;
  }

  .search-input {
    max-width: none;
  }

  .role-select {
    width: 100%;
  }

  .users-table .el-table__header-wrapper th {
    font-size: 12px;
  }

  .table-actions {
    flex-direction: column;
    gap: 8px;
  }

  .edit-button,
  .delete-button {
    width: 100%;
  }
}
</style>
