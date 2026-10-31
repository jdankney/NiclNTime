# niclntime — Next.js application

This folder contains the NiclNTime web application. See the [root README](../README.md) for the full project overview and quick start.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

## Structure

- `src/app` — App Router shell, metadata and global styles.
- `src/components/inputs` — Vaping, cigarette and general settings forms.
- `src/components/visualizers` — Risk, respiratory, financial and time widgets.
- `src/components/ui` — Small reusable UI primitives.
- `src/lib/calculations.ts` — Pure calculation and formatting engine.
- `src/types/index.ts` — Types, device profiles, currencies and defaults.

## Privacy

Inputs are stored in the browser with `localStorage`. There is no backend, account system or analytics. Share links encode the report values directly in the URL.

## License

MIT — see [LICENSE](../LICENSE).
