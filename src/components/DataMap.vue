<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
export default {
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
    loadLeafletMap() {
      const L = window.L;
      const OSM_URL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const OSM_ATTRIB = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      const osmLayer = L.tileLayer(OSM_URL, { attribution: OSM_ATTRIB });

      const WAQI_URL = "https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=_TOKEN_ID_";
      const WAQI_ATTR = 'Air Quality Tiles &copy; <a href="http://waqi.info">waqi.info</a>';
      const waqiLayer = L.tileLayer(WAQI_URL, { attribution: WAQI_ATTR });

      const map = L.map('map').setView([51.505, -0.09], 11);
      map.addLayer(osmLayer).addLayer(waqiLayer);
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
