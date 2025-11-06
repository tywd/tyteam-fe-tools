import { Command } from 'commander';
import { execSync } from 'child_process';

const lintCommand = new Command('lint');

lintCommand
  .command('fix [dir]')
  .description('一键修复 ESLint 和 Stylelint 问题（默认修复整个项目）')
  .action((dir = '.') => {
    try {
      execSync(`npx eslint ${dir} --fix`, { stdio: 'inherit' });
      try {
        execSync(`npx stylelint "${dir}/**/*.{css,scss,vue}" --fix`, { stdio: 'inherit' });
      } catch (_) {
        // 未集成 Stylelint 时忽略
      }
      console.log('\n✅ 修复完成！');
    } catch (e) {
      console.log('\n❌ 部分问题需手动修复，请查看上述报错信息');
    }
  });

export default lintCommand;


