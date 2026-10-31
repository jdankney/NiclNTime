# NiclNTime — Nicotine Impact Visualizer

> **A private, browser-based tool that turns vaping and cigarette use into a clear picture of nicotine exposure, money spent and time lost.**

[![CI](https://github.com/j4mes/NiclNTime/actions/workflows/ci.yml/badge.svg)](https://github.com/j4mes/NiclNTime/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-22d3ee.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org)

NiclNTime is an educational web app for anyone curious about what their nicotine habit costs — in health exposure, money and time. Enter vaping and/or cigarette use, then explore a visual dashboard and compare what changes if you cut down or quit.

**No account. No backend. No tracking. Your inputs stay in your browser.**

---

## Preview

| Dashboard | What-if scenarios |
| --- | --- |
| Relative risk gauge, animated respiratory view, financial breakdown and time-impact widgets. | Side-by-side scenarios for cutting down, quitting one habit, or quitting entirely. |

> Add a screenshot or short GIF here before sharing widely. The app is fully responsive and works on mobile, tablet and desktop.

---

## Features

### Understand your exposure
- **Nicotine load** — absorbed mg/day based on device type, e-liquid strength, volume or cigarette yields.
- **Chemical exposure** — estimated tar and carbon monoxide for cigarettes.
- **Respiratory volume** — daily and yearly inhaled aerosol/smoke estimates with an animated lung visual.
- **Cardiovascular estimates** — rough heart-rate and blood-pressure impact.
- **Relative risk score** — a transparent 0–100 composite with a factor-by-factor breakdown.
- **Life-lost estimate** — based on the widely cited ~11 minutes per cigarette-equivalent.

### Understand the cost
- **Daily → lifetime spending** with 40+ currencies.
- **Investment opportunity cost** — hypothetical 7% return over 10, 20 and 30 years.
- **Alternative purchases** — what your projected spending could buy instead.
- **What-if savings** — see potential savings from reducing or quitting.

### Understand the time
- Daily and yearly time consumed.
- Activity equivalencies: work weeks, films, books, workouts, sleep.
- Animated timeline and estimated life lost.
- Live counters so the numbers feel tangible.

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
git clone https://github.com/j4mes/NiclNTime.git
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

## Supported device types

| Device | Absorption estimate | Aerosol per puff* |
| --- | ---: | ---: |
| Disposable | 30% | 45 mL |
| Pod system | 40% | 55 mL |
| Mod / tank | 25% | 100 mL |
| Geek Bar / Elf Bar / Lost Mary | 45% | 50 mL |
| Fogger / cloud chaser | 20% | 150 mL |
| Pod mod | 35% | 70 mL |
| Squonk / bottom-feeder | 22% | 110 mL |
| AIO | 30% | 65 mL |
| Cigalike | 15% | 30 mL |

\* Illustrative population averages used for communication, not clinical measurement.

### Supported cigarette strengths

Light/ultra-light, regular and full-flavor, using typical published nicotine, tar and carbon monoxide yields.

---

## Calculation notes

The engine lives in [`niclntime/src/lib/calculations.ts`](niclntime/src/lib/calculations.ts) and is made of pure, defensive functions.

- Inputs are clamped to sensible ranges; unknown values from links or storage cannot produce `NaN` or `Infinity`.
- The risk score is a **weighted composite created for this project**, not a validated clinical calculator.
- “Lifetime” cost projects current spending until age 80, with a one-year minimum projection.
- Vaping life-lost estimates convert absorbed nicotine into cigarette-equivalents. That is a rough communication aid, not a medical prediction.
- One cigarette is commonly estimated to cost around **11 minutes of life** (BMJ, 2000). Individual outcomes vary widely.

See the in-app **“How the numbers are estimated”** section for methodology and public-health sources.

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

[MIT](LICENSE) © NiclNTime contributors.

---

## Disclaimer

> **This application is for educational and awareness purposes only. It does not constitute medical advice, diagnosis, or treatment. All calculations are estimates based on population-level averages and may not reflect individual health outcomes. Consult a qualified healthcare professional for personalized guidance. If you are in immediate danger, contact local emergency services.**

**If you want help quitting:** [Smokefree.gov](https://smokefree.gov) · **1-800-QUIT-NOW** (US) · [This Is Quitting](https://truthinitiative.org/thisisquitting) · [CDC quit resources](https://www.cdc.gov/tobacco/quit_smoking)
