# NiclNTime — Nicotine Impact Visualizer

> **A private, browser-based tool that turns vapes (Geek Bar, Raz, Elf Bar, JUUL…), cigarettes and nicotine pouches (ZYN, on!, VELO) into a clear picture of nicotine intake, money spent and time lost.**

[![CI](https://github.com/jdankney/NiclNTime/actions/workflows/ci.yml/badge.svg)](https://github.com/jdankney/NiclNTime/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-22d3ee.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org)

NiclNTime is an educational web app for anyone curious about what their nicotine habit costs — in health exposure, money and time. Pick the products you use, say how long one lasts and what you pay, then explore a visual dashboard and compare what changes if you cut down or quit.

**No account. No backend. No tracking. Your inputs stay in your browser.**

---

## Preview

| Dashboard | What-if scenarios |
| --- | --- |
| Relative risk gauge, animated respiratory view, financial breakdown and time-impact widgets. | Side-by-side scenarios for cutting down, quitting one habit, or quitting entirely. |

The app is fully responsive and works on mobile, tablet and desktop. Screenshots can be added here once the public deployment is live.

---

## Features

### Built around what people actually use
- **Popular devices pre-filled** — Geek Bar Pulse / Pulse X, Raz DC25000, Elf Bar BC5000, Lost Mary MO5000, Breeze Pro, JUUL, Vuse Alto, NJOY Ace, UK/EU 600-puff pods, refillable pods and sub-ohm tanks.
- **Plain-language questions** — "How long does one device last you?" and "What do you pay per device?" instead of mL/day and price per mL.
- **Nicotine pouches** — ZYN, on!, VELO or any custom strength and can size.
- **Mix and match** — vaping, smoking and pouches in any combination.

### Understand your exposure
- **Nicotine absorbed** — mg/day and cigarette-equivalents, with an uncertainty range for vaping.
- **Smoke toxicants** — tar, carbon monoxide and pack-years for cigarettes.
- **Inhaled load** — smoke and vape aerosol shown separately (vapor is weighted far lower than smoke).
- **Heart rate** — estimated average daytime rise from nicotine.
- **Relative risk score** — a transparent 0–100 composite, weighted so smoking dominates.
- **Life expectancy** — ~20 minutes per cigarette (UCL, 2025). Not applied to vaping or pouches, where long-term data doesn't exist yet.

### Understand the cost
- **Daily → lifetime spending** with 40+ currencies.
- **Investment opportunity cost** — 7% a year after inflation, monthly contributions, over 10, 20 and 30 years.
- **Alternative purchases** — what your projected spending could buy instead.
- **What-if savings** — see potential savings from reducing or quitting.

### Understand the time
- Daily and yearly time consumed.
- Activity equivalencies: work weeks, films, books, workouts, sleep.
- Animated timeline and life expectancy lost to smoking.
- Live counters so the numbers feel tangible.

### Learn the science
- **"The science" tab** — what nicotine does to the brain (reward system, tolerance, withdrawal), heart, metabolism, pregnancy and lungs, and where smoking, vaping and pouches differ.
- **Under-25 section** — why a still-developing brain is more vulnerable, with a shortcut from the dashboard for younger users.
- **Every point labelled by evidence strength** (Established, Strong evidence, Association, Animal & lab) with numbered links to peer-reviewed studies and Surgeon General / National Academies reports.

### Built to be usable
- Fully responsive layout with mobile navigation.
- Dark, high-contrast medical/impact aesthetic.
- Keyboard navigable with visible focus states and semantic landmarks.
- Reduced-motion support.
- Shareable links, Markdown report export and local autosave.
- No sign-in, no analytics, no server-side storage.

---

## Quick start

### Prerequisites

- **Node.js 20.9+** (22 LTS recommended)
- **npm 10+**

### Run locally

```bash
git clone https://github.com/jdankney/NiclNTime.git
cd NiclNTime

# Install app dependencies
npm run setup

# Start the development server
npm run dev
```

Open **http://localhost:3000**.

### Production build

```bash
npm run check   # lint + type-check + production build
npm run start   # serve the production build
```

### Useful commands

| Command | What it does |
| --- | --- |
| `npm run setup` | Install dependencies in the app folder |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run check` | Lint, type-check and build |

---

## Project structure

```text
NiclNTime/
├── .github/workflows/ci.yml    # GitHub Actions: lint, type-check, build
├── LICENSE                     # MIT
├── README.md
├── package.json                # Convenience scripts that delegate to the app
└── niclntime/                  # Next.js application
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx        # App shell, tabs, persistence, share/export
    │   │   ├── layout.tsx      # Metadata + root layout
    │   │   ├── globals.css     # Design tokens, animations, print styles
    │   │   └── icon.svg        # App icon
    │   ├── components/
    │   │   ├── Welcome.tsx     # Landing / empty state
    │   │   ├── Methodology.tsx # Methodology + sources accordion
    │   │   ├── Science.tsx     # "The science" tab: evidence-graded facts + sources
    │   │   ├── inputs/         # Vaping, cigarette and general settings forms
    │   │   ├── visualizers/    # Risk gauge, lungs, wallet, clock, summary cards
    │   │   └── ui/             # Card, Input, Select, Slider, Toggle, Icon
    │   ├── lib/
    │   │   └── calculations.ts # Pure calculation + formatting engine
    │   └── types/
    │       └── index.ts        # Types, device data, currencies, defaults
    ├── package.json
    └── next.config.ts
```

---

## Supported products

### Vapes

| Category | Examples | Puff volume* | Real puffs per mL* |
| --- | --- | ---: | ---: |
| Disposable | Geek Bar, Raz, Elf Bar, Lost Mary, Breeze | 60 mL | ~200 |
| Pre-filled pod | JUUL, Vuse Alto, NJOY Ace, UK/EU 600-puff pods | 55 mL | ~250 |
| Refillable pod / AIO | Caliburn, XROS, Vinci + nic-salt bottle | 70 mL | ~150 |
| Sub-ohm tank / mod | Tanks and rebuildables + freebase bottle | 200 mL | ~40 |

**Nicotine absorbed:** ~55% of the nicotine in the liquid you use for **nicotine salts** and ~45% for **freebase** (plausible range 30–70% either way). Salts reach the blood faster with a higher, cigarette-like peak and give somewhat higher uptake at the same strength. Their bigger effect is making 35–59 mg/mL strengths smooth enough to vape, and strength is already in the maths, so the salt/freebase adjustment is kept small. Presets set the type automatically (disposables and pods → salt, sub-ohm tanks → freebase), and it can be changed under *Fine-tune*. Device category only affects inhaled volume, time spent and the suggested puff count.

\* Typical values from puff-topography studies. Manufacturer puff ratings (e.g. "25k puffs") are measured with short lab puffs, so the app works from liquid used instead.

### Cigarettes

"Light", regular and full-flavor, with ~0.9 / 1.0 / 1.2 mg nicotine absorbed per cigarette and ISO machine yields for tar and CO. Pack size 20 or 25.

### Nicotine pouches

Any mg strength and can size. ~50% of the labelled nicotine is assumed to be absorbed (ZYN releases ~56–59% during use).

---

## Calculation notes

The engine lives in [`niclntime/src/lib/calculations.ts`](niclntime/src/lib/calculations.ts) and is made of pure, defensive functions. Every constant is documented with its source in [`niclntime/src/types/index.ts`](niclntime/src/types/index.ts).

- Inputs are clamped to sensible ranges; unknown values from links or storage cannot produce `NaN` or `Infinity`. Data saved by older versions of the app (and old share links) is migrated automatically.
- **Life expectancy:** ~20 minutes per cigarette (Jackson, Jarvis & West, *Addiction* 2025), replacing the older 11-minute figure (Shaw et al., *BMJ* 2000). What-if scenarios compare life expectancy lost *per year* going forward.
- **Risk score:** smoke toxicants 45 · nicotine 15 · inhaled load 10 · heart 10 · years of use 10 · under-25 brain development 10. Smoking points rise steeply even at a few cigarettes a day (Hackshaw et al., *BMJ* 2018). This is a communication aid, not a validated clinical calculator.
- **Heart rate:** saturating curve reaching ~7 bpm at 20 mg/day and levelling off near 10 bpm, consistent with smokers' average daytime elevation.
- **Lifetime cost** projects current spending until age 80, with a one-year minimum.
- "What this could buy" reference prices are set in USD and scaled with approximate exchange rates; your own prices are never converted.

See the in-app **"How the numbers are estimated"** section for every assumption and source.

---

## Privacy

NiclNTime is intentionally local-first:

- Inputs are saved in `localStorage` on your device.
- Share links encode the values in the URL fragment/query; nothing is uploaded.
- The app has no backend, authentication, analytics or advertising SDKs.
- Exporting a report creates a local Markdown file.

---

## Deployment

### Vercel

1. Import the repository.
2. Set **Root Directory** to `niclntime`.
3. Framework preset: **Next.js**.
4. Build command: `npm run build`.
5. Install command: `npm ci`.

### Docker

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY niclntime/package.json niclntime/package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY niclntime/ ./
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

> If you use the standalone Docker target, add `output: 'standalone'` to `niclntime/next.config.ts`.

### Static export

The app is client-heavy and can be exported as static files if you do not need a Node server:

```ts
// niclntime/next.config.ts
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
};
```

---

## Contributing

Contributions that improve accessibility, accuracy, translations or usability are welcome.

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Run `npm run check`.
4. Open a pull request with a clear description and, for calculation changes, a source.

Please keep the tone supportive and non-judgmental. This project is for awareness and quitting support, not shaming users.

---

## License

[MIT](LICENSE) © James Ankney.

---

## Disclaimer

> **This application is for educational and awareness purposes only. It does not constitute medical advice, diagnosis, or treatment. All calculations are estimates based on population-level averages and may not reflect individual health outcomes. Consult a qualified healthcare professional for personalized guidance. If you are in immediate danger, contact local emergency services.**

**If you want help quitting:** [Smokefree.gov](https://smokefree.gov) · **1-800-QUIT-NOW** (US) · [This Is Quitting](https://truthinitiative.org/thisisquitting) · [CDC quit resources](https://www.cdc.gov/tobacco/quit_smoking)
