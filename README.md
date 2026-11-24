# Agent Skills 收藏清单

个人整理的 AI Agent Skills 分类索引，只保留**分类清单 + 同步脚本**，不把庞大的第三方源码直接塞进仓库。需要本地使用时，运行脚本按需浅克隆（`--depth 1`）或更新即可。

---

## 目录结构

```text
.
├── README.md            # 分类总览清单（本文件）
├── skills.json          # 结构化 Skill 清单配置（脚本数据源）
├── scripts/
│   ├── sync-skills.js   # Node.js 跨平台一键拉取/更新脚本（推荐，免 PS 执行策略限制）
│   └── sync-skills.ps1  # PowerShell 同步脚本
├── custom/              # 自研/沉淀的原创 Skill（直接纳入 Git 版本控制）
│   └── skill-creator/   # 创建与迭代 Skill 的元技能（SOP 工作说明书模式）
├── frontend/            # 前端与 UI 设计类 Skill（本地拉取目录，已加入 .gitignore）
├── design/              # 封面与视觉设计类 Skill（本地拉取目录，已加入 .gitignore）
└── ae/                  # AE 动效与 AI 剪辑类 Skill（本地拉取目录，已加入 .gitignore）
```

---

## 零、自研核心 Skill (`custom/`)

| 名称 | 路径 | 简介 |
|---|---|---|
| **skill-creator** | [`custom/skill-creator`](./custom/skill-creator/SKILL.md) | **创建 Skill 的元技能（SOP 工作说明书方法论）**：先梳理 SOP 再写 `SKILL.md`；支持「先跑通再沉淀」与「五要素搭框架+实测迭代」双模式；内置成熟工具三步精准移植、四层目录分离（`SKILL.md` / `references` / `scripts` / `assets`）与删旧替新健康度审计脚本 |

---

## 一、前端与 UI 设计 (`frontend/`)

| 名称 | 仓库 / 链接 | 简介 |
|---|---|---|
| **impeccable** | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 高质量前端与设计品味规范、审美与界面优化 Skill |
| **garden-skills** | [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills) | 包含 `web-design-engineer`、`beautiful-article`、`motion-showreel`、`web-video-presentation`、`gpt-image-2`、`kb-retriever` 等实用 Skill 合集 |
| **taste-skill** | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | 提升 AI 生成前端 UI 审美与交互质感的品味指南 Skill |
| **hallmark** | [Nutlope/hallmark](https://github.com/Nutlope/hallmark) | 前端设计质量评估与 UI 精修 Skill |
| **astryx** | [meta/astryx](https://github.com/meta/astryx) | Meta 开源插件与前端工程化 Skill |

---

## 二、封面与视觉设计 (`design/`)

| 名称 | 仓库 / 链接 | 简介 |
|---|---|---|
| **qiaomu-mondo-poster-design** | [joeseesun/qiaomu-mondo-poster-design](https://github.com/joeseesun/qiaomu-mondo-poster-design) | Mondo 风格海报与视频封面设计 Skill（含提示词参考与生成脚本） |

---

## 三、AE 动效与 AI 剪辑 (`ae/`)

| 名称 | 仓库 / 链接 | 简介 |
|---|---|---|
| **hyperframes** | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | HeyGen 开源的视频制作与动效框架（内置 `hyperframes`、`media-use`、`remotion-to-hyperframes`、`reverse-any-video`、`slideshow`、`style-sampling` 等 Skill） |
| **agent-video-pipeline** | [jimaofeishangtian-ai/agent-video-pipeline](https://github.com/jimaofeishangtian-ai/agent-video-pipeline) | ChatCut × HyperFrames × Seedance × Remotion 可编辑自动剪辑 Skill |
| **creator-resources** | [jimaofeishangtian-ai/creator-resources](https://github.com/jimaofeishangtian-ai/creator-resources) | 鸡毛灰上天分享资料：数字人、语义动效（`remotion-semantic-effects`）、四人圆桌（`life-decision-roundtable`）及工具教程 |
| **adu-motion-video** | [adunext/adu-motion-video](https://github.com/adunext/adu-motion-video) | 阿杜的 AI 剪辑 Skill，升级为 MotionGit `.motion` 开放格式，适合口播与知识讲解的代码级动画模板 |
| **motiontemplates-all** | [motiontemplates/all](https://github.com/motiontemplates/all) | MotionGit 模板合集：技术资料、素材要求、GitHub 地址与完整 Demo 视频 |
| **video-talkcraft** | [Vincentwei1021/video-talkcraft](https://github.com/Vincentwei1021/video-talkcraft) | 面向口播讲解视频的动效工作室 Skill：词级配音同步、109 套动效配方卡、反幻灯片镜头系统与 Remotion 渲染 |
| **video-shotcraft** | [Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) | 面向产品宣传片的 AI 视频 Skill：Remotion 渲染、124 套镜头配方卡、150 个动效预览、节拍同步、音效设计与剪映导出 |
| **Motion Array** | [motionarray.com](https://motionarray.com/) | 一站式视频与影视创作者素材平台（AE 模板、动效、音效、转场等参考资源） |

---

## 快速使用（同步脚本）

### 方式 1：Node.js（推荐，跨平台且不受 Windows 执行策略限制）

```bash
# 查看当前清单与本地状态
node scripts/sync-skills.js --list

# 拉取/更新全部 GitHub Skill 仓库（默认浅克隆 --depth 1）
node scripts/sync-skills.js

# 仅拉取/更新指定分类（frontend / design / ae）
node scripts/sync-skills.js --category ae

# 仅拉取/更新单个 Skill
node scripts/sync-skills.js --only impeccable
```

### 方式 2：PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File scripts/sync-skills.ps1
powershell -ExecutionPolicy Bypass -File scripts/sync-skills.ps1 -Category ae
powershell -ExecutionPolicy Bypass -File scripts/sync-skills.ps1 -Only hyperframes
```
