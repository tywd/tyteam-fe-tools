# @tyteam/stylelint-config 技术文档

## 一、包搭建说明

### 1.1 目录结构
```
packages/stylelint-config/
├── index.js          # 主入口文件（ESM 对象导出）
├── package.json      # 包配置
├── README.md         # 使用文档
└── local.config.js   # 本地测试辅助文件（可选，不发布）
```

### 1.2 初始化 package.json
```json
{
  "name": "@tyteam/stylelint-config",
  "version": "1.0.0",
  "description": "Tyteam stylelint flat ESM shared config",
  "type": "module",
  "main": "index.js",
  "files": [
    "index.js",
    "README.md",
    "package.json"
  ],
  "keywords": ["stylelint", "config", "flat", "tyteam"],
  "author": "Tyteam",
  "license": "MIT",
  "peerDependencies": {
    "stylelint": "^16.0.0"
  },
  "dependencies": {
    "stylelint-order": "^6.0.4"
  }
}
```

**关键点：**
- `"type": "module"`：使用 ESM 模块
- `"main": "index.js"`：入口文件
- `"files"`：发布白名单，仅包含必要文件
- `peerDependencies`：stylelint 由使用方提供
- `dependencies`：stylelint-order 插件作为依赖

### 1.3 编写 index.js（核心配置）
```js
import orderPlugin from 'stylelint-order'; // 引入 stylelint-order 插件

// 导出对象配置（而非数组），确保 Stylelint CLI 稳定识别
export default {
    plugins: [orderPlugin], // 使用 stylelint-order 插件
    rules: {
      // —— 一致性与可读性 ——
      'color-hex-case': 'lower', // 颜色十六进制小写
      'color-hex-length': 'short', // 颜色十六进制使用短写形式（如 #ffffff -> #fff）
      'string-quotes': 'single', // 字符串使用单引号
      'number-leading-zero': 'always', // 小于 1 的小数保留前导 0（0.5 而非 .5）
      'declaration-block-trailing-semicolon': 'always', // 声明块末尾必须加分号
      'block-no-empty': true, // 禁止空的样式块
      'comment-no-empty': true, // 禁止空注释

      // —— 健壮性 ——
      'property-no-unknown': true, // 禁止未知 CSS 属性
      'unit-no-unknown': true, // 禁止未知单位
      'value-keyword-case': 'lower', // 关键字值小写
      'selector-max-id': 0, // 禁止使用 ID 选择器（提高可维护性）
      'max-nesting-depth': 3, // 限制最大嵌套深度

      // —— 团队约束 ——
      'declaration-no-important': true, // 禁止使用 !important
      'selector-class-pattern': [ // 统一类名：ty- 前缀，小写字母/数字/短横线
        '^ty-[a-z0-9-]+$',
        { message: '类名需以 ty- 开头，仅含小写字母、数字、中划线' }
      ],

      // —— 属性顺序（stylelint-order 提供）——
      'order/order': ['custom-properties', 'declarations'], // 自定义属性在前，其次为常规声明
      'order/properties-order': [ // 属性声明顺序（示例，可按需扩充/调整）
        'width',
        'height',
        'margin',
        'padding',
        'font-size',
        'color'
      ]
    }
};
```

**重要：导出对象而非数组**
- ❌ `export default [{ plugins, rules }]`：在某些环境下 Stylelint CLI 无法识别
- ✅ `export default { plugins, rules }`：稳定可靠

## 二、配置规则说明

### 2.1 一致性与可读性
- `color-hex-case`: 颜色值小写
- `color-hex-length`: 使用短写形式（#fff 而非 #ffffff）
- `string-quotes`: 单引号
- `number-leading-zero`: 小数前导 0（0.5 而非 .5）
- `declaration-block-trailing-semicolon`: 声明块末尾分号
- `block-no-empty`: 禁止空样式块
- `comment-no-empty`: 禁止空注释

### 2.2 健壮性
- `property-no-unknown`: 禁止未知 CSS 属性
- `unit-no-unknown`: 禁止未知单位
- `value-keyword-case`: 关键字值小写
- `selector-max-id`: 禁止 ID 选择器（设为 0）
- `max-nesting-depth`: 限制嵌套深度（设为 3）

### 2.3 团队约束
- `declaration-no-important`: 禁止使用 !important
- `selector-class-pattern`: 类名需以 `ty-` 开头，仅含小写字母、数字、中划线

### 2.4 属性顺序（stylelint-order）
- `order/order`: 自定义属性在前，常规声明在后
- `order/properties-order`: 属性声明顺序（可扩展）

## 三、本地测试流程

### 3.1 创建测试项目（stylelint-consumer）

在 `qoder` 目录下创建测试项目：

```bash

mkdir stylelint-consumer
cd stylelint-consumer
```

### 3.2 初始化测试项目

**package.json：**
```json
{
  "name": "stylelint-consumer",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "lint:css": "stylelint \"**/*.{css,scss,vue}\"",
    "lint:css:fix": "stylelint \"**/*.{css,scss,vue}\" --fix"
  },
  "devDependencies": {
    "@tyteam/stylelint-config": "link:/Users/tyteam/Desktop/web/qoder/tyteam-fe-tools/packages/stylelint-config",
    "stylelint": "^16.25.0"
  }
}
```
该路径为你当前`stylelint-config`本地包的绝对路径
`"@tyteam/stylelint-config": "link:/Users/tyteam/Desktop/web/qoder/tyteam-fe-tools/packages/stylelint-config" `


**关键点：**
- 使用 `link:` 协议链接本地包
- `"type": "module"`：确保 ESM 支持

**stylelint.config.js：**
```js
// 本地消费者项目：以包名方式导入配置
import ty from '@tyteam/stylelint-config';
export default { ...ty };
```

**测试文件 src/test.css：**
```css
.ty-order {
  width: 100px;
  height: 20px;
  margin: 0;
  color: #000;
}

.BadClass {
  color: red !important;
}
```

### 3.3 执行测试

```bash
# 1. 安装依赖
pnpm install

# 2. 运行检查（应报错：BadClass 命名不规范、!important 禁止）
pnpm run lint:css

# 3. 自动修复（仅修复属性顺序，命名和 !important 需手动修改）
pnpm run lint:css:fix

# 4. 验证修复后的属性顺序
cat src/test.css
```

**预期结果：**
- `.ty-order` 的属性顺序会被自动调整为：width → height → margin → color
- `.BadClass` 的命名和 `!important` 会报错但不会自动修复

## 四、发布到 npm 完整流程

### 4.1 取消本地链接

在 `stylelint-consumer` 项目中：

```bash
cd /Users/tyteam/Desktop/web/qoder/stylelint-consumer

# 移除本地链接
pnpm remove @tyteam/stylelint-config

# 或直接编辑 package.json，将 link: 协议改为版本号（发布后）
# "@tyteam/stylelint-config": "^1.0.0"
```

### 4.2 发布前检查

在 `packages/stylelint-config` 目录：

```bash
cd /Users/tyteam/Desktop/web/qoder/tyteam-fe-tools/packages/stylelint-config

# 1. 检查 package.json 的 files 字段（确保只发布必要文件）
cat package.json | grep -A 5 '"files"'

# 2. 检查版本号
cat package.json | grep '"version"'

# 3. 确认已登录 npm 且有发布权限
npm whoami

# 4. 检查包名是否可用（可选）
npm view @tyteam/stylelint-config
```

### 4.3 版本管理

```bash
# 功能新增（minor）
npm version minor

# 修复（patch）
npm version patch

# 重大变更（major）
npm version major
```

### 4.4 发布到 npm

```bash
# 发布公开包
pnpm publish --access public

# 或使用 npm
npm publish --access public
```

**发布流程：**
1. 自动执行 `prepublishOnly` 钩子（如有）
2. 打包 `files` 字段指定的文件
3. 上传到 npm registry
4. 更新版本号（如使用 `npm version`）

### 4.5 验证发布结果

```bash
# 1. 查看已发布的包信息
npm view @tyteam/stylelint-config

# 2. 在测试项目中安装已发布的包
cd /Users/tyteam/Desktop/web/qoder/stylelint-consumer
pnpm add @tyteam/stylelint-config@latest -D

# 3. 运行测试
pnpm run lint:css
```

### 4.6 更新测试项目使用已发布版本

编辑 `stylelint-consumer/package.json`：

```json
{
  "devDependencies": {
    "@tyteam/stylelint-config": "^1.0.0",  // 改为版本号
    "stylelint": "^16.25.0"
  }
}
```

然后：
```bash
pnpm install
pnpm run lint:css
```

## 五、常见问题

### 5.1 "No rules found within configuration"
**原因：** 导出为数组格式时，Stylelint CLI 在某些环境下无法识别。

**解决：** 使用对象导出 `export default { plugins, rules }`。

### 5.2 某些规则无法自动修复
**说明：** 命名规范（`selector-class-pattern`）和禁止 `!important`（`declaration-no-important`）等语义规则不可自动修复，需手动修改。

**可自动修复的规则：** 属性顺序、格式类规则（如引号、大小写等）。

### 5.3 本地链接测试失败
**检查：**
1. `package.json` 中 `link:` 路径是否正确
2. 是否执行了 `pnpm install`
3. `stylelint.config.js` 是否正确导入并展开配置

### 5.4 发布后无法安装
**检查：**
1. 包名是否正确（`@tyteam/stylelint-config`）
2. 版本号是否存在
3. npm 账号是否有该组织的发布权限

## 六、维护建议

1. **版本管理：** 遵循语义化版本（SemVer）
2. **规则调整：** 重大变更使用 major 版本，新增规则使用 minor，修复使用 patch
3. **文档同步：** 更新规则时同步更新 README.md
4. **测试覆盖：** 发布前务必在本地测试项目中验证

## 七、参考资源

- [Stylelint 官方文档](https://stylelint.io/)
- [stylelint-order 插件](https://github.com/hudochenkov/stylelint-order)
- [npm 发布指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
