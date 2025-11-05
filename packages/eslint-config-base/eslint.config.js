// eslint.config.js
import importPlugin from 'eslint-plugin-import';
import nPlugin from 'eslint-plugin-n';
import promisePlugin from 'eslint-plugin-promise';

export default [
  // 1. 注册所有需要的插件
  {
    plugins: {
      import: importPlugin,
      n: nPlugin,
      promise: promisePlugin
    }
  },

  // 2. 应用 standard 的核心规则（复现 standard 的默认配置）
  {
    rules: {
      // 从 eslint-plugin-import 继承的规则（standard 包含的）
      ...importPlugin.configs.recommended.rules,
      
      // 从 eslint-plugin-n 继承的规则（standard 包含的）
      ...nPlugin.configs.recommended.rules,
      
      // 从 eslint-plugin-promise 继承的规则（standard 包含的）
      ...promisePlugin.configs.recommended.rules,
      
      // standard 特有的基础规则（补充）
      'arrow-spacing': 'error',
      'block-spacing': 'error',
      'brace-style': ['error', '1tbs'],
      'comma-dangle': ['error', 'only-multiline'],
      'comma-spacing': 'error',
      'comma-style': 'error',
      'func-call-spacing': 'error',
      'key-spacing': 'error',
      'keyword-spacing': 'error',
      'new-parens': 'error',
      'no-array-constructor': 'error',
      'no-cond-assign': ['error', 'except-parens'],
      'no-constant-condition': 'warn',
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-empty-character-class': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-parens': ['error', 'functions'],
      'no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-negated-in-lhs': 'error',
      'no-obj-calls': 'error',
      'no-regex-spaces': 'error',
      'no-sparse-arrays': 'error',
      'no-unexpected-multiline': 'error',
      'no-unreachable': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: true }],
      'use-isnan': 'error',
      'valid-typeof': 'error',
      'wrap-iife': ['error', 'inside'],
      'yield-star-spacing': 'error'
    }
  },

  // 3. 团队定制规则（覆盖上面的规则）
  {
    rules: {
      "no-var": "error",                  // 禁止 var
      "complexity": ["warn", 15],         // 函数复杂度限制
      "no-console": "off",                // 允许 console
      "indent": ["error", 2],             // 2空格缩进
      "semi": ["error", "always"],        // 强制分号
      "quotes": ["error", "single"],      // 单引号
      "import/order": ["warn", { "alphabetize": { "order": "asc" } }]  // import 排序
    }
  }
];