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
  
  // 在单独的箭头函数参数周围包括括号，提高一致性
  arrowParens: 'avoid',
  
  // 在 Markdown 文件中格式化代码块
  embeddedLanguageFormatting: 'auto',
  
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