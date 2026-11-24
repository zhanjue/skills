#!/usr/bin/env node
/**
 * Skill 脚手架生成与分层健康度审计工具
 *
 * 用法：
 *   1. 初始化新 Skill 框架：
 *      node scripts/scaffold-skill.js --init <skill-name> --target <目标父目录> [--with-refs] [--with-scripts] [--with-assets]
 *
 *   2. 审计现有 Skill 是否存在臃肿或“打补丁式旧规则残留”：
 *      node scripts/scaffold-skill.js --audit <skill目录路径>
 */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const opts = {
    init: null,
    target: process.cwd(),
    withRefs: false,
    withScripts: false,
    withAssets: false,
    audit: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--init') opts.init = argv[++i];
    else if (a === '--target') opts.target = argv[++i];
    else if (a === '--with-refs') opts.withRefs = true;
    else if (a === '--with-scripts') opts.withScripts = true;
    else if (a === '--with-assets') opts.withAssets = true;
    else if (a === '--audit') opts.audit = argv[++i];
  }
  return opts;
}

function initSkill(opts) {
  const skillDir = path.resolve(opts.target, opts.init);
  if (fs.existsSync(skillDir)) {
    console.error(`[错误] 目标目录已存在: ${skillDir}`);
    process.exit(1);
  }

  fs.mkdirSync(skillDir, { recursive: true });
  if (opts.withRefs) fs.mkdirSync(path.join(skillDir, 'references'), { recursive: true });
  if (opts.withScripts) fs.mkdirSync(path.join(skillDir, 'scripts'), { recursive: true });
  if (opts.withAssets) fs.mkdirSync(path.join(skillDir, 'assets'), { recursive: true });

  const tplPath = path.resolve(__dirname, '../assets/SKILL-template.md');
  let content = fs.existsSync(tplPath)
    ? fs.readFileSync(tplPath, 'utf8')
    : `---\nname: ${opts.init}\ndescription: 请填写触发条件与核心用途\n---\n\n# ${opts.init}\n`;

  content = content.replace(/\{\{SKILL_NAME\}\}/g, opts.init);
  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content, 'utf8');

  console.log(`[成功] 已生成 Skill 基础框架: ${skillDir}`);
  console.log(`  - SKILL.md`);
  if (opts.withRefs) console.log(`  - references/`);
  if (opts.withScripts) console.log(`  - scripts/`);
  if (opts.withAssets) console.log(`  - assets/`);
}

function auditSkill(targetDir) {
  const skillMd = path.join(path.resolve(targetDir), 'SKILL.md');
  if (!fs.existsSync(skillMd)) {
    console.error(`[错误] 未找到 SKILL.md: ${skillMd}`);
    process.exit(1);
  }

  const text = fs.readFileSync(skillMd, 'utf8');
  const lines = text.split(/\r?\n/);
  const warnings = [];

  if (lines.length > 220) {
    warnings.push(
      `SKILL.md 当前共 ${lines.length} 行（建议 ≤ 200 行）。请将详细案例、长规则下沉到 references/，模板放入 assets/，代码逻辑放入 scripts/。`
    );
  }

  const patchPatterns = [
    /^(?!.*[“"「]).*不要再使用(之前|以前|上面|上述)/,
    /^(?!.*[“"「]).*(旧版本|之前版本)(已)?作废/,
    /^(?!.*[“"「]).*废弃(上述|以前|之前)规则/,
  ];

  lines.forEach((line, idx) => {
    for (const pat of patchPatterns) {
      if (pat.test(line)) {
        warnings.push(
          `第 ${idx + 1} 行疑似存在“打补丁式旧规则残留”(${pat})：「${line.trim()}」——建议直接删除旧规则，用新规则原地替换。`
        );
      }
    }
  });

  console.log(`=== Skill 健康度审计: ${skillMd} ===`);
  console.log(`总行数: ${lines.length}`);
  if (!warnings.length) {
    console.log(`✅ 通过：结构精简，未检测到历史补丁堆砌痕迹。`);
  } else {
    console.log(`⚠️ 发现 ${warnings.length} 项待优化项：`);
    warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.init) {
    initSkill(opts);
  } else if (opts.audit) {
    auditSkill(opts.audit);
  } else {
    console.log(`用法:
  node scripts/scaffold-skill.js --init <skill-name> [--target <dir>] [--with-refs] [--with-scripts] [--with-assets]
  node scripts/scaffold-skill.js --audit <skill-dir>`);
  }
}

main();
