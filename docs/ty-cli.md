# @tyteam/ty-cli 工具总结文档（含 npm 发布流程）

## 一、工具简介
`@tyteam/ty-cli` 是团队专属前端脚手架工具，旨在**一键初始化项目并自动集成团队规范配置**，核心解决 Vue3 项目（预留 React 扩展）初始化时“ESLint 配置繁琐、代码规范不统一”的痛点，提升团队协作效率。

- **核心定位**：团队规范落地工具，简化 ESLint 配置流程。
- **依赖生态**：集成已发布的 `@tyteam/eslint-config-base`（基础规则）和 `@tyteam/eslint-config-vue3`（Vue3 专属规则）。
- **包名**：`@tyteam/ty-cli`（已更新为指定名称）。


## 二、核心功能
1. **交互式项目初始化**：通过命令行询问项目类型（Vue3/React），动态生成配置。
2. **自动生成核心文件**：
   - `eslint.config.js`：根据项目类型引入对应团队 ESLint 配置（Vue3 对应 `@tyteam/eslint-config-vue3`）。
   - `package.json`：自动添加 ESLint 依赖、插件及 `lint`/`lint:fix` 脚本。
3. **规范自动校验**：集成团队定制规则（如组件名 PascalCase、Props 驼峰命名、禁止 `v-html`）。
4. **支持自动修复**：`lint:fix` 命令可自动修复格式类错误（如引号、缩进）。


## 三、技术栈与依赖
| 工具/库       | 版本       | 核心作用                                  |
|---------------|------------|-------------------------------------------|
| `commander`   | ^14.0.2    | 命令行参数解析与命令注册（如 `ty-cli init`） |
| `inquirer`    | ^12.10.0   | 交互式询问（如选择项目类型）              |
| `ejs`         | ^3.1.10    | 模板引擎，动态渲染配置文件                |
| `pnpm`        | v10.12.4+  | 包管理工具（支持 monorepo 与本地链接测试） |

> 注：依赖均为开发依赖（`devDependencies`），工具运行时无需额外安装依赖。


## 四、项目结构与实现
### 1. 最终项目结构
```
@tyteam/ty-cli/
├── bin/
│   └── index.js       # 命令入口文件（注册 init 命令）
├── templates/         # EJS 模板目录
│   ├── eslint.config.ejs  # ESLint 配置模板（适配 ESLint v9）
│   └── package.json.ejs   # 依赖与脚本模板
├── package.json       # 包配置（含白名单、bin 入口）
└── README.md          # 使用说明文档
```

### 2. 核心配置文件（`package.json`）
关键配置含 **发布白名单**（`files` 字段）、命令入口（`bin`），确保发布包纯净：
```json
{
  "name": "@tyteam/ty-cli",          // 指定包名
  "version": "1.0.0",                // 语义化版本（首次发布 1.0.0）
  "type": "module",                  // 支持 ES 模块（import/export）
  "bin": {
    "ty-cli": "./bin/index.js"       // 注册全局命令 ty-cli，指向入口文件
  },
  "devDependencies": {
    "commander": "^14.0.2",
    "inquirer": "^12.10.0",
    "ejs": "^3.1.10"
  },
  "files": [                         // 发布白名单（仅包含核心文件，排除冗余）
    "bin",                           // 命令入口目录
    "templates",                     // 模板目录
    "package.json",
    "README.md"
  ],
  "description": "Tyteam 前端脚手架工具，一键集成团队 ESLint 规范",
  "keywords": ["tyteam", "cli", "eslint", "vue3", "scaffold"],
  "author": "Tyteam",
  "license": "MIT",
  "registry": "https://registry.npmjs.org/"  // 发布源（公共 npm）
}
```

### 3. 核心代码实现
#### （1）入口文件（`bin/index.js`）
```javascript
#!/usr/bin/env node  // 声明脚本解释器为 Node.js（必须放在首行）

import { program } from 'commander';
import inquirer from 'inquirer';
import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 解决 ES 模块 __dirname 缺失问题
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 注册 init 命令
program
  .command('init')
  .description('初始化项目并生成团队 ESLint 配置（支持 Vue3/React）')
  .action(async () => {
    try {
      // 1. 交互式询问项目类型
      const { projectType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'projectType',
          message: '请选择项目类型：',
          choices: [
            { name: 'Vue3', value: 'vue3' },
            { name: 'React', value: 'react' } // 预留 React 支持
          ]
        }
      ]);

      // 2. 映射对应 ESLint 配置包
      const eslintConfigMap = {
        vue3: '@tyteam/eslint-config-vue3',
        react: '@tyteam/eslint-config-react' // 未来扩展 React 配置
      };
      const eslintConfig = eslintConfigMap[projectType];

      // 3. 读取模板目录路径
      const templateDir = path.join(__dirname, '../templates');

      // 4. 渲染 eslint.config.js（动态引入团队配置）
      const eslintTemplatePath = path.join(templateDir, 'eslint.config.ejs');
      const eslintOutputPath = path.join(process.cwd(), 'eslint.config.js');
      ejs.renderFile(eslintTemplatePath, { eslintConfig }, (err, content) => {
        if (err) throw err;
        fs.writeFile(eslintOutputPath, content);
      });

      // 5. 渲染 package.json（合并现有配置，添加依赖和脚本）
      const pkgTemplatePath = path.join(templateDir, 'package.json.ejs');
      const pkgOutputPath = path.join(process.cwd(), 'package.json');
      let existingPkg = {};
      // 若项目已有 package.json，合并配置；否则新建
      try {
        existingPkg = JSON.parse(await fs.readFile(pkgOutputPath, 'utf8'));
      } catch (e) {}

      ejs.renderFile(pkgTemplatePath, { eslintConfig }, (err, content) => {
        if (err) throw err;
        const templatePkg = JSON.parse(content);
        const mergedPkg = {
          ...templatePkg,
          ...existingPkg,
          devDependencies: {
            ...templatePkg.devDependencies,
            ...existingPkg.devDependencies
          }
        };
        fs.writeFile(pkgOutputPath, JSON.stringify(mergedPkg, null, 2));
      });

      console.log('✅ 配置生成成功！请执行 pnpm install 安装依赖');
    } catch (err) {
      console.error('❌ 初始化失败：', err.message);
    }
  });

// 解析命令行参数
program.parse(process.argv);
```

#### （2）模板文件
- `templates/eslint.config.ejs`（动态引入团队配置）：
  ```javascript
  // 自动生成的团队 ESLint 配置（ESLint v9 扁平格式）
  import tyteamConfig from '<%= eslintConfig %>';

  export default [
    ...tyteamConfig,
    // 项目自定义规则（可覆盖团队配置）
    {
      files: ['**/*.js', '**/*.vue', '**/*.jsx'],
      rules: {
        // 示例："no-console": "warn"
      }
    }
  ];
  ```

- `templates/package.json.ejs`（自动添加依赖和脚本）：
  ```json
  {
    "scripts": {
      "lint": "eslint .",          // 全量校验
      "lint:fix": "eslint . --fix" // 自动修复
    },
    "devDependencies": {
      "<%= eslintConfig %>": "^1.0.0", // 团队 ESLint 配置
      "eslint": "^9.39.1",             // ESLint 核心
      "eslint-plugin-vue": "^10.5.1",  // Vue 语法规则插件
      "eslint-plugin-import": "^2.29.0",// 导入语法插件
      "eslint-plugin-n": "^17.0.0",    // Node.js 规范插件
      "eslint-plugin-promise": "^6.0.0",// Promise 规范插件
      "vue-eslint-parser": "^10.2.0"   // Vue 解析器
    }
  }
  ```


## 五、npm 发布完整流程
### 1. 发布前准备
#### （1）环境检查
- 安装 Node.js（≥18.0.0）和 pnpm（≥10.0.0）。
- 注册 npm 账号并加入 `@tyteam` 组织（需组织管理员邀请）。

#### （2）包配置校验
确保 `package.json` 满足以下要求：
- `name` 为 `@tyteam/ty-cli`（指定包名）。
- `files` 字段包含白名单（`bin`、`templates`、`package.json`、`README.md`）。
- `version` 为首次发布版本（如 `1.0.0`）。

#### （3）本地测试（关键步骤）
避免发布后功能异常，需先本地验证：
```bash
# 1. 进入 ty-cli 目录
cd packages/ty-cli

# 2. 本地链接包（模拟全局安装）
pnpm link --global

# 3. 新建测试项目并初始化
mkdir test-ty-cli && cd test-ty-cli
ty-cli init  # 选择 Vue3，验证是否生成 eslint.config.js 和 package.json

# 4. 安装依赖并测试 lint
pnpm install
pnpm lint    # 应触发团队规则错误（如组件名单单词），无配置报错

# 5. 解除本地链接（测试完成后）
pnpm unlink @tyteam/ty-cli --global
```

#### （4）清理冗余文件
发布前确保无开发残留（`files` 白名单已过滤，但手动清理更稳妥）：
```bash
rm -rf node_modules pnpm-lock.yaml test/
```


### 2. 登录 npm 仓库
#### （1）公共 npm 仓库（开源使用）
```bash
# 1. 切换到 npm 官方源（避免镜像源同步延迟）
npm config set registry https://registry.npmjs.org/

# 2. 登录 npm 账号（需输入用户名、密码、邮箱验证码）
npm login

# 登录成功提示：Logged in as [用户名] on https://registry.npmjs.org/
```

#### （2）私有 npm 仓库（公司内部使用）
```bash
# 切换到公司私有源（地址由运维提供）
npm config set registry https://your-private-registry.com/

# 登录私有仓库账号
npm login --registry=https://your-private-registry.com/
```


### 3. 执行发布
```bash
# 在 ty-cli 目录执行发布命令（公共包需加 --access public）
npm publish --access public

# 发布成功提示：+ @tyteam/ty-cli@1.0.0
```


### 4. 发布后验证
#### （1）检查包信息
```bash
# 查看线上包详情（公共源）
npm view @tyteam/ty-cli

# 关键验证点：
# - version: 1.0.0（与发布版本一致）
# - files: 包含 bin、templates（白名单生效）
# - dist-tags: latest: 1.0.0（标签正确）
```

#### （2）实际项目测试
```bash
# 1. 全局安装线上包
pnpm add @tyteam/ty-cli -g

# 2. 新建项目并初始化
mkdir my-vue3-project && cd my-vue3-project
ty-cli init  # 选择 Vue3

# 3. 安装依赖并测试
pnpm install
pnpm lint:fix  # 验证自动修复功能正常
```


### 5. 版本更新流程（后续迭代）
若需修改功能（如新增 React 支持、调整规则），按以下步骤更新：
1. 修改代码并本地测试通过。
2. 更新 `package.json` 版本号（遵循语义化版本）：
   ```bash
   npm version patch  # 修复 bug（1.0.0 → 1.0.1）
   # npm version minor  # 新增功能（1.0.0 → 1.1.0）
   # npm version major  # 不兼容变更（1.0.0 → 2.0.0）
   ```
3. 重新执行 `npm publish --access public` 发布新版本。


## 六、工具使用指南
### 1. 安装
```bash
# 全局安装（推荐，可直接使用 ty-cli 命令）
pnpm add @tyteam/ty-cli -g

# 局部安装（项目内使用，需通过 npx 执行）
pnpm add @tyteam/ty-cli -D
```

### 2. 初始化项目
```bash
# 1. 新建项目目录并进入
mkdir my-project && cd my-project

# 2. 执行初始化命令
ty-cli init  # 全局安装
# 或 npx ty-cli init（局部安装）

# 3. 按提示选择项目类型（如 Vue3）
# 自动生成 eslint.config.js 和 package.json
```

### 3. 依赖安装与使用
```bash
# 安装自动生成的依赖（含 ESLint 及插件）
pnpm install

# 执行 lint 校验
pnpm lint

# 自动修复可修复错误（如引号、缩进）
pnpm lint:fix
```


## 七、常见问题与解决方案
| 问题描述                                  | 原因分析                                  | 解决方案                                                                 |
|-------------------------------------------|-------------------------------------------|--------------------------------------------------------------------------|
| `n/no-unpublished-import` 错误（包已发布） | `eslint-plugin-n` 缓存未更新，误判包未发布 | 1. 清除缓存：`pnpm store prune`；2. 切换 npm 官方源；3. 临时禁用规则：`"n/no-unpublished-import": "off"` |
| 模块类型警告（`Module type not specified`）| `eslint.config.js` 用 ES 模块，但未声明    | 在项目 `package.json` 中添加 `"type": "module"`                          |
| 缺少 `eslint-plugin-vue` 等插件            | 插件为 `peerDependencies`，需用户手动安装  | 工具已自动添加到 `package.json`，执行 `pnpm install` 即可                 |
| 组件名错误（`multi-word-component-names`） | Vue 规则要求组件名必须多单词              | 重命名组件（如 `test.vue` → `TestPage.vue`），遵循官方规范               |
| 发布失败：“permission denied”             | 未加入 `@tyteam` 组织或无发布权限         | 联系组织管理员添加账号并授予发布权限                                     |


## 八、总结
`@tyteam/ty-cli` 已实现核心目标：**一键集成团队 ESLint 规范**，避免重复配置工作。工具通过 `commander` 处理命令、`inquirer` 实现交互、`ejs` 渲染模板，流程简洁高效。

发布流程关键要点：
1. 配置 `files` 白名单，确保发布包纯净。
2. 发布前必须本地测试，避免线上功能异常。
3. 切换 npm 官方源，减少同步延迟导致的校验错误。

后续可扩展方向：
- 新增 React 配置模板（集成 `@tyteam/eslint-config-react`）。
- 加入 Prettier 集成，统一代码格式。
- 添加 Git Hooks（如 `husky`），提交时自动 lint。

工具已发布至 npm，团队成员可直接安装使用，实现代码规范“零配置”落地。