<template>
  
  <div>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      displaycity: '',
      city: '', // 搜索框中的城市名称
      map: null, // 地图实例
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
</style>
