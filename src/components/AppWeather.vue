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
import { ref, onMounted } from 'vue';
import axios from 'axios';

const weatherData = ref(null);
const city = 'shanghai'; // 替换为需要的城市
    const token = 'c687d5338fc964e72be3c4767e54cb07cf94287b'; // 替换为你的API token

const fetchWeatherData = async () => {
  try {
    const response = await axios.get(`https://api.waqi.info/feed/${city}/?token=${token}`);
    if (response.data.status === 'ok') {
      weatherData.value = response.data.data;
    } else {
      console.error('API Error:', response.data.message);
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
};

onMounted(fetchWeatherData);
</script>

<style scoped>
    .weather-container {
        padding: 20px;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
    }
</style>
