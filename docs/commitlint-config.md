# @tyteam/commitlint-config 总结


## 一、核心作用  
`@tyteam/commitlint-config` 是团队 Git 提交信息规范的配置包，通过 `commitlint` 工具强制提交信息遵循统一格式（如 `type(scope): description`），主要解决：  
- 提交信息混乱、难以追溯变更目的的问题；  
- 便于通过提交信息自动生成 Changelog、识别版本变更类型（如 `feat` 对应 minor 版本，`fix` 对应 patch 版本）；  
- 统一团队协作规范，降低代码维护成本。  


## 二、核心实现方案  
### 1. 基础依赖选择  
采用 **`@commitlint/config-conventional`** 作为基础规则（而非 `@commitlint/config-angular`），原因：  
- 继承 Angular 规范的核心框架（如 `type(scope): description` 格式），但规则更灵活（允许空 `scope`、放宽描述大小写限制）；  
- 适配大多数前端/全栈团队，社区工具（如 `semantic-release`）兼容性更好；  
- 内置更贴合前端场景的提交类型（`build`/`ci`/`chore` 等）。  


### 2. 核心配置规则（`index.js`）  
基于 `config-conventional` 扩展，兼顾规范性和灵活性：  

| 规则分类       | 关键约束                                                                 |
|----------------|--------------------------------------------------------------------------|
| **提交类型（type）** | 必须从预定义列表选择：`feat`（新功能）、`fix`（修复）、`docs`（文档）、`style`（格式）、`refactor`（重构）、`perf`（性能）、`test`（测试）、`build`（构建）、`ci`（CI配置）、`chore`（杂项）、`revert`（回滚） |
| **范围（scope）**   | 可选（允许空值，如 `docs: update README`），若填写支持小写/驼峰/帕斯卡命名（如 `auth`/`userProfile`） |
| **描述（subject）** | 非空、无尾句号、最长80字符，允许首字母小写（如 `fix: resolve menu click bug`） |
| **正文（body）**    | 可选（简单提交可省略），若存在需前空一行，每行最长100字符（用于详细说明“为什么改”） |
| **脚注（footer）**  | 可选，用于标记破坏性变更（`BREAKING CHANGE: ...`）或关闭issue（`Closes #123`），需前空一行 |


### 3. 实现与发布步骤  
1. **项目初始化**：`packages/commitlint-config` 目录初始化 `package.json`，指定入口 `index.js`；  
2. **依赖安装**：`pnpm add @commitlint/cli @commitlint/config-conventional -D`；  
3. **配置编写**：继承 `config-conventional` 并添加团队规则（如允许空 `scope`）；  
4. **本地测试**：通过 `npx commitlint --config index.js --msg "测试信息"` 验证规则；  
5. **发布npm**：配置 `files` 白名单（`index.js`、`README.md`），执行 `npm publish --access public`。  


## 三、项目中使用（最佳实践）  
需结合 `husky`（Git钩子工具），在 `git commit` 时自动校验：  

1. **安装依赖**：  
   ```bash
   pnpm add @tyteam/commitlint-config @commitlint/cli husky -D
   ```  

2. **配置 commitlint**：  
   项目根目录创建 `commitlint.config.js`：  
   ```javascript
   module.exports = { extends: ["@tyteam/commitlint-config"] };
   ```  

3. **设置 Husky 钩子**：  
   ```bash
   # 初始化 Husky（启用 Git 钩子）
   npx husky install
   npm set-script prepare "husky install"  # 项目克隆后自动启用钩子

   # 添加 commit-msg 钩子（提交时触发校验）
   npx husky add .husky/commit-msg 'npx --no -- commitlint --edit $1'
   ```  


## 四、合法提交示例  
```bash
# 新功能（带 scope）
feat(auth): add SMS verification

# Bug 修复（无 scope）
fix: resolve mobile menu click delay

# 文档更新（带正文）
docs: update installation steps

Explain new steps for pnpm and npm users.
```  


## 五、总结  
`@tyteam/commitlint-config` 基于社区通用的 `conventional` 规范，通过定制化规则平衡了“规范性”和“易用性”，适合大多数前端/全栈团队。结合 Husky 可实现提交阶段的自动化校验，确保所有提交信息清晰、统一，为团队协作和版本管理提供可靠基础。