<template>
    <div class="home">
        <div class="filters">
            <label for="city">选择城市：</label>
            <input type="text" v-model="city" placeholder="输入城市名称" />
            <button @click="fetchWeatherData">获取天气数据</button>
        </div>

        <Weather v-if="weatherData" :data="weatherData" />

        <div class="chart-container" v-if="chartData.length">
            <div ref="chart" class="chart"></div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import * as echarts from 'echarts'
    import Weather from '../components/AppWeather.vue'
    import axios from 'axios'

    const city = ref('shanghai')
    const weatherData = ref(null)
    const chart = ref(null)
    const chartData = ref([])

    // 获取天气数据
    const fetchWeatherData = async () => {
        try {
            const response = await axios.get(`https://api.waqi.info/feed/${city.value}/?token=demo`)
            if (response.data.status === 'ok') {
                weatherData.value = response.data.data
                prepareChartData(response.data.data.forecast.daily)
            } else {
                alert('获取数据失败：' + response.data.message)
            }
        } catch (error) {
            console.error('请求失败:', error)
        }
    }

    // 准备并渲染图表数据
    const prepareChartData = (forecast) => {
        chartData.value = forecast.pm25.map(day => ({
            date: day.day,
            value: day.avg,
        }))
        renderChart(chartData.value)
    }

    const renderChart = (data) => {
        const dates = data.map(item => item.date)
        const values = data.map(item => item.value)

        const myChart = echarts.init(chart.value)

        const option = {
            title: {
                text: 'PM2.5 预测',
            },
            tooltip: {
                trigger: 'axis',
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
                    data: values,
                    type: 'line',
                    smooth: true,
                },
            ],
        }

        myChart.setOption(option)
    }

    onMounted(() => {
        fetchWeatherData()
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
