'use client';

import { useEffect, useState } from 'react';
import { CalculatedMetrics, CurrencyCode, WhatIfScenario } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { formatCurrency, formatCompactCurrency } from '@/lib/calculations';

interface WalletVisualizerProps {
  metrics: CalculatedMetrics;
  currency: CurrencyCode;
  whatIfScenarios?: WhatIfScenario[];
}

const ALTERNATIVES = [
  { label: 'New car', cost: 30000, emoji: '🚗' },
  { label: 'House deposit', cost: 100000, emoji: '🏠' },
  { label: 'World trip', cost: 20000, emoji: '🌍' },
  { label: 'Index fund', cost: 50000, emoji: '📈' },
  { label: 'Emergency fund', cost: 10000, emoji: '💰' },
  { label: 'College fund', cost: 80000, emoji: '🎓' },
];

export function WalletVisualizer({ metrics, currency, whatIfScenarios }: WalletVisualizerProps) {
  const sessionSpend = useSessionSpend(metrics.dailyCost);

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
            <Icon name="wallet" size={20} />
          </div>
          <div>
            <CardTitle>Financial impact</CardTitle>
            <CardDescription>What your habit costs — and what else it could become</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/[0.08] via-zinc-950/30 to-zinc-950/10 p-5 text-center">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-500/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
              Spending this session
            </div>
            <div className="mt-2 font-mono text-3xl font-bold tracking-tight text-red-300 sm:text-4xl">
              {formatCurrency(sessionSpend, currency, 4)}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              {formatCurrency(metrics.dailyCost, currency)} per day at your current pace
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <CostCard label="Daily" value={formatCurrency(metrics.dailyCost, currency)} color="text-red-300" />
          <CostCard label="Monthly" value={formatCurrency(metrics.monthlyCost, currency)} color="text-orange-300" />
          <CostCard label="Yearly" value={formatCurrency(metrics.yearlyCost, currency)} color="text-amber-300" />
          <CostCard
            label={`Until 80`}
            value={formatCompactCurrency(metrics.lifetimeCost, currency)}
            color="text-purple-300"
          />
        </div>

        {whatIfScenarios && whatIfScenarios.length > 1 && (
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-medium text-zinc-200">Savings if you change habits</h4>
              <span className="text-[10px] uppercase tracking-wide text-zinc-600">per year</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {whatIfScenarios.slice(1).map((scenario) => (
                <ScenarioCard key={scenario.label} scenario={scenario} baseline={metrics} currency={currency} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-zinc-200">
              What {formatCompactCurrency(metrics.lifetimeCost, currency)} could buy
            </h4>
            <span className="text-[10px] uppercase tracking-wide text-zinc-600">until age 80</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ALTERNATIVES.map((alternative) => (
              <AlternativeCard
                key={alternative.label}
                alternative={alternative}
                count={metrics.lifetimeCost / alternative.cost}
                currency={currency}
              />
            ))}
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <Icon name="activity" size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">If invested instead</h4>
              <p className="mt-0.5 text-xs text-zinc-500">
                Hypothetical 7% average annual return, contributing your yearly spend.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <InvestmentProjection years={10} yearlyContribution={metrics.yearlyCost} currency={currency} />
            <InvestmentProjection years={20} yearlyContribution={metrics.yearlyCost} currency={currency} />
            <InvestmentProjection years={30} yearlyContribution={metrics.yearlyCost} currency={currency} />
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-zinc-600">
            Investments can lose value. This is a simple illustration, not financial advice.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function useSessionSpend(dailyCost: number) {
  const [spend, setSpend] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const perSecond = Math.max(dailyCost, 0) / 86400;
    const resetFrame = window.requestAnimationFrame(() => setSpend(0));
    const timer = window.setInterval(() => {
      setSpend(((Date.now() - startedAt) / 1000) * perSecond);
    }, 100);
    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.clearInterval(timer);
    };
  }, [dailyCost]);

  return spend;
}

function CostCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-center">
      <div className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</div>
      <div className={`mt-1 font-mono text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function ScenarioCard({
  scenario,
  baseline,
  currency,
}: {
  scenario: WhatIfScenario;
  baseline: CalculatedMetrics;
  currency: CurrencyCode;
}) {
  const savings = baseline.yearlyCost - scenario.metrics.yearlyCost;
  const savingsPercent = baseline.yearlyCost > 0 ? (savings / baseline.yearlyCost) * 100 : 0;
  const riskChange = baseline.riskScore - scenario.metrics.riskScore;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 transition-colors hover:border-emerald-500/30">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-zinc-300">{scenario.label}</span>
        {savings > 0 && (
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            -{savingsPercent.toFixed(0)}%
          </span>
        )}
      </div>
      <div className="mt-2 font-mono text-xl font-semibold text-emerald-300">
        {formatCurrency(savings, currency)}
        <span className="text-[10px] font-normal text-zinc-600"> /yr</span>
      </div>
      <div className="mt-1 text-[10px] text-zinc-500">
        10yr: {formatCompactCurrency(savings * 10, currency)}
        {riskChange > 0 && ` · risk -${riskChange} pts`}
      </div>
    </div>
  );
}

function AlternativeCard({
  alternative,
  count,
  currency,
}: {
  alternative: { label: string; cost: number; emoji: string };
  count: number;
  currency: CurrencyCode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-center">
      <div className="text-2xl">{alternative.emoji}</div>
      <div className="mt-1 text-xs font-medium text-zinc-300">{alternative.label}</div>
      <div className="mt-1 font-mono text-base font-semibold text-cyan-300">
        {count >= 0.1 ? `${count.toFixed(count >= 10 ? 0 : 1)}×` : '< 0.1×'}
      </div>
      <div className="text-[10px] text-zinc-600">{formatCurrency(alternative.cost, currency)} each</div>
    </div>
  );
}

function InvestmentProjection({
  years,
  yearlyContribution,
  currency,
}: {
  years: number;
  yearlyContribution: number;
  currency: CurrencyCode;
}) {
  const rate = 0.07;
  const futureValue = yearlyContribution * ((Math.pow(1 + rate, years) - 1) / rate);
  const totalContributed = yearlyContribution * years;
  const gains = futureValue - totalContributed;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-center">
      <div className="text-[10px] uppercase tracking-wide text-zinc-500">{years} years</div>
      <div className="mt-1 font-mono text-xl font-semibold text-emerald-300">
        {formatCompactCurrency(futureValue, currency)}
      </div>
      <div className="mt-1 text-[10px] text-zinc-600">
        {formatCompactCurrency(totalContributed, currency)} contributed
      </div>
      <div className="text-[10px] text-emerald-400/80">+{formatCompactCurrency(gains, currency)} growth</div>
    </div>
  );
}
