<template>
    <div class="home">
        <!-- 按钮选择 -->
        <div class="component-selector">
            <button v-for="component in components"
                    :key="component.name"
                    :class="{ active: activeComponents.includes(component.name) }"
                    @click="toggleComponent(component.name)">
                <i :class="component.icon" class="btn-icon"></i>
                {{ component.label }}
            </button>
        </div>

        <!-- 动态显示子组件 -->
        <div class="components-container">
            <transition name="fade">
                <RealTimeAirQuality v-if="activeComponents.includes('RealTimeAirQuality')" :city="city" @city-change="updateCity" />
            </transition>
            <transition name="fade">
                <ForeCast v-if="activeComponents.includes('ForeCast')" :city="city" />
            </transition>
            <transition name="fade">
                <HeatMap v-if="activeComponents.includes('HeatMap')" :city="city" />
            </transition>
            <transition name="fade">
                <DataMap v-if="activeComponents.includes('DataMap')" :city="city" />
            </transition>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import RealTimeAirQuality from '../components/RealTimeAirQuality.vue'
    import ForeCast from '../components/ForeCast.vue'
    import HeatMap from '../components/HeatMap.vue'
    import DataMap from '../components/DataMap.vue'

    // 定义组件的元信息和图标
    const components = ref([
        { name: 'RealTimeAirQuality', label: '实时空气质量', icon: 'fas fa-smog' },
        { name: 'ForeCast', label: '天气预报', icon: 'fas fa-cloud-sun' },
        { name: 'HeatMap', label: '热力图', icon: 'fas fa-fire' },
        { name: 'DataMap', label: '数据地图', icon: 'fas fa-map-marked-alt' }
    ])

    // 激活的组件数组
    const activeComponents = ref([])

    // 当前城市
    const city = ref('shanghai')

    // 切换组件激活状态
    const toggleComponent = (componentName) => {
        if (activeComponents.value.includes(componentName)) {
            activeComponents.value = activeComponents.value.filter(name => name !== componentName)
        } else {
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
        background-color: #f4f7fc;
        min-height: 100vh;
    }

    /* 按钮选择器样式 */
    .component-selector {
        margin-bottom: 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        justify-content: center;
    }

    button {
        padding: 12px 25px;
        font-size: 16px;
        cursor: pointer;
        border: 2px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
        transition: background-color 0.3s, color 0.3s, transform 0.2s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        min-width: 160px; /* 保证按钮有足够宽度 */
    }

        button.active {
            background-color: #007bff;
            color: white;
            border-color: #0056b3;
            transform: translateY(-2px);
        }

        button:hover {
            background-color: #e6f0ff;
            color: #007bff;
        }

        button:focus {
            outline: none;
        }

    .btn-icon {
        font-size: 18px;
    }

    /* 动态组件容器 */
    .components-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-top: 20px;
        justify-content: center;
        align-items: center;
    }

        /* 1个组件时，确保居中并且占满全宽 */
        .components-container > * {
            flex: 1 1 100%;
            min-width: 300px;
        }

    /* 2个组件时每行2个 */
    @media (min-width: 768px) {
        .components-container {
            justify-content: stretch;
        }

            .components-container > * {
                flex: 1 1 calc(50% - 10px);
            }
    }

    /* 4个组件时，每行2个，2行 */
    @media (min-width: 1200px) {
        .components-container {
            grid-template-columns: repeat(2, 1fr);
            justify-items: stretch;
        }

            .components-container > * {
                flex: 1 1 calc(50% - 10px);
            }
    }

    /* fade 过渡效果 */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
        opacity: 0;
        transform: translateY(20px); /* 在消失时向下移动，进入时向上移动 */
    }

    .fade-enter-to, .fade-leave {
        opacity: 1;
        transform: translateY(0);
    }
</style>
