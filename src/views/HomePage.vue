<template>
    <div class="home">
        <!-- 按钮选择 -->
        <div class="component-selector">
            <button v-for="component in components"
                    :key="component.name"
                    :class="{ active: activeComponents.includes(component.name) }"
                    @click="toggleComponent(component.name)">
                {{ component.label }}
            </button>
        </div>

        <!-- 动态显示子组件 -->
        <div class="components-container">
            <RealTimeAirQuality v-if="activeComponents.includes('RealTimeAirQuality')" :city="city" @city-change="updateCity" />
            <ForeCast v-if="activeComponents.includes('ForeCast')" :city="city" />
            <HeatMap v-if="activeComponents.includes('HeatMap')" :city="city" />
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import RealTimeAirQuality from '../components/RealTimeAirQuality.vue'
    import ForeCast from '../components/ForeCast.vue'
    import HeatMap from '../components/HeatMap.vue'

    // 定义组件的元信息
    const components = ref([
        { name: 'RealTimeAirQuality', label: '实时空气质量' },
        { name: 'ForeCast', label: '天气预报' },
        { name: 'HeatMap', label: '热力图' },
    ])

    // 激活的组件数组
    const activeComponents = ref([])

    // 当前城市
    const city = ref('shanghai')

    // 切换组件激活状态
    const toggleComponent = (componentName) => {
        if (activeComponents.value.includes(componentName)) {
            // 如果组件已激活，则移除
            activeComponents.value = activeComponents.value.filter(name => name !== componentName)
        } else {
            // 如果组件未激活，则添加
            activeComponents.value.push(componentName)
        }
    }

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
        display: flex;
        gap: 10px;
        flex-wrap: wrap; /* 使按钮在屏幕空间不足时换行 */
    }

    button {
        padding: 10px 20px;
        font-size: 14px;
        cursor: pointer;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f9f9f9;
        transition: background-color 0.3s, color 0.3s;
    }

        button.active {
            background-color: #007BFF;
            color: white;
            border-color: #0056b3;
        }

    .components-container {
        display: flex;
        flex-wrap: wrap; /* 如果组件过多，可以换行 */
        gap: 20px;
        margin-top: 20px;
    }

        .components-container > * {
            flex: 1 1 calc(33% - 20px); /* 每个组件占页面三分之一宽度，减去间隔 */
            min-width: 300px; /* 设置组件最小宽度 */
        }
</style>
