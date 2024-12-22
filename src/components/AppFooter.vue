<!-- src/components/Footer.vue -->
<template>
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 城市空气质量可视分析系统 | 所有权利保留</p>
            <div class="links">
                <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-info-circle"></i> 关于我们
                </a>
                <a href="https://www.example.com/privacy" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-user-secret"></i> 隐私政策
                </a>
                <a href="https://www.example.com/contact" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-phone-alt"></i> 联系我们
                </a>
            </div>
        </div>
    </footer>
</template>

<script setup>
    // 这个文件不需要额外的逻辑
</script>

<style scoped>
    /* Footer 背景渐变 */
    .footer {
        background: linear-gradient(135deg, #2c3e50, #4b6cb7); /* 渐变背景 */
        color: white;
        padding: 30px 0;
        text-align: center;
        font-size: 14px;
        border-top: 3px solid #3498db; /* 顶部边框 */
        transition: all 0.3s ease; /* 添加平滑过渡 */
    }

        /* 控制 Footer 内部内容宽度 */
        .footer .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
        }

        /* 链接容器 */
        .footer .links {
            margin-top: 20px;
        }

            /* 链接样式 */
            .footer .links a {
                color: #ddd;
                margin: 0 15px;
                text-decoration: none;
                font-size: 16px;
                display: inline-block;
                transition: all 0.3s ease; /* 添加平滑过渡 */
            }

                /* 链接悬停效果 */
                .footer .links a:hover {
                    color: #fff;
                    transform: translateY(-2px); /* 悬停时微微上移 */
                }

                /* 链接中的图标 */
                .footer .links a i {
                    margin-right: 8px; /* 图标与文字之间的间距 */
                }

    /* 响应式设计：在小屏幕上调整字体和排版 */
    @media (max-width: 768px) {
        .footer .container {
            padding: 0 10px; /* 小屏幕减少内边距 */
        }

        .footer .links {
            margin-top: 15px;
        }

            .footer .links a {
                font-size: 14px;
                margin: 0 10px;
            }
    }

    @media (max-width: 480px) {
        .footer .links {
            margin-top: 10px;
        }

            .footer .links a {
                font-size: 12px;
                margin: 0 8px;
            }
    }
</style>

<script>
    export default {
        name: 'AppFooter' // 修改组件名
    }
</script>
