'use client';

import { useEffect, useState } from 'react';
import { CalculatedMetrics, CurrencyCode } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { formatCurrency, formatNumber } from '@/lib/calculations';

interface ClockVisualizerProps {
  metrics: CalculatedMetrics;
  currency: CurrencyCode;
}


export function ClockVisualizer({ metrics, currency }: ClockVisualizerProps) {
  const sessionSeconds = useSessionSeconds();
  const dayPercentage = Math.min((metrics.minutesPerDaySpent / 1440) * 100, 100);
  const yearPercentage = Math.min((metrics.hoursPerYearSpent / 8760) * 100, 100);

  const equivalencies = [
    { label: 'Work weeks', value: metrics.hoursPerYearSpent / 40, unit: 'weeks', icon: '💼' },
    { label: 'Full days', value: metrics.hoursPerYearSpent / 24, unit: 'days', icon: '📅' },
    { label: 'Movies', value: metrics.hoursPerYearSpent / 2, unit: '2h films', icon: '🎬' },
    { label: 'Books', value: metrics.hoursPerYearSpent / 6, unit: '6h reads', icon: '📚' },
    { label: 'Workouts', value: metrics.hoursPerYearSpent, unit: '1h sessions', icon: '💪' },
    { label: 'Sleep nights', value: metrics.hoursPerYearSpent / 8, unit: '8h nights', icon: '😴' },
  ];

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300">
            <Icon name="clock" size={20} />
          </div>
          <div>
            <CardTitle>Time impact</CardTitle>
            <CardDescription>The minutes and years your habit quietly consumes</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <DonutStat
            label="Daily time"
            value={`${formatNumber(metrics.minutesPerDaySpent, 0)}`}
            unit="min / day"
            percentage={dayPercentage}
            color="#22d3ee"
            sub={`${formatNumber(dayPercentage, 1)}% of a day`}
          />
          <DonutStat
            label="Yearly time"
            value={`${formatNumber(metrics.hoursPerYearSpent, 0)}`}
            unit="hrs / year"
            percentage={yearPercentage}
            color="#60a5fa"
            sub={`${formatNumber(yearPercentage, 1)}% of a year`}
          />
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-4 text-center">
            <div className="relative grid h-24 w-24 place-items-center rounded-full border-4 border-red-500/25">
              <div className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-red-400/70 animate-[spin_8s_linear_infinite]" />
              <div>
                <div className="font-mono text-2xl font-bold text-red-300">
                  {formatNumber(metrics.daysOfLifeLostEstimate)}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-zinc-500">days est.</div>
              </div>
            </div>
            <div className="mt-3 text-xs font-medium text-zinc-300">Estimated life lost</div>
            <div className="mt-1 text-[10px] leading-relaxed text-zinc-600">
              ~11 min per cigarette-equivalent, across {formatNumber(metrics.yearsOfLifeLostEstimate, 1)} years
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-zinc-200">What you could do with that time</h4>
            <span className="text-[10px] uppercase tracking-wide text-zinc-600">per year</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {equivalencies.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-center transition-colors hover:border-zinc-700"
              >
                <div className="text-xl">{item.icon}</div>
                <div className="mt-1 font-mono text-lg font-semibold text-cyan-300">
                  {formatNumber(item.value, item.value < 10 ? 1 : 0)}
                </div>
                <div className="text-[10px] text-zinc-500">{item.unit}</div>
                <div className="mt-0.5 truncate text-[10px] text-zinc-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-zinc-200">Time timeline</h4>
            <span className="text-[10px] uppercase tracking-wide text-zinc-600">hours per year</span>
          </div>
          <div className="space-y-3">
            <TimelineBar label="Nicotine use" value={metrics.hoursPerYearSpent} max={8760} color="bg-red-400" />
            <TimelineBar label="Recommended sleep" value={8 * 365} max={8760} color="bg-blue-400" />
            <TimelineBar label="Full-time work" value={2080} max={8760} color="bg-zinc-500" />
            <TimelineBar
              label="Remaining free time"
              value={Math.max(0, 8760 - metrics.hoursPerYearSpent - 2920 - 2080)}
              max={8760}
              color="bg-emerald-400"
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-zinc-600">
            <span>0h</span>
            <span>2,190h</span>
            <span>4,380h</span>
            <span>6,570h</span>
            <span>8,760h</span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-500/[0.08] to-orange-500/[0.05] p-4">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-red-500/10 text-red-300">
                <Icon name="clock" size={18} />
              </div>
              <div>
                <div className="text-xs font-medium text-zinc-200">Since this page opened</div>
                <div className="text-[10px] text-zinc-500">A live illustration of the daily average</div>
              </div>
            </div>
            <div className="flex items-center gap-5 text-center">
              <div>
                <div className="font-mono text-xl font-bold text-red-300">
                  {formatClock(sessionSeconds)}
                </div>
                <div className="text-[10px] text-zinc-600">nicotine time</div>
              </div>
              <div>
                <div className="font-mono text-xl font-bold text-orange-300">
                  {formatCurrency((metrics.dailyCost / 86400) * sessionSeconds, currency, 4)}
                </div>
                <div className="text-[10px] text-zinc-600">spent</div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[10px] leading-relaxed text-zinc-600">
          Time-per-use figures are averages. The yearly total assumes every day matches your current
          routine, including weekends and holidays.
        </p>
      </CardContent>
    </Card>
  );
}

function useSessionSeconds() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return seconds;
}

function formatClock(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function DonutStat({
  label,
  value,
  unit,
  percentage,
  color,
  sub,
}: {
  label: string;
  value: string;
  unit: string;
  percentage: number;
  color: string;
  sub: string;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(percentage, 100) / 100);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 text-center">
      <div className="relative grid h-28 w-28 place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#27272a" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div>
          <div className="font-mono text-xl font-bold text-zinc-50">{value}</div>
          <div className="text-[10px] text-zinc-500">{unit}</div>
        </div>
      </div>
      <div className="mt-2 text-xs font-medium text-zinc-300">{label}</div>
      <div className="mt-0.5 text-[10px] text-zinc-600">{sub}</div>
    </div>
  );
}

function TimelineBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="mb-1 flex justify-between gap-2 text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono text-zinc-300">
          {formatNumber(value, 0)}h · {formatNumber(percentage, 1)}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
