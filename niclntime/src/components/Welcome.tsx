'use client';

import { Icon } from '@/components/ui/Icon';
import { Card, CardContent } from '@/components/ui/Card';

interface WelcomeProps {
  onStart: () => void;
  onDemo: () => void;
  onLearn: () => void;
}

const FEATURES = [
  {
    icon: 'shield' as const,
    title: 'Relative risk, explained',
    description: 'See which inputs drive your score — smoke, nicotine, inhaled vapor and more.',
    color: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    icon: 'wallet' as const,
    title: 'The real cost',
    description: 'Just tell us how long a device lasts and what you pay — we do the maths.',
    color: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  },
  {
    icon: 'clock' as const,
    title: 'Time you do not get back',
    description: 'Hours spent each year, plus the life expectancy smoking takes (≈20 min a cigarette).',
    color: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: 'lungs' as const,
    title: 'Make it visual',
    description: 'A clear, animated respiratory view replaces abstract numbers with something tangible.',
    color: 'text-purple-300 bg-purple-500/10 border-purple-500/20',
  },
];

export function Welcome({ onStart, onDemo, onLearn }: WelcomeProps) {
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 px-5 py-12 sm:px-10 sm:py-16 lg:px-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute right-1/3 top-0 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/[0.07] px-3.5 py-1.5 text-xs font-medium text-cyan-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            Private, browser-based impact visualizer
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            See what nicotine is{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              really costing you
            </span>
            .
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
            Geek Bar, Raz, JUUL, ZYN, cigarettes — or a mix. Pick what you use, say how long it lasts,
            and get a clear picture of nicotine, money and time. Then see what changes if you cut down or
            quit.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onStart}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-300 hover:shadow-cyan-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:w-auto"
            >
              Build my report
              <Icon name="arrow-right" size={18} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={onDemo}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 px-6 py-3 text-sm font-semibold text-zinc-200 transition-all hover:border-zinc-600 hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 sm:w-auto"
            >
              <Icon name="sparkles" size={17} className="text-cyan-300" />
              Try a sample report
            </button>
          </div>

          <button
            type="button"
            onClick={onLearn}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-zinc-400 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-cyan-300 hover:decoration-cyan-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          >
            <Icon name="info" size={14} />
            Or just learn what nicotine does to your brain and body
          </button>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="check" size={13} className="text-emerald-400" />
              No account
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="check" size={13} className="text-emerald-400" />
              Data stays in your browser
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="check" size={13} className="text-emerald-400" />
              Takes about a minute
            </span>
          </div>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <Card key={feature.title} variant="default" className="group hover:border-zinc-700">
            <CardContent className="p-5">
              <div className={`grid h-10 w-10 place-items-center rounded-xl border ${feature.color}`}>
                <Icon name={feature.icon} size={19} />
              </div>
              <h3 className="mt-4 font-semibold text-zinc-100">{feature.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Stat label="Products" value="Vapes, cigarettes, pouches" detail="Popular devices pre-filled — Geek Bar, Raz, Elf Bar, JUUL, ZYN…" />
        <Stat label="Currencies" value="40+ supported" detail="Enter costs in your local currency." />
        <Stat label="Scenarios" value="Cut down → quit" detail="Compare realistic changes side by side." />
      </div>

      <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
        <div className="flex items-start gap-3">
          <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-amber-300" />
          <p className="text-xs leading-relaxed text-amber-100/70">
            <strong className="text-amber-200">Educational tool, not medical advice.</strong> All figures
            are estimates based on published population averages. Individual health outcomes vary.
            Speak with a qualified healthcare professional for personal guidance.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
      <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">{label}</div>
      <div className="mt-1 text-sm font-semibold text-zinc-200">{value}</div>
      <div className="mt-1 text-[11px] text-zinc-500">{detail}</div>
    </div>
  );
}
