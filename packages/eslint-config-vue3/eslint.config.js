import baseConfig from '@tyteam/eslint-config-base';
import vuePlugin from 'eslint-plugin-vue';
// 关键：显式导入 vue-eslint-parser 解析器对象
import vueEsLintParser from 'vue-eslint-parser';
const baseConfigWithFiles = baseConfig.filter(Boolean).map(config => ({
  files: ['**/*.js', '**/*.vue'], // 明确匹配 JS 和 Vue 文件
  ...config // 合并原 base 配置（如 plugins、基础 rules）
}));
export default [
  // 1. 继承本地 base 包的基础配置，过滤 base 配置中可能的无效项（保险措施）
  // {
  //   files: ['**/*.vue', '**/*.js'], // 关键：明确匹配 Vue 和 JS 文件(ESLint v9 扁平配置需要明确通过 files 字段指定 “哪些文件要应用这些规则”)
  //   ...baseConfig.filter(Boolean),
  // },
  ...baseConfigWithFiles,

  // 2. Vue3 解析器配置（自定义数组项）Vue 专属配置：仅作用于 .vue 文件（解析器 + 插件 + 规则）
  {
    files: ['**/*.vue'], // 只对 .vue 文件生效
    languageOptions: {
      parser: vueEsLintParser, // 必须指定 Vue 解析器
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        vueFeatures: { // 显式启用 Vue3 特性（可选，但推荐）
          scriptSetup: true, // 支持 <script setup> 语法
          compositionApi: true
        }
      }
    },
    plugins: {
      vue: vuePlugin
    },
    rules: { // https://eslint.vuejs.org/rules/ 官网参考
      // Vue 官方 essential 规则（适配 eslint-plugin-vue@10）
      ...vuePlugin.configs['essential'].rules,
      // 团队定制 Vue 规则（覆盖默认规则）
      "vue/component-name-in-template-casing": ["error", "PascalCase"], // 组件名在模板中必须使用 PascalCase

      "vue/html-quotes": ["error", "double"], // 模板中属性值必须加引号

      "vue/html-indent": ["error", 2], // 模板缩进为 2 空格

      "vue/prop-name-casing": ["error", "camelCase"], // 组件 props 必须指定类型

      "vue/no-v-html": "error", // 禁止在模板中使用 v-html（安全风险）

      // https://eslint.vuejs.org/rules/component-api-style.html 参考配置
      "vue/component-api-style": ["error",  // v10 新增规则：约束组件 API 风格
        ["script-setup", "composition"] // 要求使用 <script setup> 语法（可选）
      ]
    }
  }
];