<template>
    <div class="home">
        <RealTimeAirQuality />
        <ForeCast />
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