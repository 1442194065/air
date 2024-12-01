<template>
    <div class="home">
        <!-- 选择组件的输入框 -->
        <div class="component-selector">
            <label for="component-select">选择显示的组件:</label>
            <select v-model="selectedComponent" id="component-select">
                <option value="RealTimeAirQuality">实时空气质量</option>
                <option value="ForeCast">天气预报</option>
            </select>
        </div>

        <!-- 动态显示子组件 -->
        <RealTimeAirQuality v-if="selectedComponent === 'RealTimeAirQuality'" :city="city" @city-change="updateCity" />
        <ForeCast v-if="selectedComponent === 'ForeCast'" :city="city" />
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import RealTimeAirQuality from '../components/RealTimeAirQuality.vue'
    import ForeCast from '../components/ForeCast.vue'

    const city = ref('shanghai') // 默认城市
    const selectedComponent = ref('RealTimeAirQuality') // 默认显示实时空气质量组件

    // 更新城市的方法
    const updateCity = (newCity) => {
        city.value = newCity
    }
</script>

<style scoped>
    .home {
        padding: 20px;
    }

    .component-selector {
        margin-bottom: 20px;
    }

    select {
        padding: 5px 10px;
        font-size: 16px;
        border-radius: 5px;
    }
</style>
