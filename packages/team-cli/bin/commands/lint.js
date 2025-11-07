// 导入 commander 库用于创建命令行命令
import { Command } from 'commander';
// 导入 child_process 模块用于执行系统命令
import { execSync } from 'child_process';

// 创建 lint 命令实例
const lintCommand = new Command('lint');

// 注册 fix 子命令，用于一键修复代码问题
lintCommand
  .command('fix [dir]')
  .description('一键修复 ESLint 和 Stylelint 问题（默认修复整个项目）')
  .action((dir = '.') => {
    try {
      // 执行 ESLint 修复
      // 使用 npx 执行 eslint 命令，--fix 参数用于自动修复可修复的问题
      execSync(`npx eslint ${dir} --fix`, { stdio: 'inherit' });
      
      // 执行 Stylelint 修复（若项目已集成）
      // 使用 npx 执行 stylelint 命令，--fix 参数用于自动修复可修复的问题
      // 如果项目未集成 Stylelint，会抛出异常，但我们捕获并忽略它
      try {
        execSync(`npx stylelint "${dir}/**/*.{css,scss,vue}" --fix`, { stdio: 'inherit' });
      } catch (e) {
        /* 未集成 Stylelint 则忽略 */
      }
      
      console.log('\n✅ 修复完成！');
    } catch (e) {
      // 如果修复过程中出现错误，提示用户手动修复
      console.log('\n❌ 部分问题需手动修复，请查看上述报错信息');
    }
  });

// 导出 lint 命令，供主程序注册使用
export default lintCommand;