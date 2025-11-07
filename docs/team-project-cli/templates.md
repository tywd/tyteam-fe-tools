# @tyteam/team-project-cli 模板系统

## 概述

@tyteam/team-project-cli 使用基于文件的模板系统，通过 EJS 模板引擎渲染项目文件。模板系统支持变量替换和条件逻辑，可以根据用户输入动态生成项目文件。

## 模板目录结构

```
templates/
└── vue3-template/
    ├── public/
    │   └── favicon.ico
    ├── src/
    │   ├── components/
    │   ├── router/
    │   ├── views/
    │   ├── App.vue
    │   └── main.js
    ├── index.html
    ├── package.json.ejs
    ├── vite.config.js
    ├── .eslintrc.cjs
    ├── .stylelintrc.cjs
    └── .prettierrc
```

## EJS 模板语法

### 变量替换

在模板文件中使用 `<%= variableName %>` 语法插入变量：

```html
<title><%= projectName %></title>
```

### 条件逻辑

使用 `<% if (condition) { %>` 和 `<% } %>` 实现条件逻辑：

```html
<% if (useRouter) { %>
import router from './router'
<% } %>
```

### 循环

使用 `<% for (item of items) { %>` 和 `<% } %>` 实现循环：

```html
<% for (route of routes) { %>
  <router-link to="<%= route.path %>"><%= route.name %></router-link>
<% } %>
```

## 可用变量

### 基础变量

| 变量名 | 类型 | 描述 |
|--------|------|------|
| projectName | string | 项目名称 |

### 扩展变量

未来版本将支持更多变量：

| 变量名 | 类型 | 描述 |
|--------|------|------|
| projectType | string | 项目类型 (vue3, react, etc.) |
| useRouter | boolean | 是否使用路由 |
| useStore | boolean | 是否使用状态管理 |

## Vue 3 模板详解

### package.json.ejs

```json
{
  "name": "<%= projectName %>",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix",
    "format": "prettier --write ."
  },
  "dependencies": {
    "vue": "^3.5.13",
    "vue-router": "^4.5.0"
  },
  "devDependencies": {
    "@tyteam/eslint-config-vue3": "^1.0.0",
    "@tyteam/stylelint-config": "^1.0.0",
    "@tyteam/prettier-config": "^1.0.0",
    "@vitejs/plugin-vue": "^5.2.1",
    "@vue/eslint-config-prettier": "^10.1.0",
    "eslint": "^9.17.0",
    "eslint-plugin-vue": "^9.32.0",
    "prettier": "^3.4.2",
    "stylelint": "^16.12.0",
    "vite": "^6.0.3"
  }
}
```

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= projectName %></title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### src/App.vue

```vue
<template>
  <div id="app">
    <header>
      <h1><%= projectName %></h1>
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/about">关于</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
// 在这里可以添加应用级别的逻辑
</script>

<style>
/* 样式代码 */
</style>
```

### src/main.js

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
```

### src/router/index.js

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

## 创建新模板

### 模板命名规范

模板目录应命名为 `{framework}-template`，例如：
- `vue3-template`
- `react-template`
- `angular-template`

### 模板文件结构

模板应包含一个完整的可运行项目结构，包括：
1. 项目配置文件（package.json, vite.config.js 等）
2. 源代码目录（src/）
3. 公共资源目录（public/）
4. 代码规范配置文件（.eslintrc.cjs, .stylelintrc.cjs, .prettierrc）

### 变量使用

在模板文件中使用 EJS 语法插入变量，确保所有变量都在主程序中提供。

### 测试模板

创建模板后，应进行以下测试：
1. 模板复制功能是否正常
2. 变量是否正确替换
3. 生成的项目是否可正常运行
4. 依赖是否正确安装

## 模板最佳实践

### 文件组织

1. 按功能模块组织文件
2. 使用清晰的目录结构
3. 保持文件命名一致性

### 代码质量

1. 遵循框架最佳实践
2. 使用语义化的 HTML 标签
3. 编写可维护的 CSS 样式
4. 添加适当的注释

### 性能优化

1. 最小化初始包大小
2. 使用懒加载技术
3. 优化图片和资源
4. 启用代码压缩

## 扩展模板功能

### 条件模板

未来版本将支持根据用户选择条件性地包含文件：

```
templates/
└── vue3-template/
    ├── base/
    ├── with-router/
    ├── with-store/
    └── with-i18n/
```

### 动态配置

支持根据用户输入动态生成配置文件：

```javascript
// 根据用户选择的特性动态生成 vite.config.js
export default defineConfig({
  plugins: [
    vue(),
    <% if (useJsx) { %>
    vueJsx(),
    <% } %>
  ],
  // 其他配置
})
```

## 故障排除

### 模板渲染失败

1. 检查 EJS 语法是否正确
2. 确保变量名称拼写正确
3. 验证模板文件编码

### 文件复制错误

1. 检查文件权限
2. 确保目标目录可写
3. 验证源文件是否存在

### 依赖安装失败

1. 检查 package.json 语法
2. 验证依赖版本号
3. 确保 npm registry 可访问