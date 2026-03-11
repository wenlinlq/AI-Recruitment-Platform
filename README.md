# 学生团队招聘系统（AI 增强版）

基于 Vue 3 的学生团队/社团招新平台，集 AI 智能匹配、简历解析、模拟面试等功能于一体，面向学生、团队负责人和管理员三类角色。

## 项目简介

本系统旨在帮助校园学生团队（如学生会、社团、实验室）更高效地完成招新：学生可以浏览职位、投递简历、进行 AI 模拟面试；团队负责人可以发布职位、管理候选人、使用 AI 辅助筛选和面试；管理员负责用户与团队管理、数据统计及系统配置。

## 技术栈

| 技术 | 说明 |
|------|------|
| **Vue 3** | 前端框架，使用 Composition API |
| **Vite 7** | 构建工具 |
| **Vue Router 5** | 路由管理 |
| **Pinia** | 状态管理 |
| **Element Plus** | UI 组件库 |
| **ECharts** | 数据可视化 |
| **Axios** | HTTP 请求 |

## 功能模块

### 学生端
- **首页**：招聘门户、热门团队与职位、招新数据看板
- **招聘大厅**：职位浏览、多维度筛选、AI 智能推荐、匹配度展示
- **职位详情**：职位信息、AI 匹配分析、一键投递、收藏
- **我的投递**：申请记录、状态追踪、面试进度、AI 反馈与建议
- **个人中心**：个人信息、简历上传与管理、AI 简历解析与优化建议
- **AI 面试模拟**：按岗位进行模拟面试、实时 AI 建议

### 团队管理端
- **团队仪表盘**：招聘概况、投递趋势、AI 招聘建议、待办事项
- **职位管理**：发布/编辑职位、投递统计、AI 辅助生成职位描述
- **候选人管理**：简历筛选、AI 智能排序、面试安排、评价记录
- **AI 面试中心**：AI 生成面试题、面试辅助与评价

### 管理员端
- **用户管理**：用户账号管理、批量导入与导出
- **团队管理**：团队与部门维护
- **统计总览**：平台活跃度、团队排行、AI 洞察
- **系统配置**：基础设置、AI 模型配置、权限配置

## 项目结构

```
├── src/
│   ├── api/           # API 接口（当前为模拟数据）
│   ├── router/        # 路由配置
│   ├── store/         # Pinia 状态
│   ├── views/         # 页面组件
│   │   ├── admin/     # 管理员端页面
│   │   ├── team-admin/ # 团队管理端页面
│   │   ├── Home.vue
│   │   ├── Positions.vue
│   │   ├── PositionDetail.vue
│   │   ├── Applications.vue
│   │   ├── Profile.vue
│   │   ├── AIInterview.vue
│   │   └── ...
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js
```

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 启动开发服务

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 路由与权限

- 公开页面：`/`（首页）、`/login`、`/register`
- 学生端：`/positions`、`/position/:id`、`/applications`、`/profile`、`/ai-interview`
- 团队端：`/team-admin` 及其子路由（dashboard、positions、candidates、ai-interview）
- 管理端：`/admin` 及其子路由（users、teams、stats、settings）

未登录用户访问需登录页面时，将自动跳转到登录页。

## 后端对接说明

当前前端使用 **模拟数据** 运行。如需对接真实后端：

1. 在 `src/api/index.js` 中将模拟接口替换为实际 API 调用
2. 在 `vite.config.js` 中配置 API 代理（如将 `/api` 代理到后端服务）
3. 确保后端支持认证（JWT/Bearer Token），并在请求头中携带 `Authorization`

## 设计文档

更详细的界面与交互设计见：[学生团队招聘系统（AI增强版）- 前端界面全景图](./学生团队招聘系统（AI增强版）-%20前端界面全景图.md)

## 许可证

本项目仅供学习与校内使用。
