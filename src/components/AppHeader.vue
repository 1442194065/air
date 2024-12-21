<!-- src/components/Header.vue -->
<template>
    <header>
        <div class="header-content">
            <h1>
                <i class="fas fa-cloud-sun mr-2"></i>城市空气质量可视分析系统
            </h1>
            <p class="sub-heading">
                通过数据分析了解空气质量变化，保护我们的环境！
            </p>
        </div>
    </header>
</template>

<script setup>
    // 本组件没有需要引入的额外逻辑
</script>

<style scoped>
    /* Header 背景渐变与基础样式 */
    header {
        background: linear-gradient(135deg, #6e7dff, #4CAF50); /* 渐变背景 */
        color: white;
        padding: 30px 0; /* 增加上下内边距 */
        text-align: center;
        border-radius: 10px; /* 圆角效果 */
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* 投影效果 */
        transition: all 0.3s ease; /* 平滑过渡 */
    }

    /* 控制内容区域最大宽度和居中 */
    .header-content {
        max-width: 1200px;
        margin: 0 auto;
    }

    /* 标题样式，添加字体图标 */
    h1 {
        font-size: 3rem; /* 字体大，显眼 */
        font-weight: 700;
        letter-spacing: 1.5px;
        text-transform: uppercase; /* 使用大写字母 */
        margin: 0;
        transition: transform 0.3s ease; /* 添加变换效果 */
    }

        h1 i {
            font-size: 1.8rem;
            color: #fff;
        }

    /* 副标题 */
    .sub-heading {
        font-size: 1.2rem;
        margin-top: 10px;
        font-weight: 500;
        opacity: 0.9;
        font-style: italic;
    }

    /* 鼠标悬停时的效果 */
    header:hover {
        transform: translateY(-5px); /* 增加悬浮效果 */
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); /* 深化阴影 */
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
        h1 {
            font-size: 2rem; /* 减小字体 */
        }

        .sub-heading {
            font-size: 1rem; /* 副标题字体减小 */
        }

        header {
            padding: 20px 0; /* 调整 padding */
        }
    }

    @media (max-width: 480px) {
        h1 {
            font-size: 1.5rem; /* 进一步减小字体 */
        }

        .sub-heading {
            font-size: 0.9rem; /* 副标题字体进一步减小 */
        }
    }
</style>
