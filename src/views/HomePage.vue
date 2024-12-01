<template>
    <div class="home">
        <RealTimeAirQuality :city="city" @city-change="updateCity"/>
        <ForeCast :city="city"/>
    </div>
</template>

<script setup>
    import RealTimeAirQuality from '../components/RealTimeAirQuality.vue'
    import ForeCast from '../components/ForeCast.vue'
</script>

<style scoped>
    .home {
        padding: 20px;
    }
</style>