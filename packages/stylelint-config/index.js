import orderPlugin from 'stylelint-order'; // 引入 stylelint-order 插件（用于属性顺序控制）

// 导出 Flat ESM 配置（供外部项目在其 stylelint.config.js 中导入并展开）
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

