<template>
  <div class="statistics">
    <h2>数据统计</h2>
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-item">
          <div class="stat-value">{{ totalUsers }}</div>
          <div class="stat-label">总用户数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-item">
          <div class="stat-value">{{ totalPositions }}</div>
          <div class="stat-label">发布职位数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-item">
          <div class="stat-value">{{ totalApplications }}</div>
          <div class="stat-label">总申请数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-item">
          <div class="stat-value">{{ avgMatchScore }}%</div>
          <div class="stat-label">平均匹配度</div>
        </div>
      </el-card>
    </div>

    <div class="charts-container">
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <h3>职位类型分布</h3>
          </div>
        </template>
        <div id="positionTypeChart" style="width: 100%; height: 400px"></div>
      </el-card>
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <h3>申请趋势</h3>
          </div>
        </template>
        <div
          id="applicationTrendChart"
          style="width: 100%; height: 400px"
        ></div>
      </el-card>
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <h3>技能需求分布</h3>
            <div class="chart-controls">
              <el-radio-group v-model="skillCategory" size="small">
                <el-radio-button value="all">全部技能</el-radio-button>
                <el-radio-button value="frontend">前端技能</el-radio-button>
                <el-radio-button value="backend">后端技能</el-radio-button>
                <el-radio-button value="other">其他技能</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </template>
        <div class="chart-content">
          <div id="skillDemandChart" style="width: 100%; height: 400px"></div>
          <div class="skill-insights">
            <h4>技能需求洞察</h4>
            <ul>
              <li v-for="(insight, index) in skillInsights" :key="index">
                {{ insight }}
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts";

const totalUsers = ref(120);
const totalPositions = ref(30);
const totalApplications = ref(350);
const avgMatchScore = ref(78);
const skillCategory = ref("all");

const skillInsights = ref([
  "JavaScript 是目前最热门的技能需求",
  "前端框架（Vue、React）需求持续增长",
  "后端技能中 Node.js 需求较高",
  "Python 技能在数据相关岗位中需求旺盛",
]);

const skillData = {
  all: {
    names: ["Vue", "React", "Node.js", "JavaScript", "Python", "UI设计"],
    values: [12, 8, 10, 15, 7, 5],
  },
  frontend: {
    names: ["Vue", "React", "JavaScript", "UI设计", "HTML/CSS", "TypeScript"],
    values: [12, 8, 15, 5, 10, 7],
  },
  backend: {
    names: ["Node.js", "Python", "Java", "PHP", "Go", "C++"],
    values: [10, 7, 6, 4, 3, 2],
  },
  other: {
    names: ["UI设计", "产品经理", "数据分析", "运营", "测试", "DevOps"],
    values: [5, 4, 3, 6, 8, 2],
  },
};

let positionTypeChart = null;
let applicationTrendChart = null;
let skillDemandChart = null;

const initCharts = () => {
  // 职位类型分布
  positionTypeChart = echarts.init(
    document.getElementById("positionTypeChart"),
  );
  positionTypeChart.setOption({
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "职位类型",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "18",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 15, name: "实习" },
          { value: 10, name: "全职" },
          { value: 5, name: "兼职" },
        ],
      },
    ],
  });

  // 申请趋势
  applicationTrendChart = echarts.init(
    document.getElementById("applicationTrendChart"),
  );
  applicationTrendChart.setOption({
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["1月", "2月", "3月", "4月", "5月", "6月"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [30, 40, 60, 80, 100, 120],
        type: "line",
        smooth: true,
        lineStyle: {
          color: "#667eea",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(102, 126, 234, 0.5)" },
            { offset: 1, color: "rgba(102, 126, 234, 0.1)" },
          ]),
        },
      },
    ],
  });

  // 技能需求分布
  skillDemandChart = echarts.init(document.getElementById("skillDemandChart"));
  updateSkillChart();

  // 监听技能分类变化
  watch(skillCategory, () => {
    updateSkillChart();
  });
};

// 更新技能需求图表
const updateSkillChart = () => {
  if (!skillDemandChart) return;

  const data = skillData[skillCategory.value];
  skillDemandChart.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: data.names,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: data.values,
        type: "bar",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#667eea" },
            { offset: 1, color: "#764ba2" },
          ]),
        },
      },
    ],
  });
};

const handleResize = () => {
  positionTypeChart?.resize();
  applicationTrendChart?.resize();
  skillDemandChart?.resize();
};

onMounted(() => {
  initCharts();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  positionTypeChart?.dispose();
  applicationTrendChart?.dispose();
  skillDemandChart?.dispose();
});
</script>

<style scoped>
.statistics {
  padding: 20px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  /* 隐藏滚动条但保持滚动功能 */
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.statistics::-webkit-scrollbar {
  display: none;
}

.statistics h2 {
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
}

.chart-card {
  transition: box-shadow 0.3s ease;
  overflow: visible;
}

.chart-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.chart-controls {
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
}

.chart-content {
  position: relative;
  overflow: visible;
}

/* 确保技能洞察部分不会被挡住 */
.skill-insights {
  margin-top: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  width: 100%;
  box-sizing: border-box;
}

.skill-insights h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.skill-insights ul {
  margin: 0;
  padding-left: 20px;
}

.skill-insights li {
  margin-bottom: 8px;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.skill-insights li:last-child {
  margin-bottom: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .chart-controls {
    width: 100%;
  }

  .el-radio-group {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .el-radio-button {
    margin-bottom: 8px;
  }
}
</style>
