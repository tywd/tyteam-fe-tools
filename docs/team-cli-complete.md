# @tyteam/ty-cli 完整技术文档

## 一、工具简介

`@tyteam/ty-cli` 是团队专属前端脚手架工具，旨在**一键初始化项目并自动集成团队规范配置**，解决项目初始化时"ESLint/Stylelint/Prettier/Commitlint 配置繁琐、代码规范不统一"的痛点，提升团队协作效率。

- **核心定位**：团队规范落地工具，简化项目配置流程。
- **依赖生态**：集成已发布的 `@tyteam/eslint-config-base`、`@tyteam/eslint-config-vue3`、`@tyteam/stylelint-config`、`@tyteam/commitlint-config` 和 `@tyteam/prettier-config`。
- **包名**：`@tyteam/ty-cli`。

## 二、核心功能

1. **交互式项目初始化**：通过命令行询问项目类型（Vue3/React/普通 JS），动态生成配置。
2. **自动生成完整项目结构**：
   - `src/` 目录包含示例文件用于测试配置
   - `eslint.config.js`：根据项目类型引入对应团队 ESLint 配置。
   - `stylelint.config.js`：引入团队 Stylelint 配置。
   - `prettier.config.js`：引入团队 Prettier 配置。
   - `commitlint.config.js`：引入团队 Commitlint 配置（可选）。
   - `package.json`：自动添加依赖、插件及 `lint`/`lint:fix` 脚本。
3. **规范自动校验**：集成团队定制规则。
4. **支持自动修复**：`lint:fix` 命令可自动修复格式类错误。
5. **版本检查**：`check-update` 命令可检查核心包版本并给出更新建议。
6. **存量项目接入**：`lint init` 命令可为旧项目一键接入团队规范。

## 三、技术栈与依赖

| 工具/库       | 版本       | 核心作用                                  |
|---------------|------------|-------------------------------------------|
| `commander`   | ^14.0.2    | 命令行参数解析与命令注册                  |
| `inquirer`    | ^12.10.0   | 交互式询问                                |
| `ejs`         | ^3.1.10    | 模板引擎，动态渲染配置文件                |
| `npm-registry-client` | ^8.6.0 | 用于查询 npm 包信息                |
| `husky`       | ^9.0.11    | Git Hooks 管理工具                        |
| `pnpm`        | v10.12.4+  | 包管理工具（支持 monorepo 与本地链接测试） |

## 四、项目结构与实现

### 1. 最终项目结构
```
@tyteam/ty-cli/
├── bin/
│   ├── commands/
│   │   ├── check-update.js   # 版本检查命令
│   │   ├── lint-init.js      # 存量项目接入命令
│   │   └── lint.js           # 代码修复命令
│   └── index.js              # 命令入口文件（注册所有命令）
├── templates/                # EJS 模板目录
│   ├── src/                  # 示例源代码目录
│   │   ├── index.js          # JavaScript 示例文件
│   │   ├── App.vue           # Vue 示例文件
│   │   ├── App.jsx           # React 示例文件
│   │   └── styles.css        # CSS 示例文件
│   ├── eslint.config.ejs     # ESLint 配置模板
│   ├── stylelint.config.ejs  # Stylelint 配置模板
│   ├── prettier.config.ejs   # Prettier 配置模板
│   ├── commitlint.config.ejs # Commitlint 配置模板
│   ├── package.json.ejs      # 依赖与脚本模板
│   └── README.md.ejs         # 项目说明文档模板
├── package.json              # 包配置（含白名单、bin 入口）
└── README.md                 # 使用说明文档
```

### 2. 核心配置文件（`package.json`）
关键配置含 **发布白名单**（`files` 字段）、命令入口（`bin`），确保发布包纯净：
```json
{
  "name": "@tyteam/ty-cli",
  "version": "1.4.0",
  "type": "module",
  "bin": {
    "team-cli": "./bin/index.js"
  },
  "dependencies": {
    "commander": "^14.0.2",
    "inquirer": "^12.10.0",
    "ejs": "^3.1.10",
    "npm-registry-client": "^8.6.0",
    "husky": "^9.0.11"
  },
  "files": [
    "bin",
    "templates",
    "package.json",
    "README.md"
  ],
  "description": "Tyteam 前端脚手架工具，一键集成团队规范",
  "keywords": ["tyteam", "cli", "eslint", "stylelint", "commitlint", "scaffold"],
  "author": "Tyteam",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 3. 核心代码实现

#### （1）入口文件（`bin/index.js`）
```javascript
#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import lintCommand from './commands/lint.js';
import checkUpdateCommand from './commands/check-update.js';
import lintInitCommand from './commands/lint-init.js';

// 解决 ES 模块 __dirname 缺失问题
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 注册 init 命令
program
  .command('init')
  .description('初始化项目并生成团队规范配置')
  .action(async () => {
    // 实现项目初始化逻辑
  });

// 注册其他子命令
program.addCommand(lintCommand);
program.addCommand(checkUpdateCommand);
program.addCommand(lintInitCommand.parent ?? lintInitCommand);

// 解析命令行参数
program.parse(process.argv);
```

#### （2）模板文件

- `templates/eslint.config.ejs`：
  ```javascript
  // 自动生成的 ESLint 配置（基于 @tyteam 团队规范）
  import tyteamConfig from '<%= eslintConfig %>';

  export default [
    ...tyteamConfig,
    // 项目自定义规则（可在此处覆盖团队配置）
    {
      files: ['**/*.js', '**/*.vue', '**/*.jsx'],
      rules: {
        // 示例：调整规则级别
        // "no-console": "warn"
      }
    }
  ];
  ```

- `templates/stylelint.config.ejs`：
  ```javascript
  // 自动生成的 Stylelint 配置（基于 @tyteam 团队规范）
  import tyteamConfig from '@tyteam/stylelint-config';

  export default [
    ...tyteamConfig,
    // 项目自定义规则（可在此处覆盖团队配置）
    {
      rules: {
        // 示例：调整规则
        // "selector-class-pattern": "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$"
      }
    }
  ];
  ```

- `templates/prettier.config.ejs`：
  ```javascript
  // 自动生成的 Prettier 配置（基于 @tyteam 团队规范）
  import tyteamConfig from '@tyteam/prettier-config';

  export default {
    ...tyteamConfig,
    // 项目自定义规则（可在此处覆盖团队配置）
    // 示例：
    // printWidth: 120
  };
  ```

- `templates/commitlint.config.ejs`：
  ```javascript
  // 自动生成的 Commitlint 配置（基于 @tyteam 团队规范）
  import tyteamConfig from '@tyteam/commitlint-config';

  export default [
    ...tyteamConfig,
    // 项目自定义规则（可在此处覆盖团队配置）
    {
      rules: {
        // 示例：调整规则
        // "subject-case": [2, "always", ["lower-case", "sentence-case"]]
      }
    }
  ];
  ```

- `templates/package.json.ejs`：
  ```json
  {
    "name": "<%= projectName %>",
    "version": "1.0.0",
    "description": "A project using @tyteam configuration standards",
    "scripts": {
      "lint": "eslint . && stylelint ./**/*.{css,scss,vue}",
      "lint:fix": "team-cli lint fix"
    },
    "devDependencies": {
      "<%= eslintConfig %>": "^1.0.0",
      "@tyteam/stylelint-config": "^1.0.0",
      "@tyteam/commitlint-config": "^1.0.0",
      "@tyteam/prettier-config": "^1.0.0",
      "eslint": "^9.39.1",
      "stylelint": "^16.9.0",
      "prettier": "^3.3.3",
      "eslint-plugin-vue": "^10.5.1",
      "eslint-plugin-import": "^2.29.0",
      "eslint-plugin-n": "^17.0.0",
      "eslint-plugin-promise": "^6.0.0",
      "vue-eslint-parser": "^10.2.0"
    }
  }
  ```

## 五、配置验证指南

### 1. ESLint 配置验证

#### Vue 项目验证
在 `src/App.vue` 文件中故意添加一些不符合规范的代码：
```vue
<template>
  <div class="app">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
// 故意违反 ESLint 规则的代码
export default {
  name: 'App',
  data() {
    return {
      title: 'Vue App',
      message: 'Welcome to your Vue.js application'
    }
  },
  methods: {
    // 使用 var 而不是 const/let（违反规则）
    badFunction: function() {
      var x = 1;
      return x;
    }
  }
}
</script>
```

运行 `pnpm lint` 应该能检测到问题。

#### React 项目验证
在 `src/App.jsx` 文件中故意添加一些不符合规范的代码：
```jsx
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  // 使用 var 而不是 const/let（违反规则）
  var handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div className="app">
      <h1>Welcome to React</h1>
      <p>Count: {count}</p>
      <button onClick={handleClick}>
        Increment
      </button>
    </div>
  );
}

export default App;
```

运行 `pnpm lint` 应该能检测到问题。

#### 普通 JavaScript 项目验证
在 `src/main.js` 文件中故意添加一些不符合规范的代码：
```javascript
// 使用 var 而不是 const/let（违反规则）
var greeting = 'Hello';
var name = 'John';

function sayHello(name) {
  // 未使用的变量（违反规则）
  var unusedVar = 'unused';
  return `Hello, ${name}!`;
}

sayHello('World');
```

运行 `pnpm lint` 应该能检测到问题。

### 2. Stylelint 配置验证

在 `src/styles.css` 文件中故意添加一些不符合规范的代码：
```css
.app {
  text-align: center;
  margin-top: 60px;
}

h1 {
  color: #42b983;
}

/* 违反 Stylelint 规则的代码 */
.header {
  font-size: 24px;
  font-weight: bold;
  color: blue; /* 使用命名颜色而不是十六进制 */
  background-color: #f0f0f0;
  padding: 10px;
  margin: 5px;
}
```

运行 `pnpm lint` 应该能检测到问题。

### 3. Prettier 配置验证

在任何 JavaScript 文件中故意使用不一致的格式：
```javascript
const obj = {a: 1,b: 2,c: 3}; // 缺少空格和逗号后空格

function test( ) { // 函数参数前后有空格
  return obj;
}
```

运行 `pnpm lint:fix` 应该能自动修复格式问题。

### 4. Commitlint 配置验证

在集成 commitlint 后，尝试提交不符合规范的信息：
```bash
# 这应该失败
git commit -m "add feature"

# 这应该成功
git commit -m "feat: add new feature"
```

## 六、命令详解

### 1. `team-cli init`
交互式项目初始化命令，生成完整的项目结构和配置文件。

### 2. `team-cli lint fix [dir]`
一键修复 ESLint 和 Stylelint 问题，默认修复当前目录，可指定目录。

### 3. `team-cli lint init`
存量项目一键接入团队规范，生成配置文件并更新 package.json。

### 4. `team-cli check-update`
检查 CLI 及关联规范包的最新版本，并给出更新建议。

## 七、npm 发布完整流程

### 1. 发布前准备
#### （1）环境检查
- 安装 Node.js（≥18.0.0）和 pnpm（≥10.0.0）。
- 注册 npm 账号并加入 `@tyteam` 组织（需组织管理员邀请）。

#### （2）包配置校验
确保 `package.json` 满足以下要求：
- `name` 为 `@tyteam/ty-cli`。
- `files` 字段包含白名单（`bin`、`templates`、`package.json`、`README.md`）。
- `version` 为正确的版本号。

#### （3）本地测试
```bash
# 1. 进入 ty-cli 目录
cd packages/team-cli

# 2. 本地链接包（模拟全局安装）
pnpm link --global

# 3. 新建测试项目并初始化
mkdir test-team-cli && cd test-team-cli
team-cli init  # 选择 Vue3，验证是否生成配置文件

# 4. 安装依赖并测试 lint
pnpm install
pnpm lint

# 5. 解除本地链接（测试完成后）
pnpm unlink @tyteam/ty-cli --global
```

### 2. 登录 npm 仓库
```bash
# 1. 切换到 npm 官方源
npm config set registry https://registry.npmjs.org/

# 2. 登录 npm 账号
npm login
```

### 3. 执行发布
```bash
# 在 team-cli 目录执行发布命令
npm publish --access public
```

### 4. 发布后验证
```bash
# 1. 全局安装线上包
pnpm add @tyteam/ty-cli -g

# 2. 新建项目并初始化
mkdir my-project && cd my-project
team-cli init

# 3. 安装依赖并测试
pnpm install
pnpm lint:fix
```

### 5. 版本更新流程
若需修改功能，按以下步骤更新：
1. 修改代码并本地测试通过。
2. 更新 `package.json` 版本号：
   ```bash
   npm version patch  # 修复 bug
   # npm version minor  # 新增功能
   # npm version major  # 不兼容变更
   ```
3. 重新执行 `npm publish --access public` 发布新版本。

## 八、使用指南

### 1. 安装
```bash
# 全局安装（推荐）
pnpm add @tyteam/ty-cli -g

# 局部安装（项目内使用）
pnpm add @tyteam/ty-cli -D
```

### 2. 初始化项目
```bash
# 1. 新建项目目录并进入
mkdir my-project && cd my-project

# 2. 执行初始化命令
team-cli init

# 3. 按提示选择项目类型和是否集成提交规范

# 4. 自动生成完整项目结构
```

### 3. 依赖安装与使用
```bash
# 安装自动生成的依赖
pnpm install

# 执行 lint 校验
pnpm lint

# 自动修复可修复错误
pnpm lint:fix

# 检查版本更新
team-cli check-update
```

### 4. 存量项目接入
```bash
# 在现有项目根目录执行
team-cli lint init

# 按提示选择项目类型
# 自动生成配置文件并更新 package.json
```

## 九、常见问题与解决方案

| 问题描述 | 原因分析 | 解决方案 |
|---------|---------|---------|
| `n/no-unpublished-import` 错误 | `eslint-plugin-n` 缓存未更新 | 1. 清除缓存：`pnpm store prune`；2. 切换 npm 官方源 |
| 模块类型警告 | 未声明模块类型 | 在项目 `package.json` 中添加 `"type": "module"` |
| 缺少插件 | 插件为 `peerDependencies` | 工具已自动添加到 `package.json`，执行 `pnpm install` 即可 |
| 组件名错误 | Vue 规则要求组件名必须多单词 | 重命名组件，遵循官方规范 |
| 发布失败："permission denied" | 未加入组织或无发布权限 | 联系组织管理员添加账号并授予发布权限 |

## 十、总结

`@tyteam/ty-cli` 已实现核心目标：**一键集成团队规范**，避免重复配置工作。工具通过 `commander` 处理命令、`inquirer` 实现交互、`ejs` 渲染模板，流程简洁高效。

发布流程关键要点：
1. 配置 `files` 白名单，确保发布包纯净。
2. 发布前必须本地测试，避免线上功能异常。
3. 切换 npm 官方源，减少同步延迟导致的校验错误。

后续可扩展方向：
- 新增 React 配置模板。
- 加入更多 Git Hooks。
- 支持 TypeScript 项目初始化。