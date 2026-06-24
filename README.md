<div align="center">

# 🐍 Snake Web

> A premium Snake game built with modern web technologies, combining classic gameplay with innovative design to showcase the deep integration of frontend engineering and game development.

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Web_Game_01_Snake-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/NOSOLUTIONLOVE/Web_Game_01_Snake)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

**[English](README.md)** · **[中文](README.zh-CN.md)**

<br />

[Live Demo](#-live-demo) · [Highlights](#-highlights) · [Quick Start](#-quick-start) · [Architecture](#-architecture) · [Features](#-features) · [Controls](#-controls) · [Project Structure](#-project-structure) · [Performance](#-performance) · [Changelog](#-changelog)

</div>

---

## 🌟 Overview

**Snake Web** is a modern web-based Snake game, the first release in the **Web_Game** series. It's not just a tribute to the classic game, but a deep exploration of frontend engineering practices.

### Why This Project?

1. **Technical Validation**: Validate best practices for React + TypeScript + Canvas 2D in game development
2. **Engineering Exploration**: Explore how to decouple game logic from UI layer for maintainable, extensible architecture
3. **Performance Optimization**: Practice core game dev techniques like DPR rendering, offscreen Canvas caching, and fixed timestep
4. **Modern UI Design**: Bring shadcn/ui design system into game development for a modern, accessible interface

### Project Positioning

- **Tech Stack Showcase**: React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3 + shadcn/ui
- **Architecture Demo**: Three-layer separation (UI ↔ State ↔ Game), framework-agnostic game logic
- **Performance Benchmark**: 60fps stable, Retina HD rendering, zero-asset audio system
- **Accessibility First**: ARIA live announcements, keyboard navigation, screen reader support

---

## 🎮 Live Demo

**Live Demo**: [https://snake-web.vercel.app](https://snake-web.vercel.app)

> 💡 Tip: Supports desktop keyboard controls and mobile touch gestures. Desktop recommended for best experience.

---

## ✨ Highlights

### 🏗️ Engineering Architecture

- **Three-Layer Design**: UI layer (React) handles rendering & interaction, State layer (Zustand) manages global state, Game layer (pure TypeScript classes) implements core logic - fully decoupled
- **Framework-Agnostic Engine**: GameEngine runs independently without React/DOM, easy to test and port
- **Type Safety**: TypeScript strict mode + Zod schema runtime validation, full-chain protection from compile to runtime
- **Modular Design**: 20+ independent modules with single responsibility, easy to maintain and extend

### 🎨 Modern UI/UX

- **Design System**: Unified component library based on shadcn/ui, including Button, Dialog, Badge, Switch, etc.
- **Three Themes**: Dark Purple (default), Neon Green, Classic Black & White, CSS variable-driven instant switching
- **Micro-Interactions**: Framer Motion-powered smooth transitions, score bounce, new record badge, death flicker
- **Responsive Design**: Canvas adapts to container width, perfect mobile adaptation

### ⚡ Performance Optimization

- **DPR HD Rendering**: Auto-detect devicePixelRatio, crisp on Retina displays without blur
- **Offscreen Canvas Cache**: Grid background drawn once, reused via drawImage, 80% rendering overhead reduction
- **Fixed Timestep**: 60Hz logic updates decoupled from rendering, consistent experience across devices
- **Background Pause**: Auto-freeze game loop when tab hidden, save CPU/battery

### 🎵 Zero-Asset Audio

- **Web Audio API Synthesis**: All sounds synthesized in real-time via Oscillator, no external audio files
- **Four Sound Effects**: Eat food (bright ascending), death (low descending), pause toggle (soft click), new record (C-E-G arpeggio)
- **Volume Control**: 0-100 level adjustment, mapped to gain 0-0.3, prevent clipping

### ♿ Accessibility

- **ARIA Live Announcements**: Auto-notify screen readers on score changes
- **Keyboard Navigation**: All interactive elements support Tab navigation and Enter/Space activation
- **aria-label**: All icon buttons equipped with semantic labels
- **Semantic HTML**: Use native semantic components like Dialog, Button, Switch

---

## 🚀 Quick Start

### Requirements

- Node.js >= 18
- npm >= 9

### Installation & Running

```bash
# Clone repository
git clone git@github.com:NOSOLUTIONLOVE/Web_Game_01_Snake.git
cd Web_Game_01_Snake/snake

# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run type-check

# Production build
npm run build

# Preview build output
npm run preview
```

### Deployment

Project configured for Vercel auto-deployment. Push to `main` branch triggers build. See [vercel.json](snake/vercel.json) for custom deployment.

---

## 🏛️ Architecture

### Three-Layer Separation

```
┌─────────────────────────────────────────────────────────┐
│  UI Layer (React + shadcn/ui + Tailwind CSS)            │
│  Responsibility: Render game view, handle input,        │
│                  display overlays                        │
│  Components: GameCanvas / HUD / MainMenu / Overlays     │
└────────────────────┬────────────────────────────────────┘
                     │ read/write
┌────────────────────▼────────────────────────────────────┐
│  State Layer (Zustand + persist middleware)             │
│  Responsibility: Global state, persistence, migration   │
│  State: phase / score / settings / statistics           │
└────────────────────┬────────────────────────────────────┘
                     │ subscribe / dispatch
┌────────────────────▼────────────────────────────────────┐
│  Game Layer (Pure TypeScript classes, framework-agnostic)│
│  Responsibility: Game logic, physics, collision, audio  │
│  Modules: GameEngine / Renderer / Input / Systems       │
└─────────────────────────────────────────────────────────┘
```

### Core Modules

| Module | Responsibility | Key Features |
|--------|----------------|--------------|
| **GameEngine** | Main loop + State machine | 60Hz fixed timestep, 6-phase FSM, config-driven |
| **Renderer** | Canvas 2D rendering | DPR HD, offscreen cache, theme system, shake feedback |
| **Input** | Input handling | Keyboard + touch, observer pattern, debounce |
| **Snake** | Snake entity | Direction buffer, wall wrap, interpolation progress, occupiedSet |
| **Food** | Food system | Normal/golden types, timeout despawn, empty-cell random |
| **CollisionSystem** | Collision detection | Wall/self/obstacle, pure function design |
| **ScoreSystem** | Scoring system | Current/high score, callback notification, difficulty scaling |
| **AudioSystem** | Audio system | Web Audio API, zero-asset synthesis, volume control |
| **ParticleSystem** | Particle effects | 360° emission, gravity simulation, life decay |

### State Machine Design

Six-phase state machine ensures clear game flow control:

```
menu ──Space──▶ countdown ──3-2-1-GO──▶ playing ──P──▶ paused
  ▲                                          │            │
  │                                          │            │
  │                                          ▼            │
  └──────────Space────────── over ◀──dying──┴────────────┘
                                  (1s death animation)
```

- **menu**: Main menu, display stats overview and controls
- **countdown**: 3-2-1-GO countdown, prevent accidental input
- **playing**: Game in progress, snake moves, eats food, collision detection
- **paused**: Paused state, freeze game loop
- **dying**: Death animation (1s snake flicker), visual feedback
- **over**: Game over, display round stats and new records

---

## 🎯 Features

### Core Gameplay

- **Classic Snake**: Control snake movement, eat food, avoid walls/self
- **Progressive Difficulty**: Speed up after eating certain amount, three difficulty levels (Easy/Normal/Hard)
- **Special Food**:
  - 🍎 **Normal Food**: +10 points, permanent
  - ⭐ **Golden Food**: +50 points, despawns after 5s, 20% spawn rate, countdown progress ring
- **Obstacle Mode**: Hard difficulty randomly generates 7 wall blocks
- **Wall Wrap Mode**: Optional, wrap around when hitting wall (like Snake.io)

### Customization

| Setting | Options | Description |
|---------|---------|-------------|
| **Difficulty** | Easy / Normal / Hard | Affects initial speed, acceleration, obstacles |
| **Theme** | Dark Purple / Neon Green / Classic B&W | CSS variable-driven, instant switch |
| **Grid Size** | Small (15×15) / Medium (20×20) / Large (25×25) | Affects board size and cell size |
| **Wall Wrap** | On / Off | Wrap around when hitting wall |
| **Audio** | On / Off | Master audio toggle |
| **Volume** | 0-100 | Fine-grained volume control |

### Statistics

Game automatically records and persists to localStorage:

- **Total Games Played**: Cumulative game count
- **Total Food Eaten**: Cumulative food count
- **Longest Survival**: Single-round max survival seconds
- **Best Score Per Difficulty**: Separate records for easy/normal/hard

### Visual Feedback

- **Particle Effects**: Emit 12 particles on food eat, 360° burst with gravity
- **Death Animation**: Snake body flickers and fades (100ms interval)
- **Screen Shake**: Golden food (6px, 300ms) and death (8px, 400ms) trigger
- **Golden Food Halo**: Pulsing halo + countdown progress ring
- **Snake Head Interpolation**: Linear interpolation between prevBody and body, smoother movement
- **New Record Badge**: "NEW RECORD!" badge + arpeggio sound on high score

---

## 🎹 Controls

### Keyboard (Desktop)

| Key | Function | Applicable Phase |
|-----|----------|------------------|
| ↑ / W | Move Up | playing |
| ↓ / S | Move Down | playing |
| ← / A | Move Left | playing |
| → / D | Move Right | playing |
| Space / Enter | Start / Restart | menu / over |
| P | Pause / Resume | playing / paused |
| R | Reset Game | playing / over / dying |
| M | Toggle Mute | any phase |

### Touch (Mobile)

- **Swipe Control**: Swipe on Canvas to control snake direction
- **Tap to Start**: Tap Canvas in menu/over phase to start game
- **Swipe Threshold**: 30px to prevent accidental triggers

### Anti-Mistake Design

- **No 180° Reverse**: Cannot reverse direction immediately (e.g., cannot go left when going right)
- **Direction Buffer**: Only first valid direction applied on rapid input
- **Filter Repeat Events**: Holding direction key won't continuously trigger
- **Start Countdown**: 3-2-1-GO prevents accidental input

---

## 📁 Project Structure

```
Web_Game_01_Snake/
├── snake/                         # Game main directory
│   ├── src/
│   │   ├── components/            # React UI components
│   │   │   ├── ui/                # shadcn/ui base components
│   │   │   │   ├── badge.tsx      # Badge (new record, difficulty)
│   │   │   │   ├── button.tsx     # Button (start, settings, audio)
│   │   │   │   ├── card.tsx       # Card container
│   │   │   │   ├── dialog.tsx     # Dialog (settings, game over)
│   │   │   │   ├── separator.tsx  # Separator
│   │   │   │   └── switch.tsx     # Switch (wall wrap, audio)
│   │   │   ├── GameCanvas.tsx     # Canvas mount + Engine lifecycle
│   │   │   ├── HUD.tsx            # Top status bar (score, best, settings)
│   │   │   ├── MainMenu.tsx       # Main menu (title, start, stats)
│   │   │   ├── Countdown.tsx      # Start countdown (3-2-1-GO)
│   │   │   ├── PauseOverlay.tsx   # Pause overlay
│   │   │   ├── GameOverModal.tsx  # Game over modal (stats, restart)
│   │   │   ├── SettingsPanel.tsx  # Settings panel (difficulty/theme/grid/volume)
│   │   │   ├── StatsCard.tsx      # Stats card (games/food/survival/best)
│   │   │   ├── ErrorBoundary.tsx  # Error boundary (prevent white screen)
│   │   │   ├── Overlays.tsx       # Overlay router (display by phase)
│   │   │   └── Footer.tsx         # Footer (copyright)
│   │   │
│   │   ├── engine/                # Game layer (framework-agnostic)
│   │   │   ├── GameEngine.ts      # Main loop + state machine + config-driven
│   │   │   ├── Renderer.ts        # Canvas 2D rendering (DPR + offscreen cache)
│   │   │   └── Input.ts           # Keyboard + touch input handling
│   │   │
│   │   ├── entities/              # Game entities
│   │   │   ├── Snake.ts           # Snake (direction buffer, wall wrap, interpolation)
│   │   │   ├── Food.ts            # Food (normal/golden, timeout despawn)
│   │   │   └── Obstacle.ts        # Obstacle (hard difficulty generation)
│   │   │
│   │   ├── systems/               # Game systems
│   │   │   ├── CollisionSystem.ts # Collision detection (wall/self/obstacle)
│   │   │   ├── ScoreSystem.ts     # Scoring system (current/best, difficulty scaling)
│   │   │   ├── AudioSystem.ts     # Audio system (Web Audio API synthesis)
│   │   │   └── ParticleSystem.ts  # Particle effects (emission/gravity/life decay)
│   │   │
│   │   ├── store/                 # State layer
│   │   │   └── useGameStore.ts    # Zustand store (persistence + migration)
│   │   │
│   │   ├── config/                # Config center
│   │   │   └── index.ts           # Global config + Zod schema + type definitions
│   │   │
│   │   ├── lib/                   # Utilities
│   │   │   ├── storage.ts         # localStorage wrapper
│   │   │   └── utils.ts           # Common utilities (cn, etc.)
│   │   │
│   │   ├── App.tsx                # Root component (theme sync)
│   │   ├── main.tsx               # Entry file
│   │   └── index.css              # Global styles + CSS variable themes
│   │
│   ├── docs/                      # Project documentation (6 articles)
│   │   ├── 01-项目立项.md          # Project background, goals, scope
│   │   ├── 02-需求拆分.md          # Functional/non-functional requirements
│   │   ├── 03-技术选型.md          # Tech stack selection, rationale
│   │   ├── 04-项目架构.md          # Architecture design, module responsibilities
│   │   ├── 05-执行规划.md          # Development plan, milestones
│   │   └── 06-部署指南.md          # Deployment process, configuration
│   │
│   ├── public/                    # Static assets
│   │   ├── 404.html               # 404 page
│   │   └── favicon.svg            # Site icon
│   │
│   ├── vercel.json                # Vercel deployment config
│   ├── vite.config.ts             # Vite build config
│   ├── tailwind.config.ts         # Tailwind CSS config
│   ├── tsconfig.json              # TypeScript config
│   ├── .eslintrc.cjs              # ESLint config
│   ├── .prettierrc                # Prettier config
│   └── package.json               # Dependencies & scripts
│
├── PRD-贪吃蛇.md                   # Product requirements document
└── README.md                      # Project documentation (this file)
```

---

## ⚡ Performance

### Rendering Optimization

| Optimization | Implementation | Effect |
|--------------|----------------|--------|
| **DPR HD Rendering** | `canvas.width = cssSize * dpr`, `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` | Crisp on Retina displays |
| **Offscreen Canvas Cache** | Grid background drawn to offscreen Canvas, reused via `drawImage` each frame | 80% rendering overhead reduction |
| **Snake Head Interpolation** | Linear interpolation from `prevBody[0]` to `body[0]`, `progress = tickAccumulator / moveInterval` | Smoother movement, no jumping |
| **Particle System Optimization** | Remove dead particles, `filter` cleanup in one pass | Prevent memory leaks |

### Logic Optimization

| Optimization | Implementation | Effect |
|--------------|----------------|--------|
| **Fixed Timestep** | 60Hz logic updates (`LOGIC_STEP = 16.67ms`), decoupled from rendering | Consistent experience across devices |
| **Background Pause** | `visibilitychange` listener, cancel RAF when hidden, reset `lastTime` when visible | Save CPU/battery, prevent large delta jumps |
| **Direction Buffer** | `nextDirection` applied next frame, prevent 180° reverse | Prevent reverse death from rapid input |
| **occupiedSet** | Snake body/obstacle coordinates converted to `Set<string>`, O(1) lookup | Collision detection performance boost |

### Build Optimization

| Optimization | Implementation | Effect |
|--------------|----------------|--------|
| **Tree Shaking** | Vite enabled by default, ESM modules | Remove unused code |
| **Code Splitting** | Dynamic `import()` for on-demand loading | Faster initial load |
| **Asset Hashing** | `assets/[name]-[hash].js` | Long-term caching, invalidation on update |
| **Gzip Compression** | Vercel auto-enabled | JS ~132KB, CSS ~4.8KB |

### Measured Performance Metrics

| Metric | Value | Description |
|--------|-------|-------------|
| **Frame Rate** | 60 fps | Stable frame rate, no drops |
| **JS Size (gzip)** | ~132 KB | Includes React + Zustand + Framer Motion |
| **CSS Size (gzip)** | ~4.8 KB | Tailwind CSS generated on demand |
| **First Load** | < 1s | Vercel CDN acceleration |
| **Module Count** | ~2000 | Vite dependency pre-bundling |

---

## 🛠️ Tech Stack

### Frontend Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | UI framework, component-based development |
| **TypeScript** | 5.4 | Type safety, strict mode |
| **Vite** | 5.2 | Build tool,极速 development experience |

### UI & Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.4 | Atomic CSS, rapid UI building |
| **shadcn/ui** | - | High-quality component library, based on Radix UI |
| **Framer Motion** | 11.3 | Animation library, micro-interactions |
| **Lucide React** | 0.408 | Icon library, modern icons |

### State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | 4.5 | Lightweight state management, Redux alternative |
| **Zod** | 3.23 | Schema validation, runtime type checking |

### Game Development

| Technology | Purpose |
|------------|---------|
| **Canvas 2D** | Game rendering |
| **Web Audio API** | Audio synthesis, zero-asset |
| **requestAnimationFrame** | Game main loop |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code quality checking |
| **Prettier** | Code formatting |
| **Vercel** | Auto-deployment, CDN acceleration |

---

## 📊 Changelog

### v1.0 - Basic Version

- Implement classic Snake gameplay
- Basic UI, no theme switching
- Simple sound effects

### v2.0 - Quality-First Stack

- **Architecture Refactor**: Introduce three-layer separation (UI ↔ State ↔ Game)
- **Modern Design System**: Dark purple + glassmorphism + rounded corners + shadows
- **Componentized UI**: React + shadcn/ui, unified component library
- **Micro-Interactions**: Framer Motion-powered smooth transitions
- **Type Safety**: TypeScript strict + Zod schema

### v3.0 - Premium Polish (Current)

- **Rendering Upgrade**: DPR HD rendering + offscreen Canvas cache
- **Gameplay Depth**: Golden food, obstacles, wall wrap mode, three difficulty levels
- **Visual Feedback**: Particle effects, death animation, screen shake
- **Customization**: Three themes, grid sizes, volume control
- **Statistics**: Cumulative games/food/survival/best per difficulty
- **Accessibility**: ARIA live announcements + keyboard navigation + aria-label
- **Performance**: Background pause, responsive Canvas, ErrorBoundary

---

## 📖 Documentation

Project includes 6 detailed documents covering the complete journey from inception to deployment:

- [01-Project Inception](snake/docs/01-项目立项.md) - Background, goals, scope
- [02-Requirements Breakdown](snake/docs/02-需求拆分.md) - Functional/non-functional requirements
- [03-Tech Stack Selection](snake/docs/03-技术选型.md) - Technology choices, rationale
- [04-Architecture Design](snake/docs/04-项目架构.md) - Architecture, module responsibilities
- [05-Execution Plan](snake/docs/05-执行规划.md) - Development plan, milestones
- [06-Deployment Guide](snake/docs/06-部署指南.md) - Deployment process, configuration

---

## 🤝 Contributing

Issues and Pull Requests welcome!

### Development Standards

- **Code Style**: Follow ESLint + Prettier configuration
- **Commit Messages**: Use Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
- **Type Check**: Run `npm run type-check` before commit
- **Formatting**: Run `npm run format` for consistent code style

---

## 📄 License

This project is open-sourced under [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **React** - JavaScript library for building user interfaces
- **Vite** - Next generation frontend build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautifully designed components built using Radix UI
- **Zustand** - Lightweight state management library
- **Framer Motion** - Production-ready animation library

---

<div align="center">

**If this project helps you, please give it a ⭐ Star!**

[GitHub](https://github.com/NOSOLUTIONLOVE/Web_Game_01_Snake) · [Live Demo](https://snake-web.vercel.app) · [Issue Feedback](https://github.com/NOSOLUTIONLOVE/Web_Game_01_Snake/issues)

</div>
