<!-- src/components/Weather.vue -->
<template>
    <div v-if="weatherData" class="weather-container">
        <h2>{{ weatherData.city.name }} 的实时空气质量</h2>
        <p>空气质量指数（AQI）：{{ weatherData.aqi }}</p>
        <p>PM2.5：{{ weatherData.iaqi.pm25.v }}</p>
        <p>更新时间：{{ weatherData.time.s }} ({{ weatherData.time.tz }})</p>
    </div>
    <div v-else>
        <p>加载中...</p>
    </div>
</template>

<script setup>
    import { defineProps } from 'vue'; // 确保导入 defineProps
    defineProps({
        weatherData: {
            type: Object,
            required: true,
        }
    })
</script>


<style scoped>
    .weather-container {
        padding: 20px;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
    }
</style>