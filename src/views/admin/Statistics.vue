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
        <div id="positionTypeChart" style="width: 100%; height: 400px;"></div>
      </el-card>
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <h3>申请趋势</h3>
          </div>
        </template>
        <div id="applicationTrendChart" style="width: 100%; height: 400px;"></div>
      </el-card>
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <h3>技能需求分布</h3>
          </div>
        </template>
        <div id="skillDemandChart" style="width: 100%; height: 400px;"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const totalUsers = ref(120)
const totalPositions = ref(30)
const totalApplications = ref(350)
const avgMatchScore = ref(78)

let positionTypeChart = null
let applicationTrendChart = null
let skillDemandChart = null

const initCharts = () => {
  // 职位类型分布
  positionTypeChart = echarts.init(document.getElementById('positionTypeChart'))
  positionTypeChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '职位类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 15, name: '实习' },
          { value: 10, name: '全职' },
          { value: 5, name: '兼职' }
        ]
      }
    ]
  })

  // 申请趋势
  applicationTrendChart = echarts.init(document.getElementById('applicationTrendChart'))
  applicationTrendChart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [30, 40, 60, 80, 100, 120],
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#667eea'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
          ])
        }
      }
    ]
  })

  // 技能需求分布
  skillDemandChart = echarts.init(document.getElementById('skillDemandChart'))
  skillDemandChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['Vue', 'React', 'Node.js', 'JavaScript', 'Python', 'UI设计']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [12, 8, 10, 15, 7, 5],
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ])
        }
      }
    ]
  })
}

const handleResize = () => {
  positionTypeChart?.resize()
  applicationTrendChart?.resize()
  skillDemandChart?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  positionTypeChart?.dispose()
  applicationTrendChart?.dispose()
  skillDemandChart?.dispose()
})
</script>

<style scoped>
.statistics {
  padding: 20px;
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
}

.chart-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}
</style>