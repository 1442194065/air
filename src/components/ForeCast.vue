<template>
    <div class="forecast">
        <div class="filters">
            <label for="city">请输入城市名称：</label>
            <input id="city"
                   v-model="city"
                   placeholder="请输入城市名称"
                   class="city-input"
                   @keydown.enter="fetchWeatherData" 
            />
            <button @click="fetchWeatherData">获取天气数据</button>
        </div>

        <Weather v-if="weatherData" :weatherData="weatherData" />

        <div class="chart-container" v-if="chartData.length">
            <div ref="chart" class="chart"></div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue'
    import * as echarts from 'echarts'
    import Weather from '../components/AppWeather.vue'
    import axios from 'axios'

    const city = ref('shanghai') // 默认选择第一个城市
    const weatherData = ref(null)
    const chart = ref(null)
    const myChart = ref(null) // 保存图表实例
    const chartData = ref([])

    // 获取天气数据
    const fetchWeatherData = async () => {
        try {
            const response = await axios.get(`https://api.waqi.info/feed/${city.value}/?token=c687d5338fc964e72be3c4767e54cb07cf94287b`)
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

    // 监听 city 的变化，实时更新天气数据
    //watch(city, () => {
    //    fetchWeatherData()
    //})

    // 准备并渲染图表数据
    const prepareChartData = (forecast) => {
        chartData.value = [
            {
                name: 'PM2.5',
                data: forecast.pm25.map(day => ({ date: day.day, value: day.avg })),
            },
            {
                name: 'PM10',
                data: forecast.pm10.map(day => ({ date: day.day, value: day.avg })),
            },
            {
                name: 'O3',
                data: forecast.o3.map(day => ({ date: day.day, value: day.avg })),
            }
        ]
        renderChart(chartData.value)
    }

    const renderChart = (data) => {
        if (!chart.value) return

        // 如果图表实例存在，清除之前的实例
        if (myChart.value) {
            myChart.value.dispose()
        }
        myChart.value = echarts.init(chart.value);

        const dates = data[0].data.map(item => item.date) // 统一取日期
        const series = data.map(item => ({
            name: item.name,
            type: 'line',
            smooth: true,
            data: item.data.map(point => point.value)
        }))

        const option = {
            title: {
                text: `${city.value} 空气质量数据`,
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: data.map(item => item.name),
            },
            xAxis: {
                type: 'category',
                data: dates,
            },
            yAxis: {
                type: 'value',
            },
            series: series,
        }

        myChart.value.setOption(option);
    }

    onMounted(() => {
        fetchWeatherData()
    })
</script>

<style scoped>
    .forecast {
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