import { Command } from 'commander';
import Client from 'npm-registry-client';
import fs from 'fs/promises';
import path from 'path';

const client = new Client({});
const registry = 'https://registry.npmjs.org/';
const corePackages = [
  '@tyteam/ty-cli',
  '@tyteam/eslint-config-base',
  '@tyteam/stylelint-config',
  '@tyteam/prettier-config'
];

async function getLocalVersion(pkg) {
  try {
    const pkgJsonPath = path.join(process.cwd(), 'node_modules', pkg, 'package.json');
    const content = await fs.readFile(pkgJsonPath, 'utf8');
    return JSON.parse(content).version;
  } catch (_) {
    return '未安装';
  }
}

const checkUpdateCommand = new Command('check-update')
  .description('检测 CLI 及关联规范包的最新版本')
  .action(async () => {
    console.log('🔍 正在检测最新版本...');
    for (const pkg of corePackages) {
      await new Promise((resolve) => {
        client.get(`${registry}${pkg}`, (err, data) => {
          (async () => {
            if (err) {
              console.log(`❌ 检测 ${pkg} 失败：${err.message}`);
              resolve();
              return;
            }
            const latestVersion = data['dist-tags'].latest;
            const localVersion = await getLocalVersion(pkg);
            console.log(`\n${pkg}：`);
            console.log(`  本地版本：${localVersion}`);
            console.log(`  最新版本：${latestVersion}`);
            if (localVersion !== '未安装' && localVersion !== latestVersion) {
              console.log(`  📌 可更新：pnpm add ${pkg}@latest -D`);
            }
            resolve();
          })();
        });
      });
    }
  });

export default checkUpdateCommand;


