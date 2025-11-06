// 继承社区通用规范（基于 Angular 规范，更适合前端团队）
const conventionalConfig = require('@commitlint/config-conventional');

module.exports = {
  ...conventionalConfig,
  // 定制团队提交规则（覆盖或扩展基础规则）
  rules: {
    ...conventionalConfig.rules,

    /**
     * 提交类型（type）规则
     * 限制提交类型必须在指定列表中，错误级别为 error
     * 常用类型说明：
     * - feat: 新功能
     * - fix: Bug 修复
     * - docs: 文档更新
     * - style: 代码格式调整（不影响代码运行的变动）
     * - refactor: 代码重构（既不是新功能也不是修复 Bug）
     * - perf: 性能优化
     * - test: 新增或修改测试代码
     * - build: 构建相关（如依赖、打包配置）
     * - ci: CI 配置调整
     * - chore: 其他不影响 src 和 test 的变动
     * - revert: 回滚提交
     */
    'type-enum': [
      'error',
      'always',
      [
        'feat', 'fix', 'docs', 'style', 'refactor',
        'perf', 'test', 'build', 'ci', 'chore', 'revert'
      ]
    ],

    /**
     * scope 规则（可选，用于标识提交影响的范围，如模块、组件）
     * 允许 scope 为空（如简单的文档更新无需指定范围），警告级别
     */
    'scope-empty': ['warn', 'always'], // "always" 表示允许空 scope
    'scope-case': ['error', 'always', ['lowerCase', 'camelCase', 'PascalCase']], // scope 允许小写、驼峰、帕斯卡命名

    /**
     * 描述信息（subject）规则
     * subject 是提交的简短描述，需简洁明了
     */
    'subject-empty': ['error', 'never'], // 禁止空描述
    'subject-full-stop': ['error', 'never'], // 描述末尾不允许有句号
    'subject-max-length': ['error', 'always', 80], // 描述最大长度 80 字符
    'subject-case': ['error', 'never', ['upper-case']], // 禁止全大写描述（允许首字母小写或大写）

    /**
     * 正文（body）规则
     * body 是提交的详细描述，可多行，用于解释为什么做这个变更
     */
    'body-empty': ['warn', 'always'], // 允许空正文（简单提交可省略）
    'body-leading-blank': ['error', 'always'], // 正文前必须有一个空行（如果存在正文）
    'body-max-line-length': ['error', 'always', 100], // 正文每行最大 100 字符（便于阅读）

    /**
     * 脚注（footer）规则
     * footer 用于说明 Breaking Changes（破坏性变更）或关闭 issue
     */
    'footer-empty': ['warn', 'always'], // 允许空脚注
    'footer-leading-blank': ['error', 'always'], // 脚注前必须有一个空行（如果存在脚注）
    'footer-max-line-length': ['error', 'always', 100], // 脚注每行最大 100 字符

    /**
     * 其他规则
     */
    'header-max-length': ['error', 'always', 100], // 整个提交信息首行（header）最大 100 字符
    'references-empty': ['warn', 'always'], // 允许无 issue 引用（非必需）
    'merge-message-match': ['error', 'always', /^Merge branch .*$/], // 合并提交格式校验
  }
};