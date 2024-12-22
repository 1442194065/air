<template>
    <div id="app"  :style="backgroundStyle" >
        <Header />
        <main>
            <Home @update-aqi="updateAqi" />  <!-- 你将放置可视化图表和数据交互的页面 -->
        </main>
        <Footer />
    </div>
</template>

<script setup>
    import Header from './components/AppHeader.vue'
    import Home from './views/HomePage.vue'
    import Footer from './components/AppFooter.vue'
    import { ref, computed } from 'vue'

    const aqi = ref(0)
    console.log("App aqi: ", aqi.value)

    const backgroundStyle = computed(() => {
        console.log("aqi in backgroundStyle: ", aqi.value)
        let backgroundUrl = require('@/assets/background.jpeg')
        if (aqi.value <= 150) {
            backgroundUrl = require('@/assets/background.jpeg')
        } else {
            backgroundUrl = require('@/assets/background2.jpeg')
        }
        return {
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
        }
    })
    const updateAqi = (newAqi) => {
        aqi.value = newAqi
        console.log("App received AQI:", aqi.value)
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        text-align: center;
        color: #2c3e50;
        margin-top: 15px;
    }
</style>
