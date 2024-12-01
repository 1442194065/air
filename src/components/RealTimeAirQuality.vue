<template>
    <div class="air-quality-info">
      <h2>实时空气质量数据</h2>
      <div class="input-container">
      <input
        v-model="city"
        placeholder="请输入城市名称"
        class="city-input"
        @keyup.enter="fetchAirQualityData"
      />
      <button @click="fetchAirQualityData" class="fetch-button">查询</button>
    </div>
      <div v-if="loading" class="loading-message">
        加载中，请稍候...
      </div>
      <div v-else>
        <div v-if="airQualityData" class="data-container">
          <div class="data-item">
            <span class="data-label">城市：</span>
            <span class="data-value">{{ airQualityData.city.name }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">空气质量指数 (AQI)：</span>
            <span class="data-value">{{ airQualityData.aqi }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">主导污染物：</span>
            <span class="data-value">{{ airQualityData.dominantpol || '暂无数据' }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">更新时间：</span>
            <span class="data-value">{{ airQualityData.time.localTime }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">数据来源：</span>
            <span class="data-value">
              <ul>
                <li v-for="source in airQualityData.attributions" :key="source.url">
                  <a :href="source.url" target="_blank" class="source-link">
                    {{ source.name }}
                  </a>
                </li>
              </ul>
            </span>
          </div>
        </div>
        <div v-if="!loading" ref="chart" class="chart"></div>
      </div>
    </div>
</template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue';
  import { getAirQuality } from '@/api/airQualityService';
  import { processAirQualityData } from '@/utils/processData';
  import * as echarts from 'echarts';
  
  const city = ref('hangzhou'); // 位置
  const loading = ref(false); // 加载状态
  const airQualityData = ref(null); // 存储处理后的数据
  const chart = ref(null); // 图表 DOM 引用
  
  // 获取空气质量数据并处理
  const fetchAirQualityData = async () => {
    console.log('Fetching air quality data for city:', city.value);
    if (!city.value.trim()) {
    alert('请输入有效的城市名称');
    return;
  }
    try {
      console.log('Fetching air quality data for city:', city.value);
      const response = await getAirQuality(city.value.trim());
      console.log('Raw air quality data:', response);
      const processedData = processAirQualityData(response);
      console.log('Processed air quality data:', processedData);
      airQualityData.value = processedData;

      nextTick(() => {
      console.log('Chart DOM after nextTick:', chart.value);
      renderChart(processedData);
    });
      console.log('Chart rendered');
    } catch (error) {
      console.error('获取空气质量数据失败', error);
    } finally {
      loading.value = false;
    }
  };
  
  // 渲染图表
  const renderChart = (data) => {
  
    console.log('Rendering chart with data:', data);
    console.log('Chart container:', chart.value);
    if (!chart.value) {
      console.error('图表容器未初始化');
      return;
    }
  
    const iaqi = data.iaqi;
  
    const barData = [
      { name: 'CO', value: iaqi.co?.v || 0 },
      { name: 'H(温度)', value: iaqi.h?.v || 0 },
      { name: 'NO₂', value: iaqi.no2?.v || 0 },
      { name: 'O₃', value: iaqi.o3?.v || 0 },
      { name: 'P(气压)', value: iaqi.p?.v || 0 },
      { name: 'PM10', value: iaqi.pm10?.v || 0 },
      { name: 'PM2.5', value: iaqi.pm25?.v || 0 },
      { name: 'SO₂', value: iaqi.so2?.v || 0 },
      { name: 'T(温度)', value: iaqi.t?.v || 0 },
      { name: 'W(风速)', value: iaqi.w?.v || 0 },
    ];
  
    const myChart = echarts.init(chart.value)
  
    const option = {
      title: {
        text: '实时空气质量柱状图',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: barData.map((item) => item.name),
      },
      yAxis: {
        type: 'value',
        name: '浓度值',
      },
      series: [
        {
          name: '浓度值',
          type: 'bar',
          data: barData.map((item) => item.value),
        },
      ],
    };
  
    myChart.setOption(option);
  };
  
  // 组件挂载时获取数据
  onMounted(() => {
    fetchAirQualityData(); // 确保在 DOM 更新后调用
});

  </script>
  
  <style scoped>
  .air-quality-info {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.5em;
    color: #333;
  }

  .input-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.city-input {
  width: 70%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.fetch-button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.fetch-button:hover {
  background-color: #0056b3;
}
  
  .loading-message {
    text-align: center;
    font-size: 1.2em;
    color: #888;
  }
  
  .data-container {
    margin-bottom: 20px;
    padding: 10px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .data-item {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .data-label {
    font-weight: bold;
    color: #555;
  }
  
  .data-value {
    font-weight: 500;
    color: #222;
    text-align: right;
  }
  
  .source-link {
    color: #007BFF;
    text-decoration: none;
    font-size: 0.9em;
  }
  
  .source-link:hover {
    text-decoration: underline;
  }
  
  .chart {
    width: 100%;
    height: 400px;
    display: block;
    margin-top: 20px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
  
  