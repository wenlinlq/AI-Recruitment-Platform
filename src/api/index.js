import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 模拟数据
const mockPositions = [
  {
    _id: '1',
    teamId: '1',
    title: '前端开发实习生',
    type: '实习',
    requirements: '熟悉Vue 3、JavaScript，了解前端工程化',
    responsibilities: '参与前端项目开发，协助完成页面搭建和功能实现',
    status: 'active',
    deadline: '2026-04-01',
    aiAnalysis: {
      skills: ['Vue 3', 'JavaScript', 'CSS'],
      difficulty: 'medium',
      estimatedApplicants: 50
    }
  },
  {
    _id: '2',
    teamId: '2',
    title: '后端开发实习生',
    type: '实习',
    requirements: '熟悉Node.js、MongoDB，了解RESTful API开发',
    responsibilities: '参与后端服务开发，负责API接口实现和数据库操作',
    status: 'active',
    deadline: '2026-04-15',
    aiAnalysis: {
      skills: ['Node.js', 'MongoDB', 'Express'],
      difficulty: 'medium',
      estimatedApplicants: 45
    }
  },
  {
    _id: '3',
    teamId: '3',
    title: 'UI设计实习生',
    type: '实习',
    requirements: '熟悉Figma、Photoshop，有良好的审美能力',
    responsibilities: '参与产品UI设计，协助完成界面原型和视觉设计',
    status: 'active',
    deadline: '2026-03-31',
    aiAnalysis: {
      skills: ['Figma', 'Photoshop', 'UI设计'],
      difficulty: 'easy',
      estimatedApplicants: 30
    }
  }
]

// API方法
export default {
  // 认证相关
  auth: {
    register: (data) => Promise.resolve({ success: true, data: { token: 'mock-token', user: data } }),
    login: (data) => Promise.resolve({ success: true, data: { token: 'mock-token', user: { ...data, role: 'student' } } })
  },
  // 职位相关
  positions: {
    getList: () => Promise.resolve({ success: true, data: mockPositions }),
    getDetail: (id) => Promise.resolve({ success: true, data: mockPositions.find(p => p._id === id) }),
    create: (data) => Promise.resolve({ success: true, data: { ...data, _id: Date.now().toString() } }),
    update: (id, data) => Promise.resolve({ success: true, data: { ...data, _id: id } }),
    delete: (id) => Promise.resolve({ success: true })
  },
  // 申请相关
  applications: {
    create: (data) => Promise.resolve({ success: true, data: { ...data, _id: Date.now().toString() } }),
    getStudentList: () => Promise.resolve({ success: true, data: [] }),
    getPositionList: (positionId) => Promise.resolve({ success: true, data: [] })
  },
  // AI相关
  ai: {
    parseResume: (file) => Promise.resolve({ success: true, data: { name: '张三', skills: ['Vue', 'JavaScript'] } }),
    match: (positionId, data) => Promise.resolve({ success: true, data: { score: 85, matchedSkills: ['Vue', 'JavaScript'] } }),
    generateInterviewQuestions: (data) => Promise.resolve({ success: true, data: { questions: ['请介绍一下你的项目经验', '你如何解决遇到的技术难题'] } }),
    optimizeResume: (data) => Promise.resolve({ success: true, data: { suggestions: ['突出项目经验', '强调技术栈'] } })
  }
}