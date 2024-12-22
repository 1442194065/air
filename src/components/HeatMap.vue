<template>
  <div
    class="card"
    style="
      max-width: 800px; 

      padding: 20px; 
      background-color: #fff; 
      border-radius: 8px; 
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
      border: 1px solid #f0f0f0;"
  >
      <h2>历史天气污染数据查看</h2>
     
      <!-- 选择年份的下拉列表 -->
      <div class="filters-container">
        <div class="filter">
              <label for="city-select">选择城市：</label>
              <select id="city-select" v-model="currentCity">
                  <option v-for="city in availableCities" :key="city" :value="city">
                      {{ city }}
                  </option>
              </select>
          </div>

          <div class="filter">
              <label for="year-select">选择年份：</label>
              <select id="year-select" v-model="currentYear">
                  <option v-for="year in availableYears" :key="year" :value="year">
                      {{ year }}
                  </option>
              </select>
          </div>

          <div class="filter">
              <label for="pollution-select">选择污染物：</label>
              <select id="pollution-select" v-model="currentPollution">
                  <option v-for="pollution in availablePollutions" :key="pollution" :value="pollution">
                      {{ pollution }}
                  </option>
              </select>
          </div>

          <div class="filter">
              <label for="standard-select">按国家标准展示：</label>
              <select id="standard-select" v-model="currentStandard">
                  <option v-for="standard in availableStandards" :key="standard" :value="standard">
                      {{ standard }}
                  </option>
              </select>
          </div>
      </div>
      <!-- 显示 ECharts 图表的容器 -->
      <div ref="heatmap" style="width: 100%; height: 250px;"></div>、
      <div class="hover-container">
    <!-- 按钮 -->
    <button @click="handleMouseEnter" class="hover-button" >查看标准</button>
    <!-- 表格 -->
    <div class="hover-table" >
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
  </div>
</template>

<script>
import { onMounted, ref ,watch} from 'vue';
import * as echarts from 'echarts';
import Papa from 'papaparse';

export default {

  name: 'AirQualityHeatmap',  // 组件名称
  setup() {
    const heatmap = ref(null);  // 使用 Vue ref 引用图表容器
    const csvData = ref([]);    // 存储 CSV 数据
    const currentYear = ref(2023)
    const availableYears = ref([2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]); // 可选年份列表
    const currentPollution = ref('pm25')
    const availablePollutions = ref(['pm25', 'pm10', 'o3', 'no2', 'so2', 'co'])
    const currentCity = ref('杭州')
    const availableCities = ref(['上海', '杭州', '北京', '沈阳', '广州', '深圳', '成都', '沈阳' , '武汉' , '南京' ])
    const switchCityNameToEnglish = {
      上海: 'Shanghai',
      北京: 'Beijing',
      深圳: 'Shenzhen',
      广州: 'Guangzhou',
      重庆: 'Chongqing',
      杭州: 'Hangzhou',
      武汉: 'Wuhan',
      南京: 'Nanjing',
      成都: 'Chengdu',
      沈阳: 'Shenyang'
    };
    const availableStandards = ref(['一级','二级','无']);
    const currentStandard = ref('无');
    const standard_to_pollution = {
      '一级': {
        'pm25': 35,
        'pm10': 50,
        'o3': 100,
        'no2': 80,
        'so2': 50,
        'co': 4
      },
      '二级': {
        'pm25': 75,
        'pm10': 150,
        'o3': 160,
        'no2': 80,
        'so2': 150,
        'co': 4
      }
    }
    const isHovered = ref(false);

    // 处理鼠标进入事件
    function handleMouseEnter() {
    isHovered.value = !isHovered.value;
    }

    // 读取本地 CSV 文件
    const loadCSVData = async () => {
      const curretCityEnglish = switchCityNameToEnglish[currentCity.value];
      try {
        console.log(curretCityEnglish+'csv');
        const response = await fetch(curretCityEnglish+'.csv');
        const csvText = await response.text();

        // 使用 PapaParse 解析 CSV 数据
        Papa.parse(csvText, {
          complete: (result) => {
            csvData.value = result.data;
            prepareChartData();
          },
          header: true,
        });
      } catch (error) {
        console.error('Error loading CSV file:', error);
      }
    };

    // 处理 CSV 数据并生成图表需要的数据
    const prepareChartData = () => {
      console.log(csvData);
      const groupedData = {};  // 存储按年份分组的数据

      csvData.value.forEach((row) => {
          const date = row.date;
          const pm25 = row[' pm25'] ? parseInt(row[' pm25'].trim()) : 0;
          const validPm25 = isNaN(pm25) ? 0 : pm25;

          const pm10 = row[' pm10'] ? parseInt(row[' pm25'].trim()) : 0;
          const validPm10 = isNaN(pm10) ? 0 : pm10;

          const o3 = row[' o3'] ? parseInt(row[' o3'].trim()) : 0;
          const validO3 = isNaN(o3) ? 0 : o3;

          const no2 = row[' no2'] ? parseInt(row[' no2'].trim()) : 0;
          const validNo2 = isNaN(no2) ? 0 : no2;

          const co = row[' co'] ? parseInt(row[' co'].trim()) : 0;
          const validCo = isNaN(co) ? 0 : co;

          const so2 = row[' so2'] ? parseInt(row[' so2'].trim()) : 0;
          const validSo2 = isNaN(so2) ? 0 : so2;

          if (date && pm25) {
          const timestamp = new Date(date).getTime();  // 将日期转换为时间戳
          const year = new Date(date).getFullYear();  // 提取年份

          if (!groupedData[year]) {
              groupedData[year] = [];
          }

          const pollutants = {
              pm25: validPm25,
              pm10: validPm10,
              o3: validO3,
              no2: validNo2,
              co: validCo,
              so2: validSo2,
          };

          // 遍历所有污染物，将数据按污染物存储为二维数组
          Object.keys(pollutants).forEach((pollution) => {
              const pollutionValue = pollutants[pollution];
              if (pollutionValue > 0) {  // 只有当污染物值大于 0 时才保存数据
              if (!groupedData[year][pollution]) {
                  groupedData[year][pollution] = [];
              }
              groupedData[year][pollution].push([timestamp, pollutionValue]);
              }
          });
          }
      });
        var newGroupedData = groupedData[currentYear.value][currentPollution.value];

        if(currentStandard.value === '一级'){
          newGroupedData = newGroupedData.map((item) => {
            const threshold = standard_to_pollution['一级'][currentPollution.value];
            return [item[0], item[1] > threshold ? 1 : 0];
          });
        }else if(currentStandard.value === '二级'){
          newGroupedData = newGroupedData.map((item) => {
            const threshold = standard_to_pollution['二级'][currentPollution.value];
            return [item[0], item[1] > threshold ? 1 : 0];
          });
        }
        console.log('newGroupedData',newGroupedData);
      renderChart(newGroupedData);  // 渲染当前年份和污染物的数据
    };

    // 渲染 ECharts 图表
    const renderChart = (data) => {
      const values = data.map(item => item[1]);
      const pollutionColorRanges = {
          pm25: ['#f1e6b9', '#d94e5d'],  // PM2.5：浅黄到深红
          pm10: ['#a9e0b0', '#237A57'],  // PM10：浅紫到深紫
          o3: ['#f1f8fd', '#2980b9'],    // O3：浅蓝到深蓝
          no2: ['#f1e6f6', '#b22222'],    // NO2：浅紫到深红
          co: ['#d9f2f8', '#34495e'],    // CO：浅蓝到深灰
          so2: ['#f1e6f6', '#8e44ad'],    // SO2：浅紫到深紫
      };
      // 使用 Math.min 和 Math.max 求最小值和最大值
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const currentColorRange = pollutionColorRanges[currentPollution.value] || pollutionColorRanges.pm25;


      const option = {
        title: {
          top: 30,
          left: 'center',
          text: 'History Air Quality '+ currentYear.value.toString() +' ' + currentPollution.value.toUpperCase(),
        },
        tooltip: {},
        visualMap: {
          min: minValue,
          max: maxValue,
          type: 'piecewise',
          orient: 'horizontal',
          left: 'center',
          top: 65,
          inRange: {
              color: currentColorRange,  // 根据当前污染物选择不同的颜色范围
          },
        },
        calendar: {
          top: 120,
          left: 30,
          right: 30,
          cellSize: ['auto', 13],
          range: currentYear.value.toString(),
          itemStyle: {
            borderWidth: 0.5,
          },
          yearLabel: { show: false },
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: data,
        },
      };
      
      if(maxValue == 1||minValue == 0){
        option.visualMap.pieces = [
        { min: 0, max: 0.5, label: '达标' },
        { min: 0.5, max: 1, label: '不达标' }
      ]
      }else{
        option.visualMap.inRange = {
          color: currentColorRange,
        };
        delete option.visualMap.pieces;
        console.log('option.visualMap',option.visualMap);
        if (heatmap.value) {
          echarts.dispose(heatmap.value);  // 销毁原来的实例
        }
      }
      // 初始化 ECharts 实例并设置选项
      if (heatmap.value) {
        const chart = echarts.init(heatmap.value);  // 使用 ref 来引用容器
        chart.setOption(option);
      }
    };

    watch(currentYear, () => {
       prepareChartData();
    });
    watch(currentStandard, () => {
      console.log('currentStandard',currentStandard.value);
       prepareChartData();
    })
    watch(currentPollution, () => {
       prepareChartData();
    })
    watch(currentCity, () => {
       loadCSVData();
    })
    onMounted(() => {
      loadCSVData();
    });
    

    return {
      heatmap,
      currentYear,  // 双向绑定 currentYear
      availableYears,  // 可选年份列表
      currentPollution,
      availablePollutions,
      currentCity,
      availableCities,
      currentStandard,
      availableStandards,
      standard_to_pollution,
      isHovered: false, // 控制表格显示
    };
  },
};
</script>

<style scoped>

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
  left: var(--mouse-x); /* 使用 CSS 变量设置位置 */
  top: var(--mouse-y);
}

/* 表格内容 */
table {
  width: 100%;
  border-collapse: collapse;
}
.hover-container{
  margin-top:10px;
  padding: 10px 20px;
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
  padding-left: 40%;
  padding-right: 40%;
}
/* 鼠标悬浮时显示表格 */
.hover-container:hover .hover-table {
  display: block;
}
  .filters-container {
      display: flex;
      gap: 20px; /* 添加间隔 */
      margin-bottom: 20px; /* 底部间隔 */
      align-items: center;
  }

  .filter {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
  }

  label {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
      color: #333;
  }

  select {
      padding: 8px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 150px;
      outline: none;
  }

      select:focus {
          border-color: #56b2d4;
          box-shadow: 0 0 5px rgba(86, 178, 212, 0.5);
      }


  .container {
      max-width: 1200px; /* 限制最大宽度为 1200px */
      margin: 0 auto; /* 居中显示 */
      padding: 20px;
  }

  #chart {
      width: 100%;
      height: 500px;
  }
</style>
