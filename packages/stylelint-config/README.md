## @tyteam/stylelint-config

共享的 Stylelint Flat ESM 配置，统一团队 CSS/SCSS/Vue 样式规范与属性顺序。

### 安装
```bash
pnpm add @tyteam/stylelint-config stylelint -D
```

### 在项目中使用（推荐）
在项目根创建 `stylelint.config.js`：
```js
import ty from '@tyteam/stylelint-config';
export default [...ty];
```

### 运行
```bash
# 仅检查
npx stylelint "**/*.{css,scss,vue}"

# 自动修复（仅对可修复规则生效，如属性顺序）
npx stylelint "**/*.{css,scss,vue}" --fix
```

### 规则说明（摘录）
- 命名规范：类名需以 `ty-` 开头（`selector-class-pattern`）
- 禁止：`!important`（`declaration-no-important`）
- 一致性：单引号、颜色小写及短写、前导 0、块尾分号
- 健壮性：禁止未知属性/单位，限制 ID 选择器与嵌套深度
- 属性顺序：通过 `stylelint-order` 控制声明顺序

> 提示：命名规范与禁止 `!important` 为不可自动修复规则，需要人工修改或降低规则级别。

### 本地验证（外部项目）
```bash
echo "@import './src/index.css';" > dummy.css # 任意项目样式
npx stylelint "**/*.{css,scss,vue}"
```