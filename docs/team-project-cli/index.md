# @tyteam/team-project-cli 技术文档

## 概述

@tyteam/team-project-cli 是一个用于快速创建标准化前端项目的命令行工具。它提供了一套预定义的项目模板，帮助开发团队快速启动新项目，确保所有项目都遵循相同的结构和规范。

## 功能特性

- 支持多种前端框架模板（目前支持 Vue 3，未来将支持 React 等）
- 集成 ESLint、Stylelint、Prettier 等代码规范工具
- 预设路由和页面结构
- 开箱即用的开发环境
- 自动依赖安装
- 版本检查功能

## 项目结构

### CLI 工具结构

```
packages/team-project-cli/
├── bin/
│   ├── commands/
│   │   └── check-update.js
│   └── index.js
├── templates/
│   └── vue3-template/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── router/
│       │   ├── views/
│       │   ├── App.vue
│       │   └── main.js
│       ├── index.html
│       ├── package.json.ejs
│       ├── vite.config.js
│       ├── .eslintrc.cjs
│       ├── .stylelintrc.cjs
│       └── .prettierrc
├── package.json
└── README.md
```

### 生成的 Vue 3 项目结构

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

## 安装

### 全局安装

```bash
npm install -g @tyteam/team-project-cli
```

或者使用 pnpm：

```bash
pnpm install -g @tyteam/team-project-cli
```

## 使用方法

### 初始化项目

```bash
team-project-cli init
```

运行该命令后，您将被提示输入项目名称并选择框架：

1. 输入项目名称（默认为当前目录名称）
2. 选择项目框架（目前支持 Vue 3）

CLI 工具将自动：
1. 根据选择的框架复制相应模板
2. 渲染模板中的变量
3. 安装项目依赖

### 检查更新

```bash
team-project-cli check-update
```

该命令会检查 CLI 工具的最新版本，并提示是否需要更新。

## 开发命令

生成的 Vue 3 项目包含以下开发命令：

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm lint` - 运行 ESLint 检查
- `pnpm format` - 运行 Prettier 格式化

## 本地测试

### 测试 CLI 工具

1. 克隆项目仓库
2. 进入项目根目录
3. 安装依赖：
   ```bash
   pnpm install
   ```
4. 进入测试目录并运行 CLI 工具：
   ```bash
   mkdir test-project
   cd test-project
   node ../packages/team-project-cli/bin/index.js init
   ```

### 测试生成的项目

1. 进入生成的项目目录
2. 启动开发服务器：
   ```bash
   pnpm dev
   ```
3. 在浏览器中访问 `http://localhost:3000` 查看应用

## 发布到 npm

### 准备工作

1. 确保您有 npm 账户并已登录：
   ```bash
   npm login
   ```

2. 确保版本号在 `package.json` 中已更新

### 发布流程

1. 进入 CLI 工具目录：
   ```bash
   cd packages/team-project-cli
   ```

2. 运行 npm publish 命令：
   ```bash
   npm publish
   ```

### 版本管理

遵循语义化版本控制规范：
- 主版本号(MAJOR)：不兼容的 API 修改
- 次版本号(MINOR)：向下兼容的功能性新增
- 修订号(PATCH)：向下兼容的问题修正

## 技术实现

### 核心依赖

- `commander`：命令行接口构建
- `inquirer`：交互式命令行界面
- `ejs`：模板引擎
- `npm-registry-client`：npm 包信息查询

### 核心功能模块

#### 1. 项目初始化 (init 命令)

主要实现逻辑：
1. 使用 inquirer 创建交互式命令行界面
2. 根据用户选择确定模板路径
3. 递归复制模板目录并渲染 EJS 模板
4. 自动安装项目依赖

#### 2. 版本检查 (check-update 命令)

主要实现逻辑：
1. 读取本地 CLI 工具版本
2. 查询 npm registry 获取最新版本
3. 比较版本号并提示更新

### 模板系统

使用 EJS 模板引擎渲染文件，支持在以下文件类型中使用模板语法：
- `.html`
- `.js`
- `.ts`
- `.vue`
- `.css`
- `.scss`
- `.json`
- `.md`
- `.cjs`

## 扩展支持

### 添加新框架模板

1. 在 `templates/` 目录下创建新的模板文件夹，命名格式为 `{framework}-template`
2. 按照项目结构要求创建模板文件
3. 在 `bin/index.js` 中的框架选择列表中添加新选项

### 添加新命令

1. 在 `bin/commands/` 目录下创建新的命令文件
2. 实现命令逻辑
3. 在 `bin/index.js` 中导入并注册命令

## 故障排除

### 常见问题

1. **依赖安装失败**
   - 确保已安装 pnpm
   - 检查网络连接
   - 手动运行 `pnpm install`

2. **模板渲染错误**
   - 检查模板文件中的 EJS 语法
   - 确保变量名称正确

3. **版本检查失败**
   - 检查网络连接
   - 确保包已发布到 npm

### 支持

如有问题，请提交 issue 到项目仓库。

## 许可证

MIT