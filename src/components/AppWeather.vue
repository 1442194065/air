<!-- src/components/Weather.vue -->
<template>
    <div v-if="weatherData" class="weather-container">
        <h2>{{ weatherData.city.name }} 的实时空气质量</h2>
        <p>空气质量指数（AQI）：{{ weatherData.aqi }}</p>
        <p>PM2.5：{{ weatherData.iaqi.pm25.v }}</p>
        <p>更新时间：{{ weatherData.time.s }} ({{ weatherData.time.tz }})</p>
        <div   class="hover-container">
            <!-- 按钮 -->
            <button  @click="handleMouseEnter" class="hover-button">查看标准</button>
            <!-- 表格 -->
            <div class="hover-table" v-show="isHovered">
              <table>
                <thead>
                  <tr>
                    <th>污染物</th>
                    <th>一级标准</th>
                    <th>二级标准</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PM2.5</td>
                    <td>35</td>
                    <td>75</td>
                  </tr>
                  <tr>
                    <td>PM10</td>
                    <td>50</td>
                    <td>150</td>
                  </tr>
                  <tr>
                    <td>O₃</td>
                    <td>100</td>
                    <td>160</td>
                  </tr>
                  <tr>
                    <td>NO₂</td>
                    <td>80</td>
                    <td>80</td>
                  </tr>
                  <tr>
                    <td>SO₂</td>
                    <td>50</td>
                    <td>150</td>
                  </tr>
                  <tr>
                    <td>CO</td>
                    <td>4</td>
                    <td>4</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
    import { ref } from 'vue';


        // 使用 ref 创建响应式数据
    const isHovered = ref(false);

    // 处理鼠标进入事件
    function handleMouseEnter() {
    isHovered.value = !isHovered.value;
    }


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


.hover-button {
  align-items: center;
  background-color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: 3rem;
  padding: calc(.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;
}

.hover-button:hover,
.hover-button:focus {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  color: rgba(0, 0, 0, 0.65);
}

.hover-button:hover {
  transform: translateY(-1px);
}

.hover-button:active {
  background-color: #F0F0F1;
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
  color: rgba(0, 0, 0, 0.65);
  transform: translateY(0);
}
/* 表格样式 */
.hover-table {
display: none;
position: absolute; /* 改为 absolute，确保相对于父容器定位 */
border: 1px solid #ddd;
background-color: white;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
z-index: 1000;
left:90%;
top: calc(var(--mouse-y) - 30px);
}

/* 表格内容 */
table {
  width: 100%;
  border-collapse: collapse;
}
.hover-container{
  margin-top:10px;
  padding-left: 40%;
  padding-right: 40%;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f4f4f4;
}
.hover-container{
  margin-top:10px;
  padding: 10px 20px;
}
/* 鼠标悬浮时显示表格 */
 .hover-table {
  display: block;
}
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