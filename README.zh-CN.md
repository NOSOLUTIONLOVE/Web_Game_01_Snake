<div align="center">

# 🐍 Snake Web

> 一款基于现代 Web 技术栈打造的精品贪吃蛇游戏，融合经典玩法与创新设计，展现前端工程化与游戏开发的深度结合。

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Web_Game_01_Snake-181717?style=for-the-badge&logo=github)](https://github.com/NOSOLUTIONLOVE/Web_Game_01_Snake)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com)

**[English](README.md)** · **[中文](#)**

<br />

[在线体验](#-在线体验) · [项目亮点](#-项目亮点) · [快速开始](#-快速开始) · [技术架构](#-技术架构) · [游戏特性](#-游戏特性) · [操作指南](#-操作指南) · [项目结构](#-项目结构) · [性能优化](#-性能优化) · [开发历程](#-开发历程)

</div>

---

## 🌟 项目概述

**Snake Web** 是一款完全基于现代 Web 技术开发的贪吃蛇游戏，作为 **Web_Game** 系列的首款作品，它不仅是对经典游戏的致敬，更是一次前端工程化实践的深度探索。

### 为什么开发这个项目？

1. **技术验证**：验证 React + TypeScript + Canvas 2D 在游戏开发场景下的最佳实践
2. **工程化探索**：探索如何将游戏逻辑与 UI 层解耦，实现可维护、可扩展的架构
3. **性能优化实践**：实践 DPR 高清渲染、离屏 Canvas 缓存、固定时间步长等游戏开发核心技术
4. **现代 UI 设计**：将 shadcn/ui 设计系统引入游戏开发，打造现代化、可访问的游戏界面

### 项目定位

- **技术栈展示**：React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3 + shadcn/ui
- **架构示范**：三层分离架构（UI 层 ↔ 状态层 ↔ 游戏层），游戏逻辑完全框架无关
- **性能标杆**：60fps 稳定帧率，Retina 高清渲染，零素材音效系统
- **可访问性优先**：ARIA live 播报、键盘导航、屏幕阅读器支持

---

## 🎮 在线体验

**Live Demo**: [https://snake-web.vercel.app](https://snake-web.vercel.app)

> 💡 提示：支持桌面端键盘操作和移动端触屏滑动，推荐在桌面端获得最佳体验。

---

## ✨ 项目亮点

### 🏗️ 工程化架构

- **三层分离设计**：UI 层（React）负责渲染与交互，状态层（Zustand）管理全局状态，游戏层（纯 TypeScript 类）实现核心逻辑，完全解耦
- **框架无关的游戏引擎**：GameEngine 不依赖 React/DOM，可独立运行，便于测试与移植
- **类型安全**：TypeScript strict 模式 + Zod schema 运行时校验，从编译到运行全链路保障
- **模块化设计**：20+ 个独立模块，职责单一，易于维护和扩展

### 🎨 现代 UI/UX

- **设计系统**：基于 shadcn/ui 构建统一的组件库，包括 Button、Dialog、Badge、Switch 等
- **三套主题**：暗黑紫（默认）、霓虹绿、经典黑白，CSS 变量驱动，即时切换
- **微交互动效**：Framer Motion 驱动的流畅过渡，分数弹跳、新纪录徽章、死亡闪烁等
- **响应式设计**：Canvas 根据容器宽度自适应，移动端完美适配

### ⚡ 性能优化

- **DPR 高清渲染**：自动检测 devicePixelRatio，Retina 屏幕锐利无模糊
- **离屏 Canvas 缓存**：网格背景仅绘制一次，后续通过 drawImage 复用，减少 80% 渲染开销
- **固定时间步长**：60Hz 逻辑更新与渲染解耦，保证不同设备上游戏体验一致
- **后台暂停**：标签页隐藏时自动冻结游戏循环，节省 CPU/电池

### 🎵 零素材音效

- **Web Audio API 合成**：所有音效通过 Oscillator 实时合成，无需加载外部音频文件
- **四种音效**：吃食物（明亮上扬）、死亡（低沉下行）、暂停切换（柔和 click）、新纪录（C-E-G 琶音）
- **音量控制**：0-100 级音量调节，映射到 gain 0-0.3，避免爆音

### ♿ 可访问性

- **ARIA live 播报**：分数变化时自动通知屏幕阅读器
- **键盘导航**：所有交互元素支持 Tab 键导航与 Enter/Space 触发
- **aria-label**：图标按钮均配备语义化标签
- **语义化 HTML**：使用 Dialog、Button、Switch 等原生语义组件

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆仓库
git clone git@github.com:NOSOLUTIONLOVE/Web_Game_01_Snake.git
cd Web_Game_01_Snake/snake

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

### 部署

项目已配置 Vercel 自动部署，推送到 `main` 分支即可触发构建。自定义部署可参考 [vercel.json](snake/vercel.json)。

---

## 🏛️ 技术架构

### 三层分离架构

```
┌─────────────────────────────────────────────────────────┐
│  UI 层（React + shadcn/ui + Tailwind CSS）                │
│  职责：渲染游戏画面、处理用户输入、展示覆盖层              │
│  组件：GameCanvas / HUD / MainMenu / Overlays / Settings  │
└────────────────────┬────────────────────────────────────┘
                     │ 读写
┌────────────────────▼────────────────────────────────────┐
│  状态层（Zustand + persist middleware）                   │
│  职责：全局状态管理、持久化存储、版本迁移                  │
│  状态：phase / score / settings / statistics              │
└────────────────────┬────────────────────────────────────┘
                     │ 订阅 / 派发
┌────────────────────▼────────────────────────────────────┐
│  游戏层（纯 TypeScript 类，框架无关）                     │
│  职责：游戏逻辑、物理模拟、碰撞检测、音效播放              │
│  模块：GameEngine / Renderer / Input / Systems / Entities │
└─────────────────────────────────────────────────────────┘
```

### 核心模块职责

| 模块 | 职责 | 关键特性 |
|------|------|----------|
| **GameEngine** | 游戏主循环 + 状态机 | 60Hz 固定时间步长、六阶段状态机、配置驱动 |
| **Renderer** | Canvas 2D 渲染 | DPR 高清、离屏缓存、主题系统、震动反馈 |
| **Input** | 输入处理 | 键盘 + 触屏、观察者模式、防重复触发 |
| **Snake** | 蛇实体 | 方向缓冲、穿墙模式、插值进度、occupiedSet |
| **Food** | 食物系统 | 普通/金色双类型、超时消失、空白格随机 |
| **CollisionSystem** | 碰撞检测 | 墙壁/自身/障碍物、纯函数设计 |
| **ScoreSystem** | 计分系统 | 当前分/最高分、回调通知、难度递增 |
| **AudioSystem** | 音效系统 | Web Audio API、零素材合成、音量控制 |
| **ParticleSystem** | 粒子特效 | 360° 发射、重力模拟、生命衰减 |

### 状态机设计

游戏采用六阶段状态机，确保游戏流程清晰可控：

```
menu ──Space──▶ countdown ──3-2-1-GO──▶ playing ──P──▶ paused
  ▲                                          │            │
  │                                          │            │
  │                                          ▼            │
  └──────────Space────────── over ◀──dying──┴────────────┘
                                  (1s 死亡动画)
```

- **menu**: 主菜单，展示统计概览与操作说明
- **countdown**: 3-2-1-GO 倒计时，避免误操作
- **playing**: 游戏进行中，蛇移动、吃食物、碰撞检测
- **paused**: 暂停状态，冻结游戏循环
- **dying**: 死亡动画（1s 蛇身闪烁），提供视觉反馈
- **over**: 游戏结束，展示本局统计与新纪录

---

## 🎯 游戏特性

### 核心玩法

- **经典贪吃蛇**：控制蛇移动、吃食物、避免撞墙/撞自身
- **难度递增**：每吃一定数量食物加速，三档难度（简单/普通/困难）
- **特殊食物**：
  - 🍎 **普通食物**：+10 分，永久存在
  - ⭐ **金色食物**：+50 分，5 秒后消失，20% 概率出现，带倒计时进度环
- **障碍物模式**：困难难度随机生成 7 个墙体方块
- **穿墙模式**：可选开启，撞墙从对面穿出（类似《贪吃蛇大作战》）

### 个性化设置

| 设置项 | 选项 | 说明 |
|--------|------|------|
| **难度** | 简单 / 普通 / 困难 | 影响初始速度、加速系数、障碍物 |
| **主题** | 暗黑紫 / 霓虹绿 / 经典黑白 | CSS 变量驱动，即时切换 |
| **网格尺寸** | 小 (15×15) / 中 (20×20) / 大 (25×25) | 影响棋盘大小与单格尺寸 |
| **穿墙模式** | 开启 / 关闭 | 撞墙后从对侧穿出 |
| **音效** | 开启 / 关闭 | 游戏音效总开关 |
| **音量** | 0-100 | 精细调节音效大小 |

### 数据统计

游戏自动记录以下统计数据，持久化到 localStorage：

- **总游戏局数**：累计开始的游戏次数
- **总吃食物数**：累计吃到的食物总数
- **最长存活时间**：单局最长存活秒数
- **各难度最高分**：easy/normal/hard 三档独立记录

### 视觉反馈

- **粒子特效**：吃食物时发射 12 个粒子，360° 爆裂，带重力模拟
- **死亡动画**：蛇身逐节闪烁消散（100ms 间隔），提供死亡反馈
- **屏幕震动**：吃金色食物（6px, 300ms）与死亡（8px, 400ms）时触发
- **金色食物光环**：脉动光环 + 倒计时进度环，视觉强调限时奖励
- **蛇头插值**：蛇头位置在 prevBody 与 body 之间线性插值，移动更平滑
- **新纪录徽章**：破纪录时显示 "NEW RECORD!" 徽章 + 琶音音效

---

## 🎹 操作指南

### 键盘操作（桌面端）

| 按键 | 功能 | 适用阶段 |
|------|------|----------|
| ↑ / W | 向上移动 | playing |
| ↓ / S | 向下移动 | playing |
| ← / A | 向左移动 | playing |
| → / D | 向右移动 | playing |
| Space / Enter | 开始游戏 / 重新开始 | menu / over |
| P | 暂停 / 继续 | playing / paused |
| R | 重置游戏 | playing / over / dying |
| M | 静音切换 | 任意阶段 |

### 触屏操作（移动端）

- **滑动控制**：在 Canvas 区域滑动，根据滑动方向控制蛇移动
- **点击开始**：在 menu / over 阶段点击 Canvas 开始游戏
- **滑动阈值**：30px，避免误触发

### 防误操作设计

- **防 180° 反向**：不允许直接反向移动（如当前向右，不能立即向左）
- **方向缓冲**：快速连续输入时，只应用第一个有效方向
- **过滤 repeat 事件**：按住方向键不会持续触发，避免快速连击
- **开局倒计时**：3-2-1-GO 避免误操作

---

## 📁 项目结构

```
Web_Game_01_Snake/
├── snake/                         # 游戏主目录
│   ├── src/
│   │   ├── components/            # React UI 组件
│   │   │   ├── ui/                # shadcn/ui 基础组件
│   │   │   │   ├── badge.tsx      # 徽章（新纪录、难度标签）
│   │   │   │   ├── button.tsx     # 按钮（开始、设置、音效）
│   │   │   │   ├── card.tsx       # 卡片容器
│   │   │   │   ├── dialog.tsx     # 对话框（设置、游戏结束）
│   │   │   │   ├── separator.tsx  # 分隔线
│   │   │   │   └── switch.tsx     # 开关（穿墙、音效）
│   │   │   ├── GameCanvas.tsx     # Canvas 挂载 + Engine 生命周期
│   │   │   ├── HUD.tsx            # 顶部状态栏（分数、最高分、设置）
│   │   │   ├── MainMenu.tsx       # 主菜单（标题、开始按钮、统计）
│   │   │   ├── Countdown.tsx      # 开局倒计时（3-2-1-GO）
│   │   │   ├── PauseOverlay.tsx   # 暂停覆盖层
│   │   │   ├── GameOverModal.tsx  # 游戏结束弹窗（统计、重开）
│   │   │   ├── SettingsPanel.tsx  # 设置弹窗（难度/主题/网格/穿墙/音量）
│   │   │   ├── StatsCard.tsx      # 统计卡片（总游戏/食物/存活/最佳）
│   │   │   ├── ErrorBoundary.tsx  # 错误边界（防白屏）
│   │   │   ├── Overlays.tsx       # 覆盖层路由（根据 phase 显示）
│   │   │   └── Footer.tsx         # 页脚（版权信息）
│   │   │
│   │   ├── engine/                # 游戏层（框架无关）
│   │   │   ├── GameEngine.ts      # 主循环 + 状态机 + 配置驱动
│   │   │   ├── Renderer.ts        # Canvas 2D 渲染（DPR + 离屏缓存）
│   │   │   └── Input.ts           # 键盘 + 触屏输入处理
│   │   │
│   │   ├── entities/              # 游戏实体
│   │   │   ├── Snake.ts           # 蛇（方向缓冲、穿墙、插值进度）
│   │   │   ├── Food.ts            # 食物（普通/金色、超时消失）
│   │   │   └── Obstacle.ts        # 障碍物（困难难度生成）
│   │   │
│   │   ├── systems/               # 游戏系统
│   │   │   ├── CollisionSystem.ts # 碰撞检测（墙壁/自身/障碍物）
│   │   │   ├── ScoreSystem.ts     # 计分系统（当前分/最高分/难度递增）
│   │   │   ├── AudioSystem.ts     # 音效系统（Web Audio API 合成）
│   │   │   └── ParticleSystem.ts  # 粒子特效（发射/重力/生命衰减）
│   │   │
│   │   ├── store/                 # 状态层
│   │   │   └── useGameStore.ts    # Zustand store（持久化 + 版本迁移）
│   │   │
│   │   ├── config/                # 配置中心
│   │   │   └── index.ts           # 全局配置 + Zod schema + 类型定义
│   │   │
│   │   ├── lib/                   # 工具函数
│   │   │   ├── storage.ts         # localStorage 封装
│   │   │   └── utils.ts           # 通用工具（cn 等）
│   │   │
│   │   ├── App.tsx                # 根组件（主题同步）
│   │   ├── main.tsx               # 入口文件
│   │   └── index.css              # 全局样式 + CSS 变量主题
│   │
│   ├── docs/                      # 项目文档（6 篇）
│   │   ├── 01-项目立项.md          # 项目背景、目标、范围
│   │   ├── 02-需求拆分.md          # 功能需求、非功能需求
│   │   ├── 03-技术选型.md          # 技术栈选择、理由
│   │   ├── 04-项目架构.md          # 架构设计、模块职责
│   │   ├── 05-执行规划.md          # 开发计划、里程碑
│   │   └── 06-部署指南.md          # 部署流程、配置说明
│   │
│   ├── public/                    # 静态资源
│   │   ├── 404.html               # 404 页面
│   │   └── favicon.svg            # 网站图标
│   │
│   ├── vercel.json                # Vercel 部署配置
│   ├── vite.config.ts             # Vite 构建配置
│   ├── tailwind.config.ts         # Tailwind CSS 配置
│   ├── tsconfig.json              # TypeScript 配置
│   ├── .eslintrc.cjs              # ESLint 配置
│   ├── .prettierrc                # Prettier 配置
│   └── package.json               # 依赖与脚本
│
├── PRD-贪吃蛇.md                   # 产品需求文档
└── README.md                      # 项目说明（本文件）
```

---

## ⚡ 性能优化

### 渲染优化

| 优化项 | 实现方式 | 效果 |
|--------|----------|------|
| **DPR 高清渲染** | `canvas.width = cssSize * dpr`，`ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` | Retina 屏幕锐利无模糊 |
| **离屏 Canvas 缓存** | 网格背景绘制到离屏 Canvas，每帧 `drawImage` 复用 | 减少 80% 渲染开销 |
| **蛇头插值** | `prevBody[0]` 到 `body[0]` 线性插值，`progress = tickAccumulator / moveInterval` | 移动更平滑，无跳跃感 |
| **粒子系统优化** | 移除死亡粒子，`filter` 一次性清理 | 避免内存泄漏 |

### 逻辑优化

| 优化项 | 实现方式 | 效果 |
|--------|----------|------|
| **固定时间步长** | 60Hz 逻辑更新（`LOGIC_STEP = 16.67ms`），与渲染解耦 | 不同设备上体验一致 |
| **后台暂停** | `visibilitychange` 监听，隐藏时取消 RAF，显示时重置 `lastTime` | 节省 CPU/电池，避免大 delta 跳变 |
| **方向缓冲** | `nextDirection` 下一帧应用，防 180° 反向 | 避免快速输入导致的反向死亡 |
| **occupiedSet** | 蛇身/障碍物坐标转为 `Set<string>`，O(1) 查找 | 碰撞检测性能提升 |

### 构建优化

| 优化项 | 实现方式 | 效果 |
|--------|----------|------|
| **Tree Shaking** | Vite 默认开启，ESM 模块 | 移除未使用代码 |
| **代码分割** | 动态 `import()` 按需加载 | 首屏加载更快 |
| **资源哈希** | `assets/[name]-[hash].js` | 长期缓存，更新时失效 |
| **Gzip 压缩** | Vercel 自动开启 | JS ~132KB，CSS ~4.8KB |

### 实测性能指标

| 指标 | 数值 | 说明 |
|------|------|------|
| **帧率** | 60 fps | 稳定帧率，无掉帧 |
| **JS 体积（gzip）** | ~132 KB | 包含 React + Zustand + Framer Motion |
| **CSS 体积（gzip）** | ~4.8 KB | Tailwind CSS 按需生成 |
| **首屏加载** | < 1s | Vercel CDN 加速 |
| **模块数** | ~2000 | Vite 依赖预构建 |

---

## 🛠️ 技术栈详解

### 前端框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 18.3 | UI 框架，组件化开发 |
| **TypeScript** | 5.4 | 类型安全，strict 模式 |
| **Vite** | 5.2 | 构建工具，极速开发体验 |

### UI 与样式

| 技术 | 版本 | 用途 |
|------|------|------|
| **Tailwind CSS** | 3.4 | 原子化 CSS，快速构建 UI |
| **shadcn/ui** | - | 高质量组件库，基于 Radix UI |
| **Framer Motion** | 11.3 | 动效库，驱动微交互 |
| **Lucide React** | 0.408 | 图标库，现代化图标 |

### 状态管理

| 技术 | 版本 | 用途 |
|------|------|------|
| **Zustand** | 4.5 | 轻量状态管理，替代 Redux |
| **Zod** | 3.23 | Schema 校验，运行时类型检查 |

### 游戏开发

| 技术 | 用途 |
|------|------|
| **Canvas 2D** | 游戏画面渲染 |
| **Web Audio API** | 音效合成，零素材 |
| **requestAnimationFrame** | 游戏主循环 |

### 开发工具

| 工具 | 用途 |
|------|------|
| **ESLint** | 代码质量检查 |
| **Prettier** | 代码格式化 |
| **Vercel** | 自动部署，CDN 加速 |

---

## 📊 开发历程

### v1.0 - 基础版本

- 实现经典贪吃蛇玩法
- 基础 UI，无主题切换
- 简单音效

### v2.0 - 质量优先栈

- **架构重构**：引入三层分离架构（UI ↔ 状态 ↔ 游戏）
- **现代设计系统**：暗黑紫调 + 毛玻璃 + 圆角 + 阴影
- **组件化 UI**：React + shadcn/ui，统一组件库
- **微交互动效**：Framer Motion 驱动的流畅过渡
- **类型安全**：TypeScript strict + Zod schema

### v3.0 - 精品打磨（当前版本）

- **渲染升级**：DPR 高清渲染 + 离屏 Canvas 缓存
- **玩法深度**：金色食物、障碍物、穿墙模式、三档难度
- **视觉反馈**：粒子特效、死亡动画、屏幕震动
- **个性化**：三套主题、网格尺寸、音量调节
- **数据统计**：累计游戏/食物/存活时长/各难度最高分
- **可访问性**：ARIA live 播报 + 键盘导航 + aria-label
- **性能优化**：后台暂停、响应式 Canvas、ErrorBoundary

---

## 📖 项目文档

项目包含 6 篇详细文档，记录从立项到部署的完整历程：

- [01-项目立项](snake/docs/01-项目立项.md) - 项目背景、目标、范围
- [02-需求拆分](snake/docs/02-需求拆分.md) - 功能需求、非功能需求
- [03-技术选型](snake/docs/03-技术选型.md) - 技术栈选择、理由
- [04-项目架构](snake/docs/04-项目架构.md) - 架构设计、模块职责
- [05-执行规划](snake/docs/05-执行规划.md) - 开发计划、里程碑
- [06-部署指南](snake/docs/06-部署指南.md) - 部署流程、配置说明

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发规范

- **代码风格**：遵循 ESLint + Prettier 配置
- **提交信息**：使用 Conventional Commits（`feat:`, `fix:`, `docs:` 等）
- **类型检查**：提交前运行 `npm run type-check`
- **格式化**：运行 `npm run format` 统一代码风格

---

## 📄 License

本项目基于 [MIT License](LICENSE) 开源。

---

## 🙏 致谢

- **React** - 构建用户界面的 JavaScript 库
- **Vite** - 下一代前端构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **shadcn/ui** -  beautifully designed components built using Radix UI
- **Zustand** - 轻量级状态管理库
- **Framer Motion** - 生产就绪的动效库

---

<div align="center">

**如果这个项目对你有帮助，欢迎给个 ⭐ Star 支持一下！**

[GitHub](https://github.com/NOSOLUTIONLOVE/Web_Game_01_Snake) · [在线体验](https://snake-web.vercel.app) · [问题反馈](https://github.com/NOSOLUTIONLOVE/Web_Game_01_Snake/issues)

</div>
