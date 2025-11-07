# <%= projectName %> 

这是一个使用 @tyteam 规范配置的示例项目。

## 项目结构

```
.
├── src/
│   ├── index.js          # JavaScript 示例文件
│   ├── App.vue           # Vue 示例文件
│   └── styles.css        # CSS 示例文件
├── eslint.config.js      # ESLint 配置
├── stylelint.config.js   # Stylelint 配置
├── prettier.config.js    # Prettier 配置
├── commitlint.config.js  # Commitlint 配置
└── package.json          # 项目配置和依赖
```

## 使用说明

### 安装依赖

```bash
pnpm install
```

### 代码检查

```bash
# 检查所有文件
pnpm lint

# 自动修复可修复的问题
pnpm lint:fix
```

### 代码格式化

```bash
# 格式化所有文件
pnpm format

# 检查文件格式
pnpm format:check
```

### 提交代码

项目集成了 husky、lint-staged 和 commitlint，确保提交前代码质量和提交信息规范。

```bash
# 提交前会自动运行 lint-staged，检查并修复暂存区文件
git add .
git commit -m "feat: add new feature"

# 示例提交信息
git commit -m "feat: add new feature"
git commit -m "fix: resolve issue"
git commit -m "docs: update README"
```

## 配置说明

### ESLint
- 使用 @tyteam/eslint-config-vue3 配置（Vue 项目）或 @tyteam/eslint-config-base（普通 JS 项目）
- 包含 Vue、Import、Promise 等插件规则

### Stylelint
- 使用 @tyteam/stylelint-config 配置
- 包含样式规范检查

### Prettier
- 使用 @tyteam/prettier-config 配置
- 统一代码格式

### Commitlint
- 使用 @tyteam/commitlint-config 配置
- 确保提交信息格式规范

### Lint-staged
- 使用 lint-staged 在提交前检查暂存区文件
- 配置在 `.lintstagedrc` 文件中

## 测试配置

可以通过修改示例文件来测试各种配置是否正常工作：

1. 在 `src/index.js` 中故意添加一些不符合规范的代码
2. 运行 `pnpm lint` 查看是否能正确检测问题
3. 运行 `pnpm lint:fix` 查看是否能自动修复部分问题
4. 尝试提交不符合规范的 commit 信息，验证 commitlint 是否生效
5. 修改文件并添加到暂存区，提交时验证 lint-staged 是否工作