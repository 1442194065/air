<template>
  
  <div
    style="
      max-width: 600px; 
      margin-left: 70px;
      padding: 20px; 
      background-color: #fff; 
      border-radius: 8px; 
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
      border: 1px solid #f0f0f0;"
  >
    <h2>城市空气质量分布图 - 当前城市: {{ displaycity }}</h2>
    <!-- 城市搜索框 -->
    <input 
      v-model="city" 
      type="text" 
      placeholder="输入城市名/地名,按下回车搜索" 
      @keyup.enter="searchCity" 
      style="padding: 8px; margin-bottom: 10px; width: 300px; border-radius: 4px; border: 1px solid #ccc;"
    />
    <div id="map"></div>
    <div class="hover-container">
    <!-- 按钮 -->
    <button class="hover-button">查看标准</button>
    <!-- 表格 -->
    <div class="hover-table">
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
                    <td>PM2.5(&mu;g/m<sup>3</sup>)</td>
                    <td>35</td>
                    <td>75</td>
                  </tr>
                  <tr>
                    <td>PM10(&mu;g/m<sup>3</sup>)</td>
                    <td>50</td>
                    <td>150</td>
                  </tr>
                  <tr>
                    <td>O₃(&mu;g/m<sup>3</sup>)</td>
                    <td>100</td>
                    <td>160</td>
                  </tr>
                  <tr>
                    <td>NO₂(&mu;g/m<sup>3</sup>)</td>
                    <td>80</td>
                    <td>80</td>
                  </tr>
                  <tr>
                    <td>SO₂(mg/m<sup>3</sup>)</td>
                    <td>50</td>
                    <td>150</td>
                  </tr>
                  <tr>
                    <td>CO(&mu;g/m<sup>3</sup>)</td>
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
export default {
  data() {
    return {
      displaycity: '',
      city: '', // 搜索框中的城市名称
      map: null, // 地图实例
      isHovered: false, // 控制表格显示
      osmLayer: null, // OpenStreetMap 图层
      waqiLayer: null // 空气质量图层
    };
  },
  mounted() {
    // 加载 Leaflet 的 CSS 文件
    this.loadStyle('http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.css')
      .then(() => {
        // 加载 Leaflet 的 JavaScript 文件
        return this.loadScript('http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js');
      })
      .then(() => {
        // 加载地图
        this.loadLeafletMap();
      })
      .catch((err) => {
        console.error("Error loading Leaflet files", err);
      });
  },
  methods: {
    handleMouseEnter() {
      console.log('鼠标进入');
      this.isHovered = true;
    },
    handleMouseLeave() {
      this.isHovered = false;
    },
    // 动态加载外部样式
    loadStyle(url) {
      return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    },
    // 动态加载外部脚本
    loadScript(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    },
    // 加载 Leaflet 地图
    loadLeafletMap() {
      const L = window.L;
      const OSM_URL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const OSM_ATTRIB = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      this.osmLayer = L.tileLayer(OSM_URL, { attribution: OSM_ATTRIB });

      const WAQI_URL = "https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=_TOKEN_ID_";
      const WAQI_ATTR = 'Air Quality Tiles &copy; <a href="http://waqi.info">waqi.info</a>';
      this.waqiLayer = L.tileLayer(WAQI_URL, { attribution: WAQI_ATTR });

      this.map = L.map('map').setView([51.505, -0.09], 11); // 初始位置
      this.map.addLayer(this.osmLayer).addLayer(this.waqiLayer);
    },
    // 搜索城市，更新地图位置
    searchCity() {
      if (!this.city) return;

      // 使用 Geocoding API (这里以 Nominatim 为例)
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${this.city}`;

      fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            this.displaycity = this.city;
            // 更新地图视图
            this.map.setView([lat, lon], 11);
          } else {
            alert('未找到该城市');
          }
        })
        .catch((err) => {
          console.error('城市搜索失败', err);
        });
    }
  }
};
</script>

<style scoped>
/* 设置地图容器大小 */
#map {
  width: 100%;
  max-width: 800px;
  height: 400px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 8px;
}
/* 按钮样式 */

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
</style>
