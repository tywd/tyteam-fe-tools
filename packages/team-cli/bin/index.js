#!/usr/bin/env node
// 声明脚本解释器(运行环境)为 node（必须放在第一行，确保全局命令可执行）

import { program } from 'commander';
import inquirer from 'inquirer';
import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import lintCommand from './commands/lint.js';
import checkUpdateCommand from './commands/check-update.js';
import lintInitCommand from './commands/lint-init.js';

// 解决 ES 模块中 __dirname 问题
// 在 ES 模块中，__dirname 不可用，需要通过 import.meta.url 转换得到
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 注册 init 命令 - 这是 CLI 的核心命令，用于初始化项目配置
program
  .command('init')
  .description('初始化项目并生成团队规范配置（ESLint 等）')
  .action(async () => {
    try {
      // 1. 用户交互：询问项目类型和是否需要集成提交规范
      // 使用 inquirer 创建交互式命令行界面，提升用户体验
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称：',
          default: path.basename(process.cwd())
        },
        {
          type: 'list',
          name: 'projectType',
          message: '请选择项目类型：',
          choices: [
            { name: 'Vue3', value: 'vue3' },
            { name: 'React', value: 'react' },
            { name: '普通 JavaScript 项目', value: 'js' }
          ]
        },
        {
          type: 'confirm',
          name: 'useCommitlint',
          message: '是否集成提交规范（husky + @tyteam/commitlint-config）？',
          default: true
        }
      ]);

      // 2. 根据项目类型确定 ESLint 配置
      // 映射不同项目类型到对应的 ESLint 配置包
      const eslintConfigMap = {
        vue3: '@tyteam/eslint-config-vue3',
        react: '@tyteam/eslint-config-react',
        js: '@tyteam/eslint-config-base'
      };
      const eslintConfig = eslintConfigMap[answers.projectType];

      // 3. 渲染模板并生成文件
      // 获取模板目录路径，所有模板文件都存储在 templates 目录中
      const templateDir = path.join(__dirname, '../templates');
      // 添加日志，输出实际路径
      console.log('模板目录路径：', templateDir); // 新增这行，用于调试

      // 3.1 复制整个项目结构
      await copyDir(templateDir, process.cwd(), { 
        projectName: answers.projectName,
        eslintConfig 
      }, answers.projectType);

      // 3.2 安装依赖
      console.log('📦 正在安装依赖...');
      try {
        execSync('pnpm install', {
          stdio: 'inherit'
        });
        console.log('✅ 依赖安装完成！');
      } catch (e) {
        console.log('⚠️  依赖安装失败，请手动执行 pnpm install');
      }

      console.log('✅ 项目初始化成功！');

      // 可选：集成 commitlint + husky
      // 如果用户选择集成提交规范，则安装相关依赖并配置 Git Hooks
      if (answers.useCommitlint) {
        try {
          console.log('📦 正在安装提交规范依赖（commitlint + husky）...');
          
          // 安装 commitlint 和 husky 相关依赖
          execSync('pnpm add @tyteam/commitlint-config @commitlint/cli husky -D', {
            stdio: 'inherit'
          });
          
          // 初始化 husky
          console.log('🔧 正在初始化 husky...');
          // 使用 husky v9 推荐的方式
          execSync('npx husky init', { stdio: 'inherit' });
          
          // 添加 pre-commit 钩子
          console.log('🔗 正在添加 pre-commit 钩子...');
          // 直接创建 pre-commit 钩子文件
          const huskyDir = path.join(process.cwd(), '.husky');
          const preCommitHookPath = path.join(huskyDir, 'pre-commit');
          await fs.writeFile(
            preCommitHookPath,
            `#!/usr/bin/env sh
. "\$(dirname "\$0")/_/husky.sh"

pnpm pre-commit
`
          );
          // 给钩子文件添加执行权限
          execSync(`chmod +x "${preCommitHookPath}"`, { stdio: 'inherit' });
          
          // 添加 commit-msg 钩子
          console.log('🔗 正在添加 commit-msg 钩子...');
          // 直接创建 commit-msg 钩子文件
          const commitMsgHookPath = path.join(huskyDir, 'commit-msg');
          await fs.writeFile(
            commitMsgHookPath,
            `#!/usr/bin/env sh
. "\$(dirname "\$0")/_/husky.sh"

npx --no -- commitlint --edit "\${1}"
`
          );
          // 给钩子文件添加执行权限
          execSync(`chmod +x "${commitMsgHookPath}"`, { stdio: 'inherit' });

          console.log('✅ 提交规范集成完成');
        } catch (e) {
          console.log('❌ 提交规范集成失败：', e.message);
          console.log('💡 请确保已安装 pnpm 并能正常连接到 npm registry');
        }
      }
    } catch (err) {
      console.error('❌ 初始化失败：', err.message);
    }
  });

// 注册其他子命令
// 将 lint、check-update 和 lint init 命令注册到主程序中
program.addCommand(lintCommand);
program.addCommand(checkUpdateCommand);
program.addCommand(lintInitCommand);

// 解析命令行参数
// 启动命令行程序，解析用户输入的命令和参数
program.parse(process.argv);

// 递归复制目录并渲染 EJS 模板
async function copyDir(src, dest, data, projectType) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  // 确保目标目录存在
  await fs.mkdir(dest, { recursive: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    // 对于特定项目类型的文件，根据项目类型决定是否复制
    const fileName = entry.name.replace(/\.ejs$/, '');
    
    // 根据项目类型过滤文件
    if (projectType === 'vue3' && fileName === 'App.jsx') continue;
    if (projectType === 'react' && fileName === 'App.vue') continue;
    if (projectType === 'js' && (fileName === 'App.vue' || fileName === 'App.jsx')) continue;
    
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // 递归复制子目录
      await copyDir(srcPath, destPath, data, projectType);
    } else {
      // 处理文件
      if (entry.name.endsWith('.ejs')) {
        // 渲染 EJS 模板文件
        const templateContent = await fs.readFile(srcPath, 'utf8');
        const renderedContent = ejs.render(templateContent, data);
        // 去掉 .ejs 扩展名并确保配置文件有正确的扩展名
        let finalDestPath = destPath.replace(/\.ejs$/, '');
        // 确保配置文件有正确的扩展名
        if (fileName.startsWith('eslint.config') || 
            fileName.startsWith('stylelint.config') || 
            fileName.startsWith('prettier.config') || 
            fileName.startsWith('commitlint.config') ||
            fileName.startsWith('.lintstagedrc')) {
          if (!finalDestPath.endsWith('.js') && !finalDestPath.endsWith('.rc')) {
            finalDestPath += fileName.includes('.lintstagedrc') ? '' : '.js';
          }
        }
        await fs.writeFile(finalDestPath, renderedContent);
      } else {
        // 直接复制非模板文件
        await fs.copyFile(srcPath, destPath);
      }
    }
  }
}
