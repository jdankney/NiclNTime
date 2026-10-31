'use client';

import { CalculatedMetrics, CurrencyCode } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Icon, IconName } from '@/components/ui/Icon';
import {
  formatCurrency,
  formatCompactCurrency,
  formatDuration,
  formatNumber,
} from '@/lib/calculations';

interface SummaryCardProps {
  metrics: CalculatedMetrics;
  currency: CurrencyCode;
}

type Trend = 'low' | 'moderate' | 'high';

interface SummaryCard {
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  color: 'cyan' | 'purple' | 'red' | 'amber' | 'orange' | 'blue' | 'green';
  trend: Trend;
}

const COLOR_MAP = {
  cyan: { icon: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20', accent: 'bg-cyan-400' },
  purple: {
    icon: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    accent: 'bg-purple-400',
  },
  red: { icon: 'bg-red-500/10 text-red-300 border-red-500/20', accent: 'bg-red-400' },
  amber: { icon: 'bg-amber-500/10 text-amber-300 border-amber-500/20', accent: 'bg-amber-400' },
  orange: {
    icon: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    accent: 'bg-orange-400',
  },
  blue: { icon: 'bg-blue-500/10 text-blue-300 border-blue-500/20', accent: 'bg-blue-400' },
  green: { icon: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', accent: 'bg-emerald-400' },
} as const;

const TREND_STYLES: Record<Trend, { dot: string; label: string; text: string }> = {
  low: { dot: 'bg-emerald-400', label: 'Lower', text: 'text-emerald-400' },
  moderate: { dot: 'bg-amber-400', label: 'Moderate', text: 'text-amber-400' },
  high: { dot: 'bg-red-400', label: 'Higher', text: 'text-red-400' },
};

export function SummaryCards({ metrics, currency }: SummaryCardProps) {
  const cards: SummaryCard[] = [
    {
      label: 'Nicotine / day',
      value: `${formatNumber(metrics.dailyNicotineMg, 1)} mg`,
      detail: `≈ ${formatNumber(metrics.dailyCigaretteEquivalent, 1)} cigarette equivalents`,
      icon: 'sparkles',
      color: 'cyan',
      trend: metrics.dailyNicotineMg > 40 ? 'high' : metrics.dailyNicotineMg > 15 ? 'moderate' : 'low',
    },
    {
      label: 'Aerosol / smoke',
      value: `${formatNumber(metrics.dailyAerosolVolumeLiters, 1)} L`,
      detail: 'Estimated volume inhaled per day',
      icon: 'wind',
      color: 'purple',
      trend:
        metrics.dailyAerosolVolumeLiters > 10
          ? 'high'
          : metrics.dailyAerosolVolumeLiters > 4
            ? 'moderate'
            : 'low',
    },
    {
      label: 'Heart rate impact',
      value: `+${formatNumber(metrics.heartRateIncreaseBpm, 0)} bpm`,
      detail: 'Rough peak estimate, not a measurement',
      icon: 'heart',
      color: 'red',
      trend:
        metrics.heartRateIncreaseBpm > 20 ? 'high' : metrics.heartRateIncreaseBpm > 10 ? 'moderate' : 'low',
    },
    {
      label: 'Monthly cost',
      value: formatCurrency(metrics.monthlyCost, currency),
      detail: `${formatCurrency(metrics.dailyCost, currency)} per day`,
      icon: 'wallet',
      color: 'amber',
      trend: metrics.monthlyCost > 300 ? 'high' : metrics.monthlyCost > 100 ? 'moderate' : 'low',
    },
    {
      label: 'Yearly cost',
      value: formatCompactCurrency(metrics.yearlyCost, currency),
      detail: `${formatCompactCurrency(metrics.tenYearCost, currency)} over 10 years`,
      icon: 'activity',
      color: 'orange',
      trend: metrics.yearlyCost > 3000 ? 'high' : metrics.yearlyCost > 1000 ? 'moderate' : 'low',
    },
    {
      label: `Cost until 80`,
      value: formatCompactCurrency(metrics.lifetimeCost, currency),
      detail: `Projected over ${metrics.projectionYears} years`,
      icon: 'shield',
      color: 'purple',
      trend: metrics.lifetimeCost > 100000 ? 'high' : metrics.lifetimeCost > 50000 ? 'moderate' : 'low',
    },
    {
      label: 'Time / day',
      value: formatDuration(metrics.minutesPerDaySpent),
      detail: `${formatNumber(metrics.hoursPerYearSpent, 0)} hours per year`,
      icon: 'clock',
      color: 'blue',
      trend:
        metrics.minutesPerDaySpent > 60 ? 'high' : metrics.minutesPerDaySpent > 30 ? 'moderate' : 'low',
    },
    {
      label: 'Life lost estimate',
      value: `${formatNumber(metrics.daysOfLifeLostEstimate)} days`,
      detail: 'Statistical estimate across your years of use',
      icon: 'alert',
      color: 'red',
      trend:
        metrics.daysOfLifeLostEstimate > 365
          ? 'high'
          : metrics.daysOfLifeLostEstimate > 30
            ? 'moderate'
            : 'low',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const colors = COLOR_MAP[card.color];
        const trend = TREND_STYLES[card.trend];

        return (
          <Card
            key={card.label}
            variant="default"
            className="group overflow-hidden hover:border-zinc-700 hover:bg-zinc-900/80"
          >
            <div className={`absolute inset-x-0 top-0 h-0.5 ${colors.accent} opacity-60`} />
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className={`grid h-9 w-9 place-items-center rounded-xl border ${colors.icon}`}>
                  <Icon name={card.icon} size={18} />
                </div>
                <div className="flex items-center gap-1.5" title={`${trend.label} relative impact`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${trend.dot}`} />
                  <span className={`text-[10px] font-medium uppercase tracking-wide ${trend.text}`}>
                    {trend.label}
                  </span>
                </div>
              </div>
              <div className="mt-4 text-2xl font-semibold font-mono tracking-tight text-zinc-50">
                {card.value}
              </div>
              <div className="mt-1 text-xs font-medium text-zinc-400">{card.label}</div>
              <div className="mt-1 text-[11px] leading-snug text-zinc-600 line-clamp-2">
                {card.detail}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
