# @tyteam/prettier-config

Tyteam 团队统一的 Prettier 代码格式化配置，旨在实现团队代码风格的一致性。

## 🎯 配置说明

本配置包含以下核心规则：

- **printWidth**: 100 字符（保持代码可读性）
- **tabWidth**: 2 空格（主流前端规范）
- **singleQuote**: true（使用单引号）
- **trailingComma**: 'es5'（对象末尾逗号，便于 git diff）
- **semi**: true（语句末尾分号，提高清晰度）
- **arrowParens**: 'avoid'（箭头函数单参数省略括号）

## 📦 安装

```bash
# 安装 Prettier 和团队配置
pnpm add prettier @tyteam/prettier-config -D
```

## ⚙️ 使用

### 方式一：通过配置文件引用（推荐）

在项目根目录创建 `prettier.config.js`：

```js
import tyPrettier from '@tyteam/prettier-config';

export default {
  ...tyPrettier,
  // 可在此处添加项目特定的覆盖配置
  printWidth: 120  // 示例：覆盖默认的 printWidth
};
```

### 方式二：通过 package.json 引用

在 `package.json` 中添加：

```json
{
  "prettier": "@tyteam/prettier-config"
}
```

## ▶️ 验证与使用

### 1. 检查代码格式

```bash
# 检查整个项目的代码格式
npx prettier --check .

# 检查特定文件
npx prettier --check src/**/*.js
```

### 2. 自动格式化代码

```bash
# 格式化整个项目（谨慎使用，建议先检查）
npx prettier --write .

# 格式化特定文件
npx prettier --write src/**/*.js
```

### 3. 配合 ESLint 使用

如果项目同时使用 ESLint，建议安装 `eslint-config-prettier` 来避免规则冲突：

```bash
pnpm add eslint-config-prettier -D
```

然后在 ESLint 配置中添加：

```js
// eslint.config.js
import tyEslint from '@tyteam/eslint-config-base'; // 或其他 ESLint 配置
import prettierConfig from 'eslint-config-prettier';

export default [
  ...tyEslint,
  prettierConfig,
  // 其他配置...
];
```

## 🛠️ 本地开发与测试

### 1. 本地链接测试

```bash
# 进入 prettier-config 目录
cd packages/prettier-config

# 链接到全局
pnpm link --global

# 在测试项目中链接使用
cd /path/to/test/project
pnpm link --global @tyteam/prettier-config
```

### 2. 取消本地链接

```bash
# 取消全局链接
pnpm unlink --global @tyteam/prettier-config

# 在测试项目中取消链接
pnpm unlink @tyteam/prettier-config
```

## 🚀 发布到 npm

### 1. 登录 npm

```bash
# 确保使用正确的 npm 源
npm config set registry https://registry.npmjs.org/

# 登录账号
npm login
```

### 2. 发布

```bash
# 在 packages/prettier-config 目录下执行
npm publish --access public
```

## 📄 License

MIT