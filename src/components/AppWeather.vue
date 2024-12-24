<!-- src/components/Weather.vue -->
<template>
    <div v-if="weatherData" class="weather-container">
        <h2 class="weather-title">{{ weatherData.city.name }} 的实时空气质量</h2>
        <div class="weather-details">
            <div class="detail-item">
                <i class="fas fa-leaf"></i>
                <span class="label">空气质量指数（AQI）：</span>
                <span class="value">{{ weatherData.aqi }}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-smog"></i>
                <span class="label">PM2.5：</span>
                <span class="value">{{ weatherData.iaqi.pm25.v }}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span class="label">更新时间：</span>
                <span class="value">
                {{ weatherData.time.s }} ({{ weatherData.time.tz }})
                </span>
            </div>
        </div>
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
        border-radius: 12px;
        max-width: 600px;
        margin: 20px auto;
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 20px;
        color: #333;
            }

    .weather-title {
        font-size: 1.8rem;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
    }
    .weather-details {
        display: flex;
        flex-direction: column;
        gap: 15px;
        align-items: center;
    }
    .detail-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.2rem;
    }
    .label {
        font-weight: bold;
        color: #555;
    }
    .value {
        font-weight: bold;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; 
    }
</style>