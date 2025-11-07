# @tyteam/team-project-cli 使用指南

## 第一步：安装 CLI 工具

### 全局安装

```bash
npm install -g @tyteam/team-project-cli
```

或者使用 pnpm：

```bash
pnpm install -g @tyteam/team-project-cli
```

### 验证安装

```bash
team-project-cli --version
```

应该显示 CLI 工具的版本号。

## 第二步：初始化新项目

### 运行初始化命令

```bash
team-project-cli init
```

### 回答提示问题

1. 输入项目名称（默认为当前目录名称）
2. 选择项目框架（目前支持 Vue 3）

### 等待项目创建完成

CLI 工具将自动：
1. 复制相应模板
2. 渲染模板中的变量
3. 安装项目依赖

完成后，您将看到类似以下的输出：

```
✅ 项目初始化成功！

下一步：
  cd your-project-name
  pnpm dev
```

## 第三步：启动开发服务器

### 进入项目目录

```bash
cd your-project-name
```

### 启动开发服务器

```bash
pnpm dev
```

### 访问应用

在浏览器中访问 `http://localhost:3000` 查看应用。

## 第四步：开发项目

### 项目结构说明

生成的 Vue 3 项目包含以下主要目录和文件：

- `src/components/`：可复用组件
- `src/views/`：页面组件
- `src/router/`：路由配置
- `src/App.vue`：根组件
- `src/main.js`：入口文件

### 开发命令

- `pnpm dev`：启动开发服务器
- `pnpm build`：构建生产版本
- `pnpm lint`：运行 ESLint 检查
- `pnpm format`：运行 Prettier 格式化

## 第五步：构建和部署

### 构建生产版本

```bash
pnpm build
```

构建后的文件将位于 `dist/` 目录中。

### 部署

将 `dist/` 目录中的文件部署到您选择的服务器或静态网站托管服务。

## 高级功能

### 检查更新

```bash
team-project-cli check-update
```

该命令会检查 CLI 工具的最新版本，并提示是否需要更新。

### 自定义配置

生成的项目包含以下配置文件，可根据需要进行自定义：

- `.eslintrc.cjs`：ESLint 配置
- `.stylelintrc.cjs`：Stylelint 配置
- `.prettierrc`：Prettier 配置
- `vite.config.js`：Vite 配置

## 故障排除

### 依赖安装失败

如果在初始化过程中依赖安装失败，可以手动安装：

```bash
pnpm install
```

### 开发服务器启动失败

确保端口未被占用，或指定其他端口：

```bash
pnpm dev --port 3001
```

### 其他问题

查看控制台输出的错误信息，根据具体错误进行处理。