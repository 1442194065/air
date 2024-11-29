<template>
    <div id="app">
        <Header />
        <main>
            <Home />  <!-- 你将放置可视化图表和数据交互的页面 -->
        </main>
        <Footer />
    </div>
</template>

<script setup>
    import Header from './components/AppHeader.vue'
    import Home from './views/HomePage.vue'
    import Footer from './components/AppFooter.vue'
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
