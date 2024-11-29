<!-- src/components/Footer.vue -->
<template>
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 城市空气质量可视分析系统 | 所有权利保留</p>
            <div class="links">
                <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">关于我们</a>
                <a href="https://www.example.com/privacy" target="_blank" rel="noopener noreferrer">隐私政策</a>
                <a href="https://www.example.com/contact" target="_blank" rel="noopener noreferrer">联系我们</a>
            </div>
        </div>
    </footer>
</template>


<script setup>
// Footer 组件不需要额外的 JavaScript 逻辑
</script>

<style scoped>
    .footer {
        background-color: #333;
        color: white;
        padding: 20px 0;
        text-align: center;
        font-size: 14px;
    }

        .footer .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
        }

        .footer .links {
            margin-top: 10px;
        }

            .footer .links a {
                color: #aaa;
                margin: 0 15px;
                text-decoration: none;
            }

                .footer .links a:hover {
                    color: #fff;
                }
</style>
<script>
    export default {
        name: 'AppFooter'  // 修改组件名
    }
</script>