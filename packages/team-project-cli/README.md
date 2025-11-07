# @tyteam/team-project-cli

Tyteam 项目脚手架工具，用于快速创建标准的前端项目。

## 功能特性

- 支持 Vue 3 (Vite) 项目模板
- 集成 ESLint、Stylelint、Prettier 等代码规范工具
- 预设路由和页面结构
- 开箱即用的开发环境

## 安装

```bash
npm install -g @tyteam/team-project-cli
```

## 使用

```bash
team-project-cli init
```

然后按照提示选择项目名称和框架即可。

## 项目结构

创建的 Vue 3 项目将具有以下结构：

```
project-name/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── HelloWorld.vue
│   ├── router/
│   │   └── index.js
│   ├── views/
│   │   ├── HomeView.vue
│   │   └── AboutView.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
├── .eslintrc.cjs
├── .stylelintrc.cjs
└── .prettierrc
```

## 开发命令

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm lint` - 运行 ESLint 检查
- `pnpm format` - 运行 Prettier 格式化

## 检查更新

```bash
team-project-cli check-update
```

## License

MIT