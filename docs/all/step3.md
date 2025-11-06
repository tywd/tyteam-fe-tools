# step3 通用模块开发 P0

可以直接按梳理好的步骤开始开发，你已具备核心前提——npm组织（tyteam）可用于托管团队私有规范包（如@tyteam/eslint-config-base），且通用功能与专属功能的边界、优先级已明确，无需额外前置准备。

以下是基于你的npm组织（tyteam）定制的 **《通用功能模块开发任务分解表》**，聚焦P0/P1级核心模块，拆解到“可直接执行”的步骤，每个步骤均关联你的组织名确保包名统一。

# 通用功能模块开发任务分解表（基于tyteam组织）
## 说明
- 所有团队包统一前缀 **@tyteam/**，发布到你的npm组织下（需确保npm账号已加入tyteam组织并有权限发布）。
- 开发环境默认使用pnpm（与你的技术栈一致），Monorepo架构基于pnpm workspace + Lerna初始化。

| 模块（优先级）       | 具体开发步骤                                                                 | 预期输出物                                                                 | 技术栈/工具细节                                                                 |
|----------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------|------------------------------------------------------------------------------|
| 1. 初始化Monorepo环境（P0） | 1. 新建项目根目录（如tyteam-fe-tools），执行`pnpm init`生成根package.json；<br>2. 新建pnpm-workspace.yaml，配置工作区（如`packages: ['packages/*']`）；<br>3. 全局安装Lerna（`pnpm add -g lerna`），执行`lerna init`初始化Monorepo；<br>4. 在根package.json中添加`"private": true`，避免根包被发布。 | 1. 根目录package.json；<br>2. pnpm-workspace.yaml；<br>3. lerna.json；<br>4. packages子目录（用于存放所有@tyteam/包）。 | - Lerna版本建议^6.0.0；<br>- pnpm版本建议^8.0.0（与项目技术栈对齐）。                                                                 |
| 2. @tyteam/eslint-config-base（P0） | 1. 在packages目录下新建子目录eslint-config-base，执行`pnpm init`；<br>2. 修改package.json：<br>   - name设为`@tyteam/eslint-config-base`；<br>   - main设为`index.js`；<br>   - 新增peerDependencies（eslint: ^8.0.0）；<br>3. 安装依赖：`pnpm add eslint eslint-plugin-import eslint-config-standard -D`；<br>4. 编写index.js：继承standard规则，覆盖团队定制规则（如禁止var、限制函数复杂度）；<br>5. 测试：新建test目录，写不规范JS文件，执行`npx eslint test/`验证规则生效。 | 1. @tyteam/eslint-config-base包（含package.json、index.js）；<br>2. 测试用例及验证报告；<br>3. 包README（说明安装命令、使用方式）。 | - 规则参考：eslint-config-standard（基础规则）；<br>- 定制规则示例：`"no-var": "error"`、`"complexity": ["warn", 15]`。                                                                 |
| 3. @tyteam/eslint-config-vue3（P0） | 1. 在packages目录下新建eslint-config-vue3，执行`pnpm init`，name设为`@tyteam/eslint-config-vue3`；<br>2. 安装依赖：`pnpm add eslint-plugin-vue -D`，并添加peerDependencies（@tyteam/eslint-config-base: ^1.0.0、vue-eslint-parser: ^9.0.0）；<br>3. 编写index.js：通过`extends`继承`'./node_modules/@tyteam/eslint-config-base'`和`'plugin:vue/vue3-essential'`，补充团队Vue规则（如组件命名 PascalCase）；<br>4. 测试：新建Vue文件（含不规范模板语法），执行`npx eslint test.vue`验证。 | 1. @tyteam/eslint-config-vue3包；<br>2. Vue3规则测试用例；<br>3. README（说明需配合vue-eslint-parser使用）。 | - eslint-plugin-vue版本建议^9.0.0（支持Vue3）；<br>- 关键规则：`"vue/component-name-in-template-casing": ["error", "PascalCase"]`。                                                                 |
| 4. team-cli核心（2.1 通用版，P0） | 1. 在packages目录下新建team-cli，执行`pnpm init`，name设为`@tyteam/cli`，bin字段设为`"team-cli": "bin/index.js"`；<br>2. 安装依赖：`pnpm add commander inquirer ejs -D`；<br>3. 新建bin/index.js（入口文件）：<br>   - 用commander注册`init`命令；<br>   - 用inquirer实现交互（询问项目类型：Vue3/React）；<br>4. 新建templates目录，存放ejs模板（如.eslintrc.ejs、package.json.ejs），根据项目类型渲染对应配置（Vue3项目引入@tyteam/eslint-config-vue3）；<br>5. 测试：执行`node bin/index.js init`，验证能生成配置文件。 | 1. @tyteam/cli包（含bin入口、ejs模板）；<br>2. init命令可正常执行，生成带@tyteam/规范的配置；<br>3. README（说明team-cli init用法）。 | - commander用于命令注册，inquirer处理交互，ejs渲染模板；<br>- ejs模板变量示例：`"extends": "<%= eslintConfig %>"`（Vue3项目对应@tyteam/eslint-config-vue3）。                                                                 |
| 5. @tyteam/commitlint-config（P1） | 1. 在packages目录下新建commitlint-config，name设为`@tyteam/commitlint-config`；<br>2. 安装依赖：`pnpm add @commitlint/cli @commitlint/config-angular -D`；<br>3. 编写index.js：继承@commitlint/config-angular，修改团队定制规则（如允许docs类型提交无scope）；<br>4. 测试：执行`npx commitlint --config index.js --from HEAD~1 --to HEAD`验证提交信息。 | 1. @tyteam/commitlint-config包；<br>2. 提交信息测试用例（如`docs: update README`需通过校验）。 | - 基础规则继承@commitlint/config-angular；<br>- 定制规则示例：`"scope-empty": ["warn", "never"]`（允许scope为空）。                                                                 |


## 关键注意事项（与你的npm组织相关）
1. 包发布权限：开发完成后，需执行`npm login`登录你的账号，确保已加入tyteam组织，发布时用`pnpm publish --access public`（公开包）或`--access restricted`（私有包，需npm组织开通私有权限）。
2. 版本管理：用Lerna统一管理所有@tyteam/包的版本，执行`lerna version`更新版本号，`lerna publish`批量发布，避免手动维护版本不一致。


### 下一步交付物提议
为了帮你快速启动第一个包（@tyteam/eslint-config-base）的开发，我可以帮你生成一份 **@tyteam/eslint-config-base的package.json模板** 和 **核心规则配置（index.js）示例**，直接复制到你的项目中就能开始修改，省去初期配置时间。需要我现在生成吗？