<template>
    <div class="home">
        <div class="filters">
            <label for="date">选择日期范围：</label>
            <input type="date" v-model="startDate" />
            <input type="date" v-model="endDate" />
            <button @click="filterData">筛选数据</button>
        </div>

        <div class="chart-container">
            <div ref="chart" class="chart"></div>
        </div>

        <RealTimeAirQuality />

    </div>
</template>

<!-- <script>
    export default {
        name: 'HomePage'  // 修改组件名
    }
</script> -->

<script setup>
import { ref, onMounted} from 'vue'
import * as echarts from 'echarts'
import RealTimeAirQuality from '../components/RealTimeAirQuality.vue'

const airQualityData = [
  { date: '2024-01-01', pm25: 45, pm10: 60, co: 0.4, lat: 39.9, lon: 116.4 },
  { date: '2024-01-02', pm25: 50, pm10: 55, co: 0.3, lat: 39.92, lon: 116.38 },
  // 更多数据...
]

const startDate = ref('2024-01-01')
const endDate = ref('2024-01-05')
const chart = ref(null)

const filterData = () => {
  const filteredData = airQualityData.filter(item => item.date >= startDate.value && item.date <= endDate.value)
  renderChart(filteredData)
}

const renderChart = (data) => {
  const dates = data.map(item => item.date)
  const pm25 = data.map(item => item.pm25)
  const pm10 = data.map(item => item.pm10)
  const co = data.map(item => item.co)
  // const latitudes = data.map(item => item.lat)
  // const longitudes = data.map(item => item.lon)

  const myChart = echarts.init(chart.value)

  const option = {
    title: {
      text: '空气质量指数 (PM2.5, PM10, CO)',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['PM2.5', 'PM10', 'CO'],
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'PM2.5',
        data: pm25,
        type: 'line',
        smooth: true,
      },
      {
        name: 'PM10',
        data: pm10,
        type: 'line',
        smooth: true,
      },
      {
        name: 'CO',
        data: co,
        type: 'line',
        smooth: true,
      },
    ],
    // 热力图展示示例
    visualMap: {
      min: 0,
      max: 100,
      type: 'continuous',
      inRange: {
        color: ['blue', 'green', 'yellow', 'red'],
      },
    }
  }

  myChart.setOption(option)
}

onMounted(() => {
  renderChart(airQualityData)
})
</script>

<style scoped>
    .home {
        padding: 20px;
    }

    .filters {
        margin-bottom: 20px;
    }

    .chart-container {
        width: 100%;
        height: 400px;
    }

    .chart {
        width: 100%;
        height: 100%;
    }
</style>

