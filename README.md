# Nicotine Impact Visualizer

> **Educational tool for visualizing the physiological and financial impact of nicotine consumption (vaping and cigarettes).**

---

## 🎯 Project Overview

This monorepo contains the complete Nicotine Impact Visualizer project - an interactive web application that transforms abstract nicotine usage numbers into concrete, visual data about health risks and long-term financial consequences.

## 📁 Repository Structure

```
NiclNTime/
├── PLAN.md                    # Project specification & implementation phases
├── README.md                  # This file
├── .gitmodules               # Submodule configuration
└── niclntime/                # → Submodule: Next.js application
    ├── src/
    │   ├── app/              # Next.js App Router pages
    │   ├── components/       # React components (inputs, visualizers, UI)
    │   ├── lib/              # Calculation engine
    │   └── types/            # TypeScript definitions
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm 10+

### Installation

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/j4mes/NiclNTime.git
cd NiclNTime

# Or if already cloned without submodules
git submodule update --init --recursive

# Install dependencies
cd niclntime
npm install

# Development server
npm run dev        # http://localhost:3000

# Production build
npm run build
npm run start      # http://localhost:3000
```

## 🧩 Submodule: niclntime-module

The actual application lives in the `niclntime/` submodule, which tracks the separate repository:
- **Repository**: `https://github.com/j4mes/niclntime-module.git`
- **Branch**: `main`

### Working with the Submodule

```bash
# Pull latest changes from submodule remote
cd niclntime
git pull origin main

# Commit submodule updates in root repo
cd ..
git add niclntime
git commit -m "Update niclntime submodule to latest"
git push

# Make changes inside submodule
cd niclntime
# ... edit files ...
git commit -am "Your changes"
git push origin main
cd ..
git add niclntime
git commit -m "Bump submodule"
git push
```

## 📋 Features Implemented

### Phase 1: Data Modeling & Logic (MVP) ✅
- **Vaping Module**: Hits/day, 9 device types, nicotine concentration, volume/day
- **Cigarette Module**: Cigarettes/day, 3 strength types
- **Calculation Engine**: Nicotine load, chemical exposure, respiratory volume, cardiovascular impact, financial projections, time tracking, life-lost estimates, risk scoring

### Phase 2: Visual Development ✅
- **Risk Gauge**: Speedometer-style composite risk score with factor breakdown
- **Lungs Visualizer**: Animated SVG lungs with particle effects
- **Wallet Visualizer**: Real-time cost counter + investment projections + alternative purchases
- **Clock Visualizer**: Time donut charts + activity equivalencies + life lost

### Phase 3: Refinement & UX ✅
- **Three-tab Interface**: Inputs → Dashboard → What-If Scenarios
- **Dark Theme**: Medical/impactful aesthetic with cyan/amber/purple accents
- **What-If Scenarios**: 50% reduction, quit vaping, quit smoking, quit entirely
- **Resource Links**: 6 quit-smoking/vaping resources
- **Prominent Disclaimer**: Educational use only, not medical advice

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Visualization | Native SVG + CSS animations |
| Package Manager | npm |

## 📊 Supported Device Types (Vaping)

| Type | Absorption | Aerosol/Puff | Examples |
|------|------------|--------------|----------|
| Disposable | 30% | 45mL | Standard disposables |
| Pod System | 40% | 55mL | JUUL, Vuse, closed pods |
| Mod/Tank | 25% | 100mL | Sub-ohm, freebase |
| **Geek Bar / Elf Bar** | **45%** | **50mL** | **High-nic salt disposables** |
| **Fogger / Cloud Chaser** | **20%** | **150mL** | **High VG, low nic, huge clouds** |
| **Pod Mod** | **35%** | **70mL** | **Voopoo Drag, Smok Nord** |
| **Squonk** | **22%** | **110mL** | **Bottom-feeder drippers** |
| **AIO** | **30%** | **65mL** | **Billet Box, all-in-ones** |
| **Cigalike** | **15%** | **30mL** | **First-gen cigarette-style** |

## ⚠️ Disclaimer

> **This tool is for educational/awareness purposes only and does not constitute medical advice. Calculations are estimates based on statistical averages. Consult a healthcare professional for personalized medical guidance.**

## 📚 Resources for Quitting

- [Smokefree.gov](https://smokefree.gov) - Free evidence-based tools
- **1-800-QUIT-NOW** - Free telephone counseling (US)
- [This Is Quitting](https://truthinitiative.org/thisisquitting) - Text program for young adults
- [Nicotine Anonymous](https://nicotine-anonymous.org) - 12-step fellowship
- [CDC Quit Tips](https://www.cdc.gov/tobacco/quit_smoking) - Practical strategies
- [Quit Vaping Apps](https://www.cdc.gov/tobacco/quit_smoking/quitting_vaping/apps.html) - Mobile apps

## 📄 License

MIT License - See [LICENSE](LICENSE) for details (if applicable).

---

**Built with ❤️ for awareness and education**