# @tyteam/eslint-config-base

Tyteam 团队通用的 ESLint 基础配置，基于 ESLint v9 扁平配置格式构建，集成 standard 核心代码规范，并补充团队定制化规则，确保项目代码风格统一、可读性强。

## 特性



* **版本兼容**：适配 ESLint v9+ 最新扁平配置体系，告别旧版 `.eslintrc` 格式

* **规范集成**：手动复现 `standard` 核心规范（依赖 `import`/`n`/`promise` 插件推荐规则）

* **定制化规则**：禁止 `var` 声明、限制函数复杂度、强制单引号 / 分号等团队专属约束

* **实用支持**：兼容 ES6+ 语法，包含 `import` 语句字母序排序、Node.js 规范校验等功能

## 安装

### 前提条件



* Node.js 版本 ≥ 18.0.0（ESLint v9 最低要求）

* 项目已初始化 `package.json`（执行 `pnpm init` 或 `npm init` 完成）

### 安装命令



```
# 使用 pnpm（推荐，团队统一包管理工具）

pnpm add @tyteam/eslint-config-base eslint -D

# 或使用 npm

npm install @tyteam/eslint-config-base eslint --save-dev
```

## 使用方法

### 1. 创建 ESLint 配置文件

在项目根目录新建 `eslint.config.js`（ESLint v9 默认配置文件名），内容如下：



```
// eslint.config.js

// 导入团队基础配置

import tyteamBase from '@tyteam/eslint-config-base';

// 导出配置数组（支持扩展自定义规则）

export default [

 // 加载团队基础规则

 ...tyteamBase,



 // （可选）项目专属规则（覆盖基础配置）

 // 示例：生产环境禁止 console、调整缩进为 4 空格

 // {

 //   rules: {

 //     "no-console": "error",

 //     "indent": \["error", 4]

 //   }

 // }

];
```

### 2. 添加脚本命令（可选）

在项目 `package.json` 中添加 `lint` 脚本，方便快速执行校验：


```
{

 "scripts": {

   "lint": "eslint .",          // 校验项目所有文件

   "lint:fix": "eslint . --fix" // 自动修复可修复的校验问题

 }

}
```

### 3. 执行校验


```
# 执行校验（使用脚本）

pnpm lint

# 或直接执行（不依赖脚本）

npx eslint src/ test/ # 指定校验 src/ 和 test/ 目录

# 自动修复问题

pnpm lint:fix
```

## 配置详情

### 1. 基础规则来源

集成以下插件的推荐规则，与 `standard` 规范保持一致：


| 插件名称                    | 作用                                |
| ----------------------- | --------------------------------- |
| `eslint-plugin-import`  | 校验模块导入 / 导出语法（如路径错误、未使用导入）        |
| `eslint-plugin-n`       | 校验 Node.js 相关规范（如内置模块使用、文件扩展名）    |
| `eslint-plugin-promise` | 校验 Promise 语法（如未处理 reject、不当链式调用） |

### 2. 团队定制规则


| 规则名称           | 配置内容                                              | 规则说明                                        |
| -------------- | ------------------------------------------------- | ------------------------------------------- |
| `no-var`       | `"error"`                                         | 禁止使用 `var` 声明变量，强制使用 `let`（可变）/`const`（不可变） |
| `complexity`   | `["warn", 15]`                                    | 函数复杂度超过 15 时触发警告（复杂度 = 分支 / 循环 / 条件判断总数）    |
| `no-console`   | `"off"`                                           | 允许使用 `console`（开发环境调试常用，生产环境可自行关闭）          |
| `indent`       | `["error", 2]`                                    | 强制 2 个空格缩进，统一代码对齐风格                         |
| `semi`         | `["error", "always"]`                             | 语句末尾必须添加分号，避免 ASI（自动分号插入）导致的意外问题            |
| `quotes`       | `["error", "single"]`                             | 字符串强制使用单引号，减少双 / 单引号混用                      |
| `import/order` | `["warn", { "alphabetize": { "order": "asc" } }]` | `import` 语句按模块名称字母升序排序，提升可读性                |

## 测试配置有效性

### 1. 创建测试文件

在项目中新建 `test/test-lint.js`，写入包含违反规则的代码：


```
// test/test-lint.js

// 1. 违反 no-var 规则（使用 var 声明）

var testVar = "hello";

// 2. 违反 quotes 规则（使用双引号）

const str = "should use single quote";

// 3. 违反 semi 规则（缺少分号）

const num = 123

// 4. 违反 import/order 规则（未按字母序排序）

import b from './b';

import a from './a';
```

### 2. 执行校验

```
npx eslint test/test-lint.js
```

### 3. 预期输出


```
test/test-lint.js

 2:1   error  Unexpected var, use let or const instead  no-var

 5:13  error  Strings must use singlequote              quotes

 8:16  error  Missing semicolon                         semi

 11:1   warn  Import declaration should appear before import declaration for "./a"  import/order

✖ 4 problems (3 errors, 1 warning)

 3 errors and 1 warning potentially fixable with the \`--fix\` option.
```

### 4. 自动修复

执行 `npx eslint test/test-lint.js --fix` 后，上述 3 个错误会被自动修复（`var`→`let`、双引号→单引号、补充分号），仅 `import/order` 警告需手动调整顺序。

## 常见问题

### Q1：规则不生效，提示 “找不到配置文件”？

A：检查以下几点：



1. 配置文件是否命名为 `eslint.config.js`（ESLint v9 仅识别此文件名）

2. 项目根目录是否存在该配置文件，且正确导入 `@tyteam/eslint-config-base`

3. 执行 `pnpm list eslint` 确认 ESLint 版本 ≥ 9.0.0

### Q2：如何在 Vue/React 项目中扩展此配置？

A：安装对应框架的 ESLint 插件，在 `eslint.config.js` 中追加配置：



```
// Vue 项目示例（需先安装 eslint-plugin-vue）

import tyteamBase from '@tyteam/eslint-config-base';

import vuePlugin from 'eslint-plugin-vue';

export default [

 ...tyteamBase,

 {

   plugins: { vue: vuePlugin },

   rules: {

     ...vuePlugin.configs.recommended.rules, // 集成 Vue 推荐规则

     "vue/html-indent": ["error", 2] // 自定义 Vue 模板缩进

   }

 }

];
```

### Q3：依赖安装后提示 “插件未找到”？

A：执行以下命令检查依赖是否完整：



```
# 检查核心插件是否安装

pnpm list eslint-plugin-import eslint-plugin-n eslint-plugin-promise
```

若存在缺失，执行 `pnpm add 缺失的插件名 -D` 补充安装。

## 版本兼容



| 依赖                      | 最低版本要求   |
| ----------------------- | -------- |
| ESLint                  | ≥ 9.0.0  |
| Node.js                 | ≥ 18.0.0 |
| `eslint-plugin-import`  | ≥ 2.29.0 |
| `eslint-plugin-n`       | ≥ 17.0.0 |
| `eslint-plugin-promise` | ≥ 6.0.0  |

## 维护与更新



* 规则调整：修改包内 `eslint.config.js` 后，需重新发布到 npm 仓库

* 版本升级：遵循 SemVer 语义化版本（如规则新增→次版本号 + 1，规则兼容调整→修订号 + 1）

* 反馈问题：团队成员可通过项目仓库 Issues 提交规则优化建议
