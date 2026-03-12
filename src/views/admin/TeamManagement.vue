<template>
  <div class="team-management">
    <div class="page-header">
      <h2>团队管理</h2>
      <div class="actions">
        <el-button type="primary" @click="addTeam" class="add-btn">
          <el-icon><Plus /></el-icon> 新增团队
        </el-button>
      </div>
    </div>

    <el-card class="team-card" shadow="hover">
      <el-table :data="teams" style="width: 100%" stripe highlight-current-row>
        <el-table-column prop="name" label="团队名称" width="200">
          <template #default="scope">
            <div class="team-name">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="所属部门" width="150" />
        <el-table-column prop="description" label="团队描述">
          <template #default="scope">
            <div class="team-description">{{ scope.row.description }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="leaderId" label="负责人" width="150" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="editTeam(scope.row)"
              class="edit-btn"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteTeam(scope.row._id)"
              class="delete-btn"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="teams.length === 0" class="empty-state">
        <el-empty description="暂无团队" />
      </div>
    </el-card>

    <!-- 新增/编辑团队对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑团队' : '新增团队'"
      width="500px"
      center
    >
      <el-form
        :model="teamForm"
        :rules="rules"
        ref="teamFormRef"
        label-width="80px"
      >
        <el-form-item label="团队名称" prop="name">
          <el-input v-model="teamForm.name" placeholder="请输入团队名称" />
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-input
            v-model="teamForm.department"
            placeholder="请输入所属部门"
          />
        </el-form-item>
        <el-form-item label="团队描述" prop="description">
          <el-input
            v-model="teamForm.description"
            type="textarea"
            rows="3"
            placeholder="请输入团队描述"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="leaderId">
          <el-input v-model="teamForm.leaderId" placeholder="请输入负责人" />
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
import { ref } from "vue";
import { Plus } from "@element-plus/icons-vue";

const teams = ref([
  {
    _id: "1",
    name: "前端开发团队",
    department: "技术部",
    description: "负责前端项目开发",
    leaderId: "team1",
  },
  {
    _id: "2",
    name: "后端开发团队",
    department: "技术部",
    description: "负责后端服务开发",
    leaderId: "team2",
  },
  {
    _id: "3",
    name: "设计团队",
    department: "设计部",
    description: "负责UI/UX设计",
    leaderId: "team3",
  },
]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const teamForm = ref({});
const teamFormRef = ref(null);

const rules = {
  name: [{ required: true, message: "请输入团队名称", trigger: "blur" }],
  department: [{ required: true, message: "请输入所属部门", trigger: "blur" }],
  description: [{ required: true, message: "请输入团队描述", trigger: "blur" }],
  leaderId: [{ required: true, message: "请输入负责人", trigger: "blur" }],
};

const addTeam = () => {
  isEdit.value = false;
  teamForm.value = {
    name: "",
    department: "",
    description: "",
    leaderId: "",
  };
  dialogVisible.value = true;
};

const editTeam = (team) => {
  isEdit.value = true;
  teamForm.value = { ...team };
  dialogVisible.value = true;
};

const deleteTeam = (id) => {
  ElMessageBox.confirm("确定要删除该团队吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      teams.value = teams.value.filter((team) => team._id !== id);
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

const saveTeam = async () => {
  if (!teamFormRef.value) return;

  await teamFormRef.value.validate(async (valid) => {
    if (valid) {
      if (isEdit.value) {
        const index = teams.value.findIndex(
          (team) => team._id === teamForm.value._id,
        );
        if (index !== -1) {
          teams.value[index] = { ...teamForm.value };
        }
      } else {
        teams.value.push({
          ...teamForm.value,
          _id: Date.now().toString(),
        });
      }
      ElMessage.success("保存成功");
      dialogVisible.value = false;
    }
  });
};
</script>

<style scoped>
.team-management {
  padding: 24px;
  min-height: 100vh;

}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  position: relative;
  padding-left: 12px;
}

.page-header h2::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: #409eff;
  border-radius: 2px;
}

.team-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.team-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.team-name {
  font-weight: 500;
  color: #333;
}

.team-description {
  line-height: 1.5;
  color: #666;
}

.add-btn {
  border-radius: 4px;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.edit-btn,
.delete-btn {
  border-radius: 4px;
  transition: all 0.3s ease;
  margin-right: 8px;
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.delete-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  background-color: #fafafa;
  border-radius: 8px;
  margin: 20px 0;
}

/* 表格行悬停效果 */
.el-table__row {
  transition: background-color 0.2s ease;
}

.el-table__row:hover {
  background-color: #f0f9ff !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .team-management {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .el-table {
    font-size: 14px;
  }

  .el-table-column {
    width: auto !important;
  }
}
</style>
