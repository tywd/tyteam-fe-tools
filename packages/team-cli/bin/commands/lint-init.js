import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

const lintInitCommand = new Command('lint')
  .command('init')
  .description('存量项目一键接入团队规范')
  .action(async () => {
    const cwd = process.cwd();
    const pkgPath = path.join(cwd, 'package.json');
    const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));

    const { projectType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'projectType',
        message: '请选择项目类型',
        choices: ['Vue3', '其他']
      }
    ]);

    const eslintConfig =
      projectType === 'Vue3' ? '@tyteam/eslint-config-vue3' : '@tyteam/eslint-config-base';
    console.log(`📦 正在安装规范包：${eslintConfig}、@tyteam/stylelint-config`);
    execSync(`pnpm add ${eslintConfig} @tyteam/stylelint-config eslint stylelint -D`, {
      stdio: 'inherit'
    });

    await fs.writeFile(
      path.join(cwd, 'eslint.config.js'),
      `import tyteamConfig from "${eslintConfig}"; export default [...tyteamConfig];`
    );
    await fs.writeFile(
      path.join(cwd, 'stylelint.config.js'),
      `import tyteamConfig from "@tyteam/stylelint-config"; export default [...tyteamConfig];`
    );

    pkg.scripts = {
      ...pkg.scripts,
      lint: 'eslint . && stylelint ./**/*.{css,scss,vue}',
      'lint:fix': 'team-cli lint fix'
    };
    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('✅ 存量项目规范接入完成！');
  });

export default lintInitCommand;


