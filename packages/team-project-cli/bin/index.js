#!/usr/bin/env node
// 声明脚本解释器(运行环境)为 node（必须放在第一行，确保全局命令可执行）

// 命令行参数解析库，用于创建命令行工具和解析用户输入的参数
import { program } from 'commander';
// 交互式命令行界面库，用于创建用户问答式交互界面
import inquirer from 'inquirer';
// 嵌入式JavaScript模板引擎，用于动态生成文件内容
import ejs from 'ejs';
// Node.js文件系统模块的Promise版本，用于异步文件操作
import fs from 'fs/promises';
// 路径处理模块，用于处理和转换文件路径
import path from 'path';
// URL转文件路径工具函数，用于在ES模块中获取__dirname等效功能
import { fileURLToPath } from 'url';
// 同步执行子进程的模块，用于在Node.js中执行系统命令
import { execSync } from 'child_process';
import checkUpdateCommand from './commands/check-update.js';

// 解决 ES 模块中 __dirname 问题
// 在 ES 模块中，__dirname 不可用，需要通过 import.meta.url 转换得到
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 获取包信息
const pkg = JSON.parse(await fs.readFile(path.join(__dirname, '../package.json'), 'utf8'));

// 设置 CLI 程序版本信息
program
  .version(pkg.version)
  .description(pkg.description);

// 注册 init 命令 - 这是 CLI 的核心命令，用于初始化项目
program
  .command('init')
  .description('初始化项目并生成标准的前端项目结构')
  .action(async () => {
    try {
      // 1. 用户交互：询问项目名称和框架选择
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称：',
          default: path.basename(process.cwd())
        },
        {
          type: 'input',
          name: 'description',
          message: '请输入项目描述：',
          default: 'A qiankun micro-frontend sub application'
        },
        {
          type: 'list',
          name: 'framework',
          message: '请选择项目框架：',
          choices: [
            { name: 'Vue 3 (Vite)', value: 'vue3' },
            { name: 'Vue 3 (Qiankun)', value: 'vue3-qiankun' },
            { name: 'React (待支持)', value: 'react', disabled: '即将支持' },
            { name: 'Vanilla JS (待支持)', value: 'vanilla', disabled: '即将支持' }
          ]
        }
      ]);

      // 2. 根据选择的框架确定模板路径
      const templateDir = path.join(__dirname, `../templates/${answers.framework}-template`);
      
      // 检查模板是否存在
      try {
        await fs.access(templateDir);
      } catch (err) {
        console.error(`❌ 模板 ${answers.framework}-template 不存在`);
        return;
      }

      // 3. 复制模板到当前目录
      console.log(`📦 正在使用 ${answers.framework} 模板创建项目...`);
      await copyDir(templateDir, process.cwd(), { 
        projectName: answers.projectName,
        projectDescription: answers.description
      });

      // 4. 安装依赖
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
      console.log(`
下一步：
  cd ${answers.projectName}
  pnpm dev
`);
    } catch (err) {
      console.error('❌ 初始化失败：', err.message);
    }
  });

// 注册 check-update 命令
program.addCommand(checkUpdateCommand);

// 解析命令行参数
// 启动命令行程序，解析用户输入的命令和参数
program.parse(process.argv);

// 递归复制目录并渲染 EJS 模板
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