'use client';

import { CalculatedMetrics, CurrencyCode } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { formatCurrency, formatNumber, RISK_FACTOR_WEIGHTS } from '@/lib/calculations';

interface RiskGaugeProps {
  metrics: CalculatedMetrics;
  currency: CurrencyCode;
}

const RISK_STYLES = {
  low: {
    text: 'text-emerald-400',
    stroke: '#34d399',
    badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    bar: 'bg-emerald-400',
    label: 'Low relative risk',
    description: 'Your current inputs sit in the lower band of this tool’s estimate.',
  },
  moderate: {
    text: 'text-amber-400',
    stroke: '#fbbf24',
    badge: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    bar: 'bg-amber-400',
    label: 'Moderate relative risk',
    description: 'There is meaningful daily exposure that is worth paying attention to.',
  },
  high: {
    text: 'text-orange-400',
    stroke: '#fb923c',
    badge: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
    bar: 'bg-orange-400',
    label: 'High relative risk',
    description: 'Several exposure factors are elevated. Small reductions can add up.',
  },
  critical: {
    text: 'text-red-400',
    stroke: '#f87171',
    badge: 'bg-red-500/10 border-red-500/30 text-red-300',
    bar: 'bg-red-400',
    label: 'Critical relative risk',
    description: 'This combination of exposures scores at the top of the tool’s range.',
  },
} as const;

const FACTOR_META: Array<{
  key: keyof CalculatedMetrics['riskFactors'];
  label: string;
  detail: string;
  color: string;
}> = [
  { key: 'chemicals', label: 'Smoke toxicants', detail: 'Tar, CO & combustion chemicals', color: 'bg-amber-400' },
  { key: 'nicotine', label: 'Nicotine dose', detail: 'Absorbed mg/day', color: 'bg-cyan-400' },
  { key: 'respiratory', label: 'Inhaled load', detail: 'Smoke + vapor (vapor weighted lower)', color: 'bg-purple-400' },
  { key: 'cardiovascular', label: 'Heart & blood pressure', detail: 'Nicotine’s heart-rate effect', color: 'bg-red-400' },
  { key: 'duration', label: 'Years of use', detail: 'Longer use, more cumulative harm', color: 'bg-orange-400' },
  { key: 'age', label: 'Developing brain', detail: 'Extra weight under age 25', color: 'bg-blue-400' },
];

export function RiskGauge({ metrics, currency }: RiskGaugeProps) {
  const style = RISK_STYLES[metrics.riskLevel];

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-xl border ${style.badge}`}>
            <Icon name="shield" size={20} />
          </div>
          <div>
            <CardTitle>Relative risk score</CardTitle>
            <CardDescription>A transparent composite of your exposure inputs</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="relative w-full max-w-[240px] shrink-0">
            <svg viewBox="0 0 200 118" className="w-full" role="img" aria-label={`Relative risk score ${metrics.riskScore} out of 100`}>
              <defs>
                <linearGradient id="risk-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="35%" stopColor="#fbbf24" />
                  <stop offset="70%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
                <filter id="risk-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d="M 24 104 A 76 76 0 0 1 176 104"
                fill="none"
                stroke="#27272a"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <path
                d="M 24 104 A 76 76 0 0 1 176 104"
                fill="none"
                stroke="url(#risk-gradient)"
                strokeWidth="16"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${metrics.riskScore} 100`}
                filter="url(#risk-glow)"
                className="transition-all duration-1000 ease-out"
              />

              <text
                x="100"
                y="78"
                textAnchor="middle"
                dominantBaseline="middle"
                className={`fill-current text-3xl font-bold ${style.text}`}
                style={{ fontSize: 38 }}
              >
                {metrics.riskScore}
              </text>
              <text
                x="100"
                y="98"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-zinc-500"
                style={{ fontSize: 11 }}
              >
                out of 100
              </text>
              <text x="24" y="116" textAnchor="middle" className="fill-zinc-600" style={{ fontSize: 9 }}>
                0
              </text>
              <text x="176" y="116" textAnchor="middle" className="fill-zinc-600" style={{ fontSize: 9 }}>
                100
              </text>
            </svg>
          </div>

          <div className="min-w-0 flex-1 text-center md:text-left">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold ${style.badge}`}>
              <span className={`h-2 w-2 rounded-full ${style.bar}`} />
              {style.label}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{style.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <MiniMetric label="Nicotine" value={`${metrics.dailyNicotineMg.toFixed(1)} mg`} />
              <MiniMetric label="Heart rate" value={`+${metrics.heartRateIncreaseBpm.toFixed(0)} bpm`} />
              <MiniMetric label="Inhaled" value={`${metrics.dailyAerosolVolumeLiters.toFixed(1)} L`} />
              <MiniMetric label="Spend" value={formatCurrency(metrics.dailyCost, currency)} />
            </div>
          </div>
        </div>

        {metrics.dailyTarMg > 0 && (
          <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
              <Icon name="alert" size={14} />
              Cigarette-specific exposure
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-zinc-400">
              <span>
                Tar: <strong className="font-mono text-zinc-200">{metrics.dailyTarMg.toFixed(0)} mg/day</strong>
              </span>
              <span>
                CO: <strong className="font-mono text-zinc-200">{metrics.dailyCarbonMonoxideMg.toFixed(0)} mg/day</strong>
              </span>
              <span>
                <strong className="font-mono text-zinc-200">{formatNumber(metrics.packYears, 1)}</strong> pack-years
              </span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
              There’s no safe level of smoking: even one cigarette a day carries roughly a third to half of the
              extra heart-disease risk of a pack a day.
            </p>
          </div>
        )}

        <div className="mt-6 border-t border-zinc-800/80 pt-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-zinc-200">Score breakdown</h4>
            <span className="text-[10px] uppercase tracking-wide text-zinc-600">% of each factor’s max</span>
          </div>
          <div className="space-y-2.5">
            {FACTOR_META.map((factor) => (
              <FactorBar
                key={factor.key}
                label={factor.label}
                detail={`${factor.detail} · up to ${RISK_FACTOR_WEIGHTS[factor.key]} pts`}
                value={metrics.riskFactors[factor.key]}
                color={factor.color}
              />
            ))}
          </div>
        </div>

        <p className="mt-5 text-[11px] leading-relaxed text-zinc-600">
          The score is a communication aid built from population-level estimates, weighted so that
          smoking — by far the most harmful way to use nicotine — dominates. It is not a diagnosis or a
          prediction of your personal health outcomes.
        </p>
      </CardContent>
    </Card>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-left">
      <div className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-medium text-zinc-100">{value}</div>
    </div>
  );
}

function FactorBar({
  label,
  detail,
  value,
  color,
}: {
  label: string;
  detail: string;
  value: number;
  color: string;
}) {
  return (
    <div className="group">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium text-zinc-300">{label}</span>
          <span className="hidden text-[10px] text-zinc-600 sm:inline">{detail}</span>
        </div>
        <span className="font-mono text-[11px] text-zinc-500">{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
