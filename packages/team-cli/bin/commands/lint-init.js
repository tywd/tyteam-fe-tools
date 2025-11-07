// 导入 commander 库用于创建命令行命令
import { Command } from 'commander';
// 导入 inquirer 用于创建交互式命令行界面
import inquirer from 'inquirer';
// 导入文件系统模块用于文件操作
import fs from 'fs/promises';
// 导入路径处理模块
import path from 'path';
// 导入 child_process 模块用于执行系统命令
import { execSync } from 'child_process';

// 创建 lint 命令实例，并注册 init 子命令
const lintInitCommand = new Command('lint-init')
  .description('存量项目一键接入团队规范')
  .action(async () => {
    try {
      // 获取当前工作目录和 package.json 文件路径
      const cwd = process.cwd();
      const pkgPath = path.join(cwd, 'package.json');
      
      // 检查是否存在 package.json
      try {
        await fs.access(pkgPath);
      } catch (_) {
        console.log('❌ 未找到 package.json 文件，请确保在项目根目录执行此命令');
        return;
      }
      
      // 读取并解析 package.json 文件
      let pkg = {};
      try {
        const pkgContent = await fs.readFile(pkgPath, 'utf8');
        pkg = pkgContent ? JSON.parse(pkgContent) : {};
      } catch (e) {
        // 如果文件不存在或解析失败，使用空对象
        pkg = {};
      }

      // 使用 inquirer 询问用户项目类型
      const { projectType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'projectType',
          message: '请选择项目类型',
          choices: ['Vue3', '其他']
        }
      ]);

      // 根据项目类型确定 ESLint 配置包
      const eslintConfig =
        projectType === 'Vue3' ? '@tyteam/eslint-config-vue3' : '@tyteam/eslint-config-base';
      console.log(`📦 正在安装规范包：${eslintConfig}、@tyteam/stylelint-config`);
      
      // 安装 ESLint 和 Stylelint 相关依赖
      try {
        execSync(`pnpm add ${eslintConfig} @tyteam/stylelint-config eslint stylelint -D`, {
          stdio: 'inherit'
        });
      } catch (e) {
        console.log('❌ 安装依赖失败，请确保已安装 pnpm 并能正常连接到 npm registry');
        return;
      }

      // 生成 ESLint 配置文件
      await fs.writeFile(
        path.join(cwd, 'eslint.config.js'),
        `import tyteamConfig from "${eslintConfig}"; export default [...tyteamConfig];`
      );
      
      // 生成 Stylelint 配置文件
      await fs.writeFile(
        path.join(cwd, 'stylelint.config.js'),
        `import tyteamConfig from "@tyteam/stylelint-config"; export default [...tyteamConfig];`
      );

      // 更新 package.json 中的脚本配置
      pkg.scripts = {
        ...pkg.scripts,
        lint: 'eslint . && stylelint ./**/*.{css,scss,vue}',
        'lint:fix': 'team-cli lint fix'
      };
      
      // 写入更新后的 package.json 文件
      await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));
      console.log('✅ 存量项目规范接入完成！');
    } catch (e) {
      // 如果执行过程中出现错误，输出错误信息
      console.log(`❌ 执行过程中发生错误：${e.message}`);
    }
  });

// 导出 lint init 命令，供主程序注册使用
export default lintInitCommand;