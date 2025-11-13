# Vue3 Qiankun Templatet
一个 基于https://github.com/tywd/qiankun-webpack-main 主应用上的子应用，也可独立运行，自用的练习项目组件

在主应用 qiankun-webpack-main 上运行该子应用时，可参考下载 qiankun-webpack-main 调整配置本地跑起来

在 qiankun-webpack-main 的 src/utils/index.ts 中找到 `getSubApp` 和 `getSubRoute` 方法，将子应用信息相关信息写入

## 运行项目
1. 安装依赖
qiankun-webpack-main 和 当前子应用根目录执行以下命令
```bash
pnpm install
```

2. 运行项目
qiankun-webpack-main 和 当前子应用根目录执行以下命令，注意下端口冲突，如果主应用配置的子应用路由信息等的端口port要和子应用的一致
```bash
pnpm dev
```
