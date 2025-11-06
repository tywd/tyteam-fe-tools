# @tyteam/prettier-config 技术实现与发布全流程文档

## 一、工具简介

`@tyteam/prettier-config` 是 Tyteam 团队统一的 Prettier 代码格式化配置包，旨在实现团队代码风格的一致性，提升代码可读性和维护性。该包提供了一套经过团队讨论和实践验证的 Prettier 配置规则，可直接在项目中引用。

### 核心定位
- **代码格式统一**：通过统一的 Prettier 配置，确保团队成员代码风格一致
- **开箱即用**：简化项目中 Prettier 的配置流程，避免重复工作
- **易于扩展**：支持项目特定的配置覆盖，满足个性化需求

### 依赖生态
- **Prettier**：^3.3.3（核心依赖）
- **ES Modules**：使用现代 ES 模块语法导出配置

## 二、核心配置说明

### 默认配置规则

```javascript
export default {
  // 一行最多 100 字符，保持代码可读性
  printWidth: 100,
  
  // 使用 2 个空格缩进，符合主流前端规范
  tabWidth: 2,
  
  // 使用单引号代替双引号，减少视觉干扰
  singleQuote: true,
  
  // 对象末尾添加逗号（ES5 支持），便于 git diff 和添加新项
  trailingComma: 'es5',
  
  // 语句末尾添加分号，提高代码清晰度
  semi: true,
  
  // 箭头函数只有一个参数时省略括号，使代码更简洁
  arrowParens: 'avoid',
  
  // JSX 中使用双引号而不是单引号
  jsxSingleQuote: false,
  
  // 对象属性名始终使用引号，保持一致性
  quoteProps: 'consistent',
  
  // 在对象和数组字面量的括号内添加空格，提高可读性
  bracketSpacing: true,
  
  // JSX 标签的反尖括号需要换行，保持代码整洁
  bracketSameLine: false,
  
  // HTML 空白敏感性设置
  htmlWhitespaceSensitivity: 'css',
  
  // 换行符使用 lf（Linux 风格）
  endOfLine: 'lf',
  
  // 在文件末尾插入空行
  insertPragma: false,
  
  // 在顶部插入特殊注释标记
  requirePragma: false,
  
  // Vue 文件中的缩进
  vueIndentScriptAndStyle: false
};
```

### 配置设计原则

1. **可读性优先**：配置优先考虑代码的可读性和维护性
2. **业界标准**：参考主流前端团队的配置实践
3. **团队共识**：配置项经过团队讨论和实践验证
4. **易于扩展**：支持项目特定的配置覆盖

## 三、项目结构与实现

### 最终项目结构

```
@tyteam/prettier-config/
├── index.js          # 核心配置文件
├── package.json      # 包配置（含白名单、依赖等）
├── README.md         # 使用说明文档
└── docs/
    └── prettier-config.md  # 技术文档（本文档）
```

### 核心配置文件（`package.json`）

关键配置含**发布白名单**（`files` 字段）、包元信息等，确保发布包纯净：

```json
{
  "name": "@tyteam/prettier-config",
  "version": "1.0.0",
  "description": "Tyteam Prettier shared config",
  "type": "module",
  "main": "index.js",
  "files": [
    "index.js",
    "README.md",
    "package.json"
  ],
  "keywords": [
    "prettier",
    "config",
    "tyteam"
  ],
  "author": "Tyteam",
  "license": "MIT",
  "peerDependencies": {
    "prettier": "^3.3.3"
  },
  "devDependencies": {
    "prettier": "^3.6.2"
  }
}
```

### 核心代码实现（`index.js`）

```javascript
export default {
  // 一行最多 100 字符，保持代码可读性
  printWidth: 100,
  
  // 使用 2 个空格缩进，符合主流前端规范
  tabWidth: 2,
  
  // 使用单引号代替双引号，减少视觉干扰
  singleQuote: true,
  
  // 对象末尾添加逗号（ES5 支持），便于 git diff 和添加新项
  trailingComma: 'es5',
  
  // 语句末尾添加分号，提高代码清晰度
  semi: true,
  
  // 箭头函数只有一个参数时省略括号，使代码更简洁
  arrowParens: 'avoid',
  
  // JSX 中使用双引号而不是单引号
  jsxSingleQuote: false,
  
  // 对象属性名始终使用引号，保持一致性
  quoteProps: 'consistent',
  
  // 在对象和数组字面量的括号内添加空格，提高可读性
  bracketSpacing: true,
  
  // JSX 标签的反尖括号需要换行，保持代码整洁
  bracketSameLine: false,
  
  // HTML 空白敏感性设置
  htmlWhitespaceSensitivity: 'css',
  
  // 换行符使用 lf（Linux 风格）
  endOfLine: 'lf',
  
  // 在文件末尾插入空行
  insertPragma: false,
  
  // 在顶部插入特殊注释标记
  requirePragma: false,
  
  // Vue 文件中的缩进
  vueIndentScriptAndStyle: false
};
```

## 四、本地开发与测试流程

### 1. 环境准备

确保本地已安装以下工具：
- Node.js (≥18.0.0)
- pnpm (≥10.0.0)
- npm 账号并加入 `@tyteam` 组织

### 2. 本地开发

```bash
# 克隆项目代码
git clone <repository-url>
cd tyteam-fe-tools

# 安装依赖
pnpm install
```

### 3. 本地测试

为了避免发布后功能异常，需要先进行本地测试：

```bash
# 1. 进入 prettier-config 目录
cd packages/prettier-config

# 2. 本地链接包（模拟全局安装）
pnpm link --global

# 3. 新建测试项目并测试配置
mkdir test-prettier && cd test-prettier
pnpm init -y

# 4. 安装依赖
pnpm add prettier @tyteam/prettier-config -D

# 5. 创建测试文件
echo "const test = { a: 1, b: 2, }" > test.js

# 6. 创建配置文件
echo "import tyPrettier from '@tyteam/prettier-config';
export default { ...tyPrettier };" > prettier.config.js

# 7. 测试格式化
npx prettier --write test.js

# 8. 检查格式化结果
cat test.js
# 应该输出: const test = { a: 1, b: 2 };
```

### 4. 解除本地链接

测试完成后，需要解除本地链接以避免影响其他项目：

```bash
# 解除全局链接
pnpm unlink --global @tyteam/prettier-config

# 在测试项目中解除链接（如果需要）
cd /path/to/test/project
pnpm unlink @tyteam/prettier-config
```

## 五、npm 发布完整流程

### 1. 发布前准备

#### （1）包配置校验

确保 `package.json` 满足以下要求：
- `name` 为 `@tyteam/prettier-config`
- `files` 字段包含白名单（`index.js`、`package.json`、`README.md`）
- `version` 为待发布版本（遵循语义化版本规范）

#### （2）清理冗余文件

发布前确保无开发残留（`files` 白名单已过滤，但手动清理更稳妥）：

```bash
# 清理开发文件（如果存在）
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
# 在 prettier-config 目录执行发布命令（公共包需加 --access public）
npm publish --access public

# 发布成功提示：+ @tyteam/prettier-config@1.0.0
```

### 4. 发布后验证

#### （1）检查包信息

```bash
# 查看线上包详情（公共源）
npm view @tyteam/prettier-config

# 关键验证点：
# - version: 1.0.0（与发布版本一致）
# - files: 包含 index.js 等（白名单生效）
# - dist-tags: latest: 1.0.0（标签正确）
```

#### （2）实际项目测试

```bash
# 1. 创建测试项目
mkdir test-publish && cd test-publish
pnpm init -y

# 2. 安装线上包
pnpm add prettier @tyteam/prettier-config -D

# 3. 创建配置文件
echo "import tyPrettier from '@tyteam/prettier-config';
export default { ...tyPrettier };" > prettier.config.js

# 4. 创建测试文件
echo "const test = { a: 1, b: 2, }" > test.js

# 5. 测试格式化
npx prettier --write test.js

# 6. 检查结果
cat test.js
# 应该输出: const test = { a: 1, b: 2 };
```

### 5. 版本更新流程（后续迭代）

若需修改功能或调整配置，按以下步骤更新：

1. 修改代码并本地测试通过。
2. 更新 `package.json` 版本号（遵循语义化版本）：

```bash
npm version patch  # 修复 bug（1.0.0 → 1.0.1）
# npm version minor  # 新增功能（1.0.0 → 1.1.0）
# npm version major  # 不兼容变更（1.0.0 → 2.0.0）
```

3. 重新执行 `npm publish --access public` 发布新版本。

## 六、使用指南

### 1. 安装

```bash
# 安装 Prettier 和团队配置
pnpm add prettier @tyteam/prettier-config -D
```

### 2. 配置使用

#### 方式一：通过配置文件引用（推荐）

在项目根目录创建 `prettier.config.js`：

```js
import tyPrettier from '@tyteam/prettier-config';

export default {
  ...tyPrettier,
  // 可在此处添加项目特定的覆盖配置
};
```

#### 方式二：通过 package.json 引用

在 `package.json` 中添加：

```json
{
  "prettier": "@tyteam/prettier-config"
}
```

### 3. 验证与格式化

```bash
# 检查代码格式
npx prettier --check .

# 自动格式化代码
npx prettier --write .
```

## 七、常见问题与解决方案

| 问题描述 | 原因分析 | 解决方案 |
|---------|---------|---------|
| `prettier` 命令未找到 | 未正确安装 Prettier | 确保同时安装 `prettier` 和 `@tyteam/prettier-config` |
| 配置未生效 | 配置文件位置或格式错误 | 确保配置文件在项目根目录且格式正确 |
| 版本冲突 | 项目中 Prettier 版本与配置包要求不一致 | 统一 Prettier 版本或更新配置包 |
| 与 ESLint 冲突 | Prettier 与 ESLint 规则重叠 | 安装 `eslint-config-prettier` 并在 ESLint 配置中引用 |

## 八、总结

`@tyteam/prettier-config` 已实现核心目标：**统一团队代码格式化规范**，避免重复配置工作。该包通过简洁的配置文件提供了一套经过验证的 Prettier 规则，团队成员可直接安装使用，实现代码格式化"零配置"落地。

发布流程关键要点：
1. 配置 `files` 白名单，确保发布包纯净。
2. 发布前必须本地测试，避免线上功能异常。
3. 切换 npm 官方源，减少同步延迟导致的校验错误。

后续可扩展方向：
- 根据不同项目类型提供专门的配置变体
- 集成更多语言的格式化规则
- 提供 CLI 工具用于配置初始化和更新