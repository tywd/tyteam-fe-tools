# @tyteam/team-project-cli 开发指南

## 项目概述

@tyteam/team-project-cli 是一个基于 Node.js 的命令行工具，用于快速创建标准化的前端项目。它使用 Commander.js 处理命令行参数，Inquirer.js 创建交互式界面，EJS 作为模板引擎。

## 项目结构

```
packages/team-project-cli/
├── bin/
│   ├── commands/
│   │   └── check-update.js
│   └── index.js
├── templates/
│   └── vue3-template/
├── package.json
└── README.md
```

## 开发环境设置

### 克隆项目

```bash
git clone <repository-url>
cd tyteam-fe-tools
```

### 安装依赖

```bash
pnpm install
```

## 核心实现

### 主程序 (bin/index.js)

主程序负责：
1. 解析命令行参数
2. 注册命令
3. 处理用户交互

关键代码段：

```javascript
// 设置 CLI 程序版本信息
program
  .version(pkg.version)
  .description(pkg.description);

// 注册 init 命令
program
  .command('init')
  .description('初始化项目并生成标准的前端项目结构')
  .action(async () => {
    // 实现逻辑
  });

// 注册 check-update 命令
program.addCommand(checkUpdateCommand);
```

### 模板复制逻辑

模板复制功能通过递归遍历模板目录并渲染 EJS 模板实现：

```javascript
async function copyDir(src, dest, data) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  // 确保目标目录存在
  await fs.mkdir(dest, { recursive: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // 递归复制子目录
      await copyDir(srcPath, destPath, data);
    } else {
      // 处理文件
      if (entry.name.endsWith('.ejs')) {
        // 渲染 EJS 模板文件
        const templateContent = await fs.readFile(srcPath, 'utf8');
        const renderedContent = ejs.render(templateContent, data);
        // 去掉 .ejs 扩展名
        const finalDestPath = destPath.replace(/\.ejs$/, '');
        await fs.writeFile(finalDestPath, renderedContent);
      } else {
        // 对于特定的文本文件，也进行模板渲染
        const textFileExtensions = ['.html', '.js', '.ts', '.vue', '.css', '.scss', '.json', '.md', '.cjs'];
        const shouldRender = textFileExtensions.some(ext => entry.name.endsWith(ext));
        
        if (shouldRender) {
          const fileContent = await fs.readFile(srcPath, 'utf8');
          const renderedContent = ejs.render(fileContent, data);
          await fs.writeFile(destPath, renderedContent);
        } else {
          // 直接复制非模板文件
          await fs.copyFile(srcPath, destPath);
        }
      }
    }
  }
}
```

## 添加新命令

### 创建命令文件

在 `bin/commands/` 目录下创建新的命令文件，例如 `new-command.js`：

```javascript
import { Command } from 'commander';

const newCommand = new Command('new-command')
  .description('新命令的描述')
  .action(async () => {
    // 命令实现逻辑
    console.log('执行新命令');
  });

export default newCommand;
```

### 注册命令

在 `bin/index.js` 中导入并注册命令：

```javascript
import newCommand from './commands/new-command.js';

// 注册新命令
program.addCommand(newCommand);
```

## 添加新模板

### 创建模板目录

在 `templates/` 目录下创建新的模板文件夹，命名格式为 `{framework}-template`，例如 `react-template`。

### 模板文件

在模板目录中创建项目所需的文件和文件夹结构。可以使用 EJS 模板语法在文件中插入变量：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title><%= projectName %></title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

### 更新框架选择

在 `bin/index.js` 的框架选择列表中添加新选项：

```javascript
const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称：',
    default: path.basename(process.cwd())
  },
  {
    type: 'list',
    name: 'framework',
    message: '请选择项目框架：',
    choices: [
      { name: 'Vue 3 (Vite)', value: 'vue3' },
      { name: 'React (待支持)', value: 'react' }, // 添加新选项
      { name: 'Vanilla JS (待支持)', value: 'vanilla', disabled: '即将支持' }
    ]
  }
]);
```

## 测试

### 本地测试 CLI 工具

```bash
cd packages/team-project-cli
node bin/index.js --help
```

### 测试模板生成

创建测试目录并运行初始化命令：

```bash
mkdir test-project
cd test-project
node ../packages/team-project-cli/bin/index.js init
```

## 发布

### 版本更新

1. 更新 `package.json` 中的版本号
2. 提交更改并创建 Git 标签

### 发布到 npm

```bash
cd packages/team-project-cli
npm publish
```

## 最佳实践

### 代码规范

1. 使用 ESLint 和 Prettier 保持代码风格一致
2. 遵循 JavaScript 标准规范
3. 添加适当的注释

### 错误处理

1. 使用 try-catch 处理异步操作
2. 提供有意义的错误信息
3. 优雅地处理异常情况

### 用户体验

1. 提供清晰的提示信息
2. 显示操作进度
3. 给出下一步建议

## 贡献指南

欢迎提交 issue 和 pull request 来改进 @tyteam/team-project-cli。

### 提交代码

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

### 代码审查

所有 Pull Request 都需要经过代码审查才能合并。