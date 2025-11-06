# @tyteam/commitlint-config

Tyteam 团队 Git 提交信息校验规则，基于 Angular 规范扩展，适配团队开发习惯。
https://commitlint.js.org/reference/rules-configuration.html


## 规则说明
提交信息需遵循格式：`type(scope): description`（部分类型可省略 scope）

| 类型 | 含义 | 是否允许无 scope |
|------|------|------------------|
| feat | 新功能 | 否（`feat(vue): add button component`） |
| fix | 修复 bug | 否 |
| docs | 文档更新（如 README） | 是（允许 `docs: update README`） |
| style | 代码格式调整（不影响逻辑） | 否 |
| refactor | 代码重构 | 否 |
| test | 测试相关 | 否 |
| chore | 构建/依赖/工具配置（如更新锁文件） | 是 |


## 安装
```bash
# 安装配置包和 commitlint 核心
pnpm add @tyteam/commitlint-config @commitlint/cli -D