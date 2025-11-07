// 导入 commander 库用于创建命令行命令
import { Command } from 'commander';
// 导入 npm-registry-client 用于查询 npm 包信息
import Client from 'npm-registry-client';
// 导入文件系统模块用于读取本地包信息
import fs from 'fs/promises';
// 导入路径处理模块
import path from 'path';
// 导入文件 URL 处理模块
import { fileURLToPath } from 'url';

// 解决 ES 模块中 __dirname 问题
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 创建 npm registry 客户端实例
const client = new Client({});
// 设置 npm registry 地址
const registry = 'https://registry.npmjs.org/';
// 定义需要检查更新的核心包列表
const corePackages = [
  '@tyteam/team-project-cli'
];

/**
 * 比较版本号的简单实现
 * @param {string} local - 本地版本号
 * @param {string} latest - 最新版本号
 * @returns {boolean} - 如果本地版本落后于最新版本则返回 true，否则返回 false
 */
function compareVersions(local, latest) {
  if (local === '未安装') return false;
  
  // 将版本号字符串分割为数字数组进行比较
  const localParts = local.split('.').map(Number);
  const latestParts = latest.split('.').map(Number);
  
  // 逐个比较版本号的每个部分
  for (let i = 0; i < Math.max(localParts.length, latestParts.length); i++) {
    const localPart = localParts[i] || 0;
    const latestPart = latestParts[i] || 0;
    
    if (localPart < latestPart) return true;
    if (localPart > latestPart) return false;
  }
  
  return false;
}

/**
 * 获取本地包版本号
 * @param {string} pkg - 包名
 * @returns {Promise<string>} - 返回本地包版本号或'未安装'
 */
async function getLocalVersion(pkg) {
  try {
    // 构造 package.json 文件路径
    const pkgJsonPath = path.join(process.cwd(), 'node_modules', pkg, 'package.json');
    // 读取并解析 package.json 文件
    const content = await fs.readFile(pkgJsonPath, 'utf8');
    return JSON.parse(content).version;
  } catch (_) {
    // 如果读取失败，说明包未安装
    return '未安装';
  }
}

// 获取 CLI 工具的本地版本
async function getCLIVersion() {
  try {
    const pkgJsonPath = path.join(__dirname, '../../package.json');
    const content = await fs.readFile(pkgJsonPath, 'utf8');
    return JSON.parse(content).version;
  } catch (_) {
    return '未知';
  }
}

// 创建 check-update 命令实例
const checkUpdateCommand = new Command('check-update')
  .description('检测 CLI 工具的最新版本')
  .action(async () => {
    console.log('🔍 正在检测最新版本...');
    
    // 获取 CLI 工具的本地版本
    const localCLIVersion = await getCLIVersion();
    console.log(`\n@tyteam/team-project-cli：`);
    console.log(`  本地版本：${localCLIVersion}`);
    
    // 检查最新版本
    await new Promise((resolve) => {
      // 查询 npm registry 获取包信息
      client.get(`${registry}@tyteam/team-project-cli`, {}, (err, data) => {
        if (err) {
          // 如果查询失败，输出错误信息
          console.log(`❌ 检测 @tyteam/team-project-cli 失败：${err.message}`);
          resolve();
          return;
        }
        
        // 获取最新版本号
        const latestVersion = data['dist-tags'].latest;
        console.log(`  最新版本：${latestVersion}`);
        
        // 如果本地版本落后于最新版本，提示用户更新
        if (compareVersions(localCLIVersion, latestVersion)) {
          console.log(`  📌 可更新：npm install -g @tyteam/team-project-cli@latest`);
        }
        
        resolve();
      });
    });
  });

// 导出 check-update 命令，供主程序注册使用
export default checkUpdateCommand;