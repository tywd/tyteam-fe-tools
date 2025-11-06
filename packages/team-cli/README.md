# @tyteam/ty-cli

团队脚手架工具，用于快速初始化项目并集成 @tyteam 规范（ESLint / Stylelint / Commitlint），并提供一键修复与版本检查能力。

## 功能
- 初始化项目配置：生成 `eslint.config.js`（支持 Vue3/预留 React）并合并 `package.json` 依赖
- 选配提交规范集成：`husky + @tyteam/commitlint-config` 一键接入并添加 `commit-msg` 钩子
- 一键修复命令：`team-cli lint fix [dir]` 同时修复 ESLint 与（若存在）Stylelint 问题
- 存量项目接入：`team-cli lint init` 为旧项目安装并生成 ESLint/Stylelint 配置与脚本
- 版本检查：`team-cli check-update` 对比本地与 NPM 最新版本并给出更新命令

## 安装
```bash
# 全局安装（推荐）
pnpm add @tyteam/ty-cli -g

# 或局部安装（通过 npx 执行）
pnpm add @tyteam/ty-cli -D
```

## 使用
```bash
# 交互式初始化（生成 eslint.config.js，按需选择集成提交规范）
team-cli init

# 一键修复（默认当前目录，可指定目录）
team-cli lint fix ./src

# 存量项目一键接入 ESLint/Stylelint（生成配置与脚本）
team-cli lint init

# 检查核心包版本并给出更新建议
team-cli check-update
```

## 结合规范包
- ESLint：`@tyteam/eslint-config-base` 或 `@tyteam/eslint-config-vue3`
- Stylelint：`@tyteam/stylelint-config`（flat ESM 配置）
- Commitlint：`@tyteam/commitlint-config`（集成时自动生成 `commitlint.config.js` 与 husky 钩子）

## 运行环境
- Node.js >= 18
- 包管理器：pnpm（推荐）

## 许可
MIT