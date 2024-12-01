<template>
    <div class="container">
        <h2>历史天气污染数据查看</h2>
        <!-- 选择年份的下拉列表 -->
        <div class="filters-container">
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
        </div>
        <!-- 显示 ECharts 图表的容器 -->
        <div ref="heatmap" style="width: 100%; height: 500px;"></div>
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
      const currentYear = ref(2014)
      const availableYears = ref([2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]); // 可选年份列表
      const currentPollution = ref('no2')
      const availablePollutions = ref(['pm25', 'pm10', 'o3', 'no2', 'so2', 'co'])

      // 读取本地 CSV 文件
      const loadCSVData = async () => {
        try {
          const response = await fetch('argriculture.csv');
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

            renderChart(groupedData[currentYear.value][currentPollution.value]);  // 渲染当前年份和污染物的数据
        };

      // 渲染 ECharts 图表
      const renderChart = (data) => {
        const values = data.map(item => item[1]);

        // 使用 Math.min 和 Math.max 求最小值和最大值
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);

        const pollutionColorRanges = {
            pm25: ['#f1e6b9', '#d94e5d'],  // PM2.5：浅黄到深红
            pm10: ['#a9e0b0', '#237A57'],  // PM10：浅紫到深紫
            o3: ['#f1f8fd', '#2980b9'],    // O3：浅蓝到深蓝
            no2: ['#f1e6f6', '#b22222'],    // NO2：浅紫到深红
            co: ['#d9f2f8', '#34495e'],    // CO：浅蓝到深灰
            so2: ['#f1e6f6', '#8e44ad'],    // SO2：浅紫到深紫
        };
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

        // 初始化 ECharts 实例并设置选项
        if (heatmap.value) {
          const chart = echarts.init(heatmap.value);  // 使用 ref 来引用容器
          chart.setOption(option);
        }
      };

      watch(currentYear, () => {
         prepareChartData();
      });
      watch(currentPollution, () => {
         prepareChartData();
      })
      onMounted(() => {
        loadCSVData();
      });


      return {
        heatmap,
        currentYear,  // 双向绑定 currentYear
        availableYears,  // 可选年份列表
        currentPollution,
        availablePollutions
      };
    },
  };
</script>

<style scoped>
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
