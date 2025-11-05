#!/usr/bin/env node
// 声明脚本解释器(运行环境)为 node（必须放在第一行，确保全局命令可执行）

import { program } from 'commander';
import inquirer from 'inquirer';
import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 解决 ES 模块中 __dirname 问题
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 注册 init 命令
program
  .command('init')
  .description('初始化项目并生成团队规范配置（ESLint 等）')
  .action(async () => {
    try {
      // 1. 用户交互：询问项目类型
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'projectType',
          message: '请选择项目类型：',
          choices: [
            { name: 'Vue3', value: 'vue3' },
            { name: 'React', value: 'react' } // 预留 React 支持
          ]
        }
      ]);

      // 2. 根据项目类型确定 ESLint 配置
      const eslintConfigMap = {
        vue3: '@tyteam/eslint-config-vue3',
        react: '@tyteam/eslint-config-react' // 假设未来会实现 React 配置
      };
      const eslintConfig = eslintConfigMap[answers.projectType];

      // 3. 渲染模板并生成文件
      const templateDir = path.join(__dirname, '../templates');
      // 添加日志，输出实际路径
      console.log('模板目录路径：', templateDir); // 新增这行，用于调试
      // 3.1 渲染 ESLint 配置文件（eslint.config.js）
      const eslintTemplatePath = path.join(templateDir, 'eslint.config.ejs');
      const eslintOutputPath = path.join(process.cwd(), 'eslint.config.js');
      await ejs.renderFile(eslintTemplatePath, { eslintConfig }, {}, (err, str) => {
        if (err) throw err;
        fs.writeFile(eslintOutputPath, str);
      });

      // 3.2 渲染 package.json（添加 devDependencies）
      const pkgTemplatePath = path.join(templateDir, 'package.json.ejs');
      const pkgOutputPath = path.join(process.cwd(), 'package.json');
      // 若已有 package.json，合并内容；否则新建
      let existingPkg = {};
      try {
        existingPkg = JSON.parse(await fs.readFile(pkgOutputPath, 'utf8'));
      } catch (e) { /* 忽略文件不存在的错误 */ }
      
      await ejs.renderFile(pkgTemplatePath, { eslintConfig }, {}, (err, str) => {
        if (err) throw err;
        const templatePkg = JSON.parse(str);
        // 合并现有 package.json 与模板内容（优先保留现有配置，补充缺失项）
        const mergedPkg = {
          ...templatePkg,
          ...existingPkg,
          devDependencies: {
            ...templatePkg.devDependencies,
            ...existingPkg.devDependencies
          }
        };
        fs.writeFile(pkgOutputPath, JSON.stringify(mergedPkg, null, 2));
      });

      console.log('✅ 配置文件生成成功！请执行以下命令安装依赖：');
      console.log('   pnpm install');
    } catch (err) {
      console.error('❌ 初始化失败：', err.message);
    }
  });

// 解析命令行参数
program.parse(process.argv);