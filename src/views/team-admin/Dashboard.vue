<template>
  <div class="team-dashboard">
    <h2>团队仪表盘</h2>
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon><Briefcase /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.positions }}</div>
            <div class="stat-label">发布职位</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.applications }}</div>
            <div class="stat-label">收到申请</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.interviews }}</div>
            <div class="stat-label">AI面试</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.matchRate }}%</div>
            <div class="stat-label">匹配率</div>
          </div>
        </div>
      </el-card>
    </div>

    <el-card class="chart-card">
      <template #header>
        <div class="chart-header">
          <h3>申请趋势</h3>
        </div>
      </template>
      <div id="applicationTrendChart" style="width: 100%; height: 400px;"></div>
    </el-card>

    <el-card class="chart-card" style="margin-top: 20px;">
      <template #header>
        <div class="chart-header">
          <h3>技能分布</h3>
        </div>
      </template>
      <div id="skillDistributionChart" style="width: 100%; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Briefcase, User, ChatDotRound, TrendCharts } from '@element-plus/icons-vue'

const stats = ref({
  positions: 8,
  applications: 45,
  interviews: 23,
  matchRate: 78
})

let applicationTrendChart = null
let skillDistributionChart = null

const initCharts = () => {
  // 申请趋势图
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
        data: [5, 8, 12, 15, 18, 22],
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

  // 技能分布图
  skillDistributionChart = echarts.init(document.getElementById('skillDistributionChart'))
  skillDistributionChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '技能分布',
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 12, name: 'Vue' },
          { value: 8, name: 'React' },
          { value: 10, name: 'Node.js' },
          { value: 15, name: 'JavaScript' },
          { value: 7, name: 'Python' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}

const handleResize = () => {
  applicationTrendChart?.resize()
  skillDistributionChart?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  applicationTrendChart?.dispose()
  skillDistributionChart?.dispose()
})
</script>

<style scoped>
.team-dashboard {
  padding: 20px;
}

.team-dashboard h2 {
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.stat-icon .el-icon {
  font-size: 28px;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
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