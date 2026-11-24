#!/usr/bin/env node
/**
 * 轻量级 Skill 仓库按需拉取/更新脚本
 * 用法：
 *   node scripts/sync-skills.js                 # 拉取或更新全部 GitHub Skill
 *   node scripts/sync-skills.js --list          # 查看清单及本地安装状态
 *   node scripts/sync-skills.js --category ae   # 仅同步指定分类 (frontend/design/ae)
 *   node scripts/sync-skills.js --only <name>   # 仅同步单个 Skill
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'skills.json');

function parseArgs(argv) {
  const opts = { list: false, category: null, only: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--list' || arg === '-l') opts.list = true;
    else if (arg === '--category' || arg === '-c') opts.category = argv[++i];
    else if (arg === '--only' || arg === '-o') opts.only = argv[++i];
    else if (arg === '--help' || arg === '-h') {
      console.log(`用法:
  node scripts/sync-skills.js                 拉取/更新全部 GitHub Skill
  node scripts/sync-skills.js --list          查看清单与本地状态
  node scripts/sync-skills.js --category ae   仅同步指定分类
  node scripts/sync-skills.js --only <name>   仅同步单个 Skill`);
      process.exit(0);
    }
  }
  return opts;
}

function runGit(args, cwd) {
  execFileSync('git', args, { cwd, stdio: 'inherit' });
}

function main() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`找不到配置文件: ${CONFIG_PATH}`);
    process.exit(1);
  }

  const opts = parseArgs(process.argv.slice(2));
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

  const categories = opts.category
    ? config.categories.filter(c => c.id === opts.category)
    : config.categories;

  if (!categories.length) {
    console.error(`未找到分类: ${opts.category}`);
    process.exit(1);
  }

  for (const cat of categories) {
    const catDir = path.join(ROOT, cat.id);
    const items = opts.only
      ? cat.items.filter(it => it.name === opts.only)
      : cat.items;

    if (!items.length) continue;

    console.log(`\n=== ${cat.name} (${cat.id}/) ===`);

    for (const item of items) {
      if (item.type !== 'github' || !item.repo) {
        console.log(`  [链接] ${item.name} -> ${item.url}`);
        continue;
      }

      const targetDir = path.join(catDir, item.name);
      const exists = fs.existsSync(path.join(targetDir, '.git'));

      if (opts.list) {
        const status = exists ? '已拉取' : '未拉取';
        console.log(`  [${status}] ${item.name} (${item.repo})`);
        continue;
      }

      fs.mkdirSync(catDir, { recursive: true });
      try {
        if (exists) {
          console.log(`-> 更新 ${item.name} (${item.repo})...`);
          runGit(['pull', '--ff-only'], targetDir);
        } else {
          console.log(`-> 浅克隆 ${item.name} (${item.repo})...`);
          runGit(['clone', '--depth', '1', `https://github.com/${item.repo}.git`, targetDir], ROOT);
        }
      } catch (err) {
        console.error(`  [失败] ${item.name}: ${err.message}`);
      }
    }
  }
}

main();
