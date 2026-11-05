'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_INPUTS,
  DEFAULT_CIGARETTES,
  DEFAULT_POUCHES,
  DEFAULT_VAPING,
  DEVICE_PROFILES,
  EXAMPLE_INPUTS,
  CURRENCIES,
  VAPE_PRODUCTS,
  NICOTINE_TYPE_INFO,
  POUCH_PRODUCTS,
  CIGARETTE_TYPE_LABELS,
  type UserInputs,
  type WhatIfScenario,
  type CalculatedMetrics,
} from '@/types';
import {
  calculateMetrics,
  generateWhatIfScenarios,
  normalizeInputs,
  formatCurrency,
  formatCompactCurrency,
  formatDuration,
  formatFlexible,
  formatLifeLost,
  formatNumber,
} from '@/lib/calculations';
import { VapingInputForm } from '@/components/inputs/VapingInput';
import { CigaretteInputForm } from '@/components/inputs/CigaretteInput';
import { PouchInputForm } from '@/components/inputs/PouchInput';
import { GeneralSettings } from '@/components/inputs/GeneralSettings';
import { SummaryCards } from '@/components/visualizers/SummaryCards';
import { RiskGauge } from '@/components/visualizers/RiskGauge';
import { LungsVisualizer } from '@/components/visualizers/LungsVisualizer';
import { WalletVisualizer } from '@/components/visualizers/WalletVisualizer';
import { ClockVisualizer } from '@/components/visualizers/ClockVisualizer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Welcome } from '@/components/Welcome';
import { Methodology } from '@/components/Methodology';
import { Science } from '@/components/Science';

type Tab = 'inputs' | 'dashboard' | 'whatif' | 'science';

const STORAGE_KEY = 'niclntime:inputs:v2';

const TABS: Array<{ id: Tab; label: string; mobileLabel?: string; icon: IconName }> = [
  { id: 'inputs', label: 'Inputs', icon: 'settings' },
  { id: 'dashboard', label: 'Dashboard', icon: 'activity' },
  { id: 'whatif', label: 'What if?', icon: 'sparkles' },
  { id: 'science', label: 'The science', mobileLabel: 'Science', icon: 'info' },
];

export default function Dashboard() {
  const [inputs, setInputs] = useState<UserInputs>(DEFAULT_INPUTS);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [scienceFocus, setScienceFocus] = useState<'under-25' | null>(null);

  const metrics = useMemo(() => calculateMetrics(inputs), [inputs]);
  const whatIfScenarios = useMemo(() => generateWhatIfScenarios(inputs), [inputs]);
  const hasAnyInput = Boolean(inputs.vaping || inputs.cigarettes || inputs.pouches);
  const currency = inputs.currency;

  // Restore local data or a shared link after mount.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get('s');
      let restored: UserInputs | null = null;

      if (shared) {
        restored = normalizeInputs(JSON.parse(shared) as Partial<UserInputs>);
      } else {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) restored = normalizeInputs(JSON.parse(stored) as Partial<UserInputs>);
      }

      if (restored) {
        // Hydrate persisted state once after mount so server and client markup match.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInputs(restored);
        if (restored.vaping || restored.cigarettes || restored.pouches) setActiveTab('dashboard');
      }
    } catch {
      // Corrupt storage or an invalid link should never block the app.
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist the latest inputs locally. Nothing leaves the browser.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      // Storage can be unavailable in private browsing modes.
    }
  }, [inputs, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openScience = (focus: 'under-25' | null = null) => {
    setScienceFocus(focus);
    setActiveTab('science');
    if (!focus) window.scrollTo({ top: 0 });
  };

  const updateInputs = (patch: Partial<UserInputs>) => {
    setInputs((previous) => ({ ...previous, ...patch }));
  };

  const loadDemo = () => {
    setInputs(EXAMPLE_INPUTS);
    setActiveTab('dashboard');
    setShowDisclaimer(true);
    setToast('Sample report loaded. Change any input to make it yours.');
  };

  const resetInputs = () => {
    if (hasAnyInput && !window.confirm('Reset all inputs? Your saved data will be cleared.')) return;
    setInputs(DEFAULT_INPUTS);
    setActiveTab('inputs');
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
    setToast('Inputs reset.');
  };

  const shareReport = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('s', JSON.stringify(inputs));

    try {
      await navigator.clipboard.writeText(url.toString());
      setToast('Share link copied to your clipboard.');
    } catch {
      window.prompt('Copy this share link:', url.toString());
    }
  };

  const exportReport = () => {
    const report = buildReport(inputs, metrics, whatIfScenarios);
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `nicotine-impact-report-${date}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setToast('Report downloaded.');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950"
      >
        Skip to content
      </a>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-full w-1/2 bg-gradient-to-b from-cyan-500/[0.045] via-transparent to-red-500/[0.03]" />
        <div className="absolute bottom-0 right-1/4 h-full w-1/2 bg-gradient-to-t from-amber-500/[0.03] via-transparent to-purple-500/[0.04]" />
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/[0.035] blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="flex shrink-0 items-center gap-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              aria-label="NiclNTime home"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-zinc-950 shadow-lg shadow-cyan-500/20">
                <Icon name="lungs" size={20} />
              </span>
              <span className="text-left">
                <span className="block text-sm font-bold tracking-tight text-zinc-50">NiclNTime</span>
                <span className="hidden text-[10px] text-zinc-500 sm:block">Nicotine impact visualizer</span>
              </span>
            </button>

            <nav className="hidden items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1 md:flex" aria-label="Main navigation">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                      active
                        ? 'bg-zinc-800 text-cyan-300 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                  >
                    <Icon name={tab.icon} size={15} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={shareReport}
                disabled={!hasAnyInput}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
                aria-label="Copy share link"
              >
                <Icon name="share" size={16} />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                type="button"
                onClick={exportReport}
                disabled={!hasAnyInput}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
                aria-label="Download report"
              >
                <Icon name="download" size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                type="button"
                onClick={resetInputs}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100 sm:px-3"
                aria-label="Reset inputs"
              >
                <Icon name="refresh" size={16} />
                <span className="hidden lg:inline">Reset</span>
              </button>
            </div>
          </div>

          <nav className="flex gap-0.5 overflow-x-auto pb-2 md:hidden" aria-label="Mobile navigation">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    active ? 'bg-zinc-800 text-cyan-300' : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <Icon name={tab.icon} size={14} />
                  {tab.mobileLabel ?? tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main id="main-content" className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 sm:pt-7">
        {showDisclaimer && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-3.5 sm:p-4 animate-slide-down">
            <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-amber-300" />
            <div className="flex-1 text-xs leading-relaxed text-amber-100/75">
              <strong className="text-amber-200">Educational estimates, not medical advice.</strong>{' '}
              Figures are based on population averages and may not reflect your individual health.
              Consult a healthcare professional for personal guidance.
            </div>
            <button
              type="button"
              onClick={() => setShowDisclaimer(false)}
              className="shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/10 hover:text-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
              aria-label="Dismiss disclaimer"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeTab === 'inputs' && (
          <div className="space-y-5 animate-fade-in">
            <PageHeading
              eyebrow="Step 1 of 2"
              title="Configure your usage"
              description="Add whatever you use — vapes, cigarettes, pouches or any mix. Everything updates instantly and stays in your browser."
              action={
                <button
                  type="button"
                  onClick={loadDemo}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 px-3.5 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
                >
                  <Icon name="sparkles" size={15} className="text-cyan-300" />
                  Load sample
                </button>
              }
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="space-y-5 lg:col-span-2">
                <VapingInputForm
                  value={inputs.vaping}
                  onChange={(vaping) => updateInputs({ vaping })}
                  enabled={Boolean(inputs.vaping)}
                  onToggle={(enabled) => updateInputs({ vaping: enabled ? { ...DEFAULT_VAPING } : null })}
                  costPerMl={inputs.costPerVapeMl}
                  onCostPerMlChange={(costPerVapeMl) => updateInputs({ costPerVapeMl })}
                  currency={currency}
                />
                <CigaretteInputForm
                  value={inputs.cigarettes}
                  onChange={(cigarettes) => updateInputs({ cigarettes })}
                  enabled={Boolean(inputs.cigarettes)}
                  onToggle={(enabled) =>
                    updateInputs({ cigarettes: enabled ? { ...DEFAULT_CIGARETTES } : null })
                  }
                  costPerPack={inputs.costPerPack}
                  onCostPerPackChange={(costPerPack) => updateInputs({ costPerPack })}
                  currency={currency}
                />
                <PouchInputForm
                  value={inputs.pouches}
                  onChange={(pouches) => updateInputs({ pouches })}
                  enabled={Boolean(inputs.pouches)}
                  onToggle={(enabled) => updateInputs({ pouches: enabled ? { ...DEFAULT_POUCHES } : null })}
                  costPerCan={inputs.costPerCan}
                  onCostPerCanChange={(costPerCan) => updateInputs({ costPerCan })}
                  currency={currency}
                />
              </div>
              <div className="space-y-5">
                <div className="lg:sticky lg:top-24">
                  <GeneralSettings
                    value={{
                      yearsOfUse: inputs.yearsOfUse,
                      age: inputs.age,
                      currency: inputs.currency,
                    }}
                    onChange={(settings) => updateInputs(settings)}
                  />
                </div>
              </div>
            </div>

            {!hasAnyInput ? (
              <Card variant="outlined" className="text-center">
                <CardContent className="py-10">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-zinc-700 bg-zinc-800/50 text-zinc-400">
                    <Icon name="info" size={22} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-zinc-200">Add what you use to begin</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
                    Tap “+ Add” on vaping, cigarettes or pouches — or any combination. You can change every
                    number later and compare scenarios at any point.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-cyan-500/15 transition-all hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:w-auto"
              >
                View my impact dashboard
                <Icon name="arrow-right" size={17} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && !hasAnyInput && (
          <Welcome onStart={() => setActiveTab('inputs')} onDemo={loadDemo} onLearn={() => openScience()} />
        )}

        {activeTab === 'dashboard' && hasAnyInput && (
          <div className="space-y-5 animate-fade-in">
            <PageHeading
              eyebrow="Step 2 of 2"
              title="Your impact dashboard"
              description="Live estimates based on your inputs. Edit anything to see the picture change."
              action={
                <button
                  type="button"
                  onClick={() => setActiveTab('inputs')}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 px-3.5 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
                >
                  <Icon name="settings" size={15} />
                  Edit inputs
                </button>
              }
            />

            {inputs.age < 25 && (
              <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-amber-300" />
                  <p className="text-xs leading-relaxed text-amber-100/80">
                    <strong className="text-amber-200">You’re under 25.</strong> Your brain is still developing,
                    which makes nicotine addiction set in faster and its effects last longer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openScience('under-25')}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-medium text-amber-100 transition-colors hover:bg-amber-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
                >
                  What it means for you
                  <Icon name="arrow-right" size={14} />
                </button>
              </div>
            )}

            <SummaryCards metrics={metrics} currency={currency} />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <RiskGauge metrics={metrics} currency={currency} />
              <LungsVisualizer metrics={metrics} />
              <WalletVisualizer metrics={metrics} currency={currency} whatIfScenarios={whatIfScenarios} />
              <ClockVisualizer metrics={metrics} currency={currency} />
            </div>

            <Resources />

            <Methodology />
          </div>
        )}

        {activeTab === 'whatif' && !hasAnyInput && (
          <Welcome onStart={() => setActiveTab('inputs')} onDemo={loadDemo} onLearn={() => openScience()} />
        )}

        {activeTab === 'science' && (
          <Science focus={scienceFocus} onFocusHandled={() => setScienceFocus(null)} />
        )}

        {activeTab === 'whatif' && hasAnyInput && (
          <div className="space-y-5 animate-fade-in">
            <PageHeading
              eyebrow="Compare options"
              title="What if you changed something?"
              description="These scenarios use your current costs and habits. They are estimates, not promises."
              action={
                <button
                  type="button"
                  onClick={() => setActiveTab('inputs')}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 px-3.5 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
                >
                  <Icon name="arrow-right" size={15} />
                  Adjust inputs
                </button>
              }
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {whatIfScenarios.map((scenario) => (
                <WhatIfCard
                  key={scenario.id}
                  scenario={scenario}
                  baseline={whatIfScenarios[0]?.metrics}
                  currency={currency}
                />
              ))}
            </div>

            <Card variant="default" className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-700 bg-zinc-800/60 text-zinc-300">
                    <Icon name="activity" size={20} />
                  </div>
                  <div>
                    <CardTitle>Detailed comparison</CardTitle>
                    <CardDescription>Side-by-side estimates for every scenario</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 sm:p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-950/40 text-left text-[11px] uppercase tracking-wide text-zinc-500">
                        <th className="sticky left-0 z-10 bg-zinc-950/95 px-4 py-3 font-medium sm:px-5">Metric</th>
                        {whatIfScenarios.map((scenario) => (
                          <th key={scenario.id} className="px-3 py-3 text-center font-medium">
                            {scenario.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      <ComparisonRow
                        label="Nicotine / day"
                        values={whatIfScenarios.map((scenario) => `${scenario.metrics.dailyNicotineMg.toFixed(1)} mg`)}
                      />
                      <ComparisonRow
                        label="Inhaled / day"
                        values={whatIfScenarios.map((scenario) => `${scenario.metrics.dailyAerosolVolumeLiters.toFixed(1)} L`)}
                      />
                      <ComparisonRow
                        label="Avg. heart rate rise"
                        values={whatIfScenarios.map((scenario) => `+${scenario.metrics.heartRateIncreaseBpm.toFixed(0)} bpm`)}
                      />
                      <ComparisonRow
                        label="Monthly cost"
                        values={whatIfScenarios.map((scenario) => formatCurrency(scenario.metrics.monthlyCost, currency))}
                      />
                      <ComparisonRow
                        label="Yearly cost"
                        values={whatIfScenarios.map((scenario) => formatCurrency(scenario.metrics.yearlyCost, currency))}
                      />
                      <ComparisonRow
                        label="10-year cost"
                        values={whatIfScenarios.map((scenario) => formatCompactCurrency(scenario.metrics.tenYearCost, currency))}
                      />
                      <ComparisonRow
                        label="Time / day"
                        values={whatIfScenarios.map((scenario) => formatDuration(scenario.metrics.minutesPerDaySpent))}
                      />
                      <ComparisonRow
                        label="Risk score"
                        values={whatIfScenarios.map((scenario) => `${scenario.metrics.riskScore} / 100`)}
                        highlight
                      />
                      <ComparisonRow
                        label="Risk level"
                        values={whatIfScenarios.map((scenario) => scenario.metrics.riskLevel)}
                        capitalize
                      />
                      {whatIfScenarios[0]?.metrics.lifeLostApplies && (
                        <ComparisonRow
                          label="Life expectancy lost / year (smoking)"
                          values={whatIfScenarios.map((scenario) => formatLifeLost(scenario.metrics.daysLostPerYear))}
                        />
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
              <div className="flex items-start gap-3">
                <Icon name="info" size={17} className="mt-0.5 shrink-0 text-cyan-300" />
                <p className="text-xs leading-relaxed text-zinc-500">
                  Cutting down is not the same as quitting, and quitting abruptly can be difficult. If you
                  want support, the resources on the dashboard tab include free helplines and evidence-based
                  programs. A healthcare professional can help you choose a plan that fits your situation.
                </p>
              </div>
            </div>

            <Methodology />
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-zinc-800/80 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-800 text-cyan-300">
              <Icon name="lungs" size={15} />
            </span>
            <div>
              <p className="text-xs font-medium text-zinc-400">NiclNTime — educational nicotine impact visualizer</p>
              <p className="text-[10px] text-zinc-600">Estimates only. Not medical advice. MIT licensed.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-zinc-600">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="shield" size={13} className="text-emerald-500" />
              No tracking
            </span>
            <span>Made for awareness and quitting support</span>
          </div>
        </div>
      </footer>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-xl border border-cyan-500/30 bg-zinc-900/95 px-4 py-2.5 text-xs font-medium text-cyan-100 shadow-2xl shadow-black/50 backdrop-blur-md animate-slide-up"
        >
          <Icon name="check" size={15} className="shrink-0 text-cyan-300" />
          {toast}
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-slide-up { animation: slide-up 0.25s ease-out; }
        @media print {
          header, footer, nav, button, [role='status'] { display: none !important; }
          body { background: white !important; color: black !important; }
          main { max-width: none !important; padding: 0 !important; }
          .bg-zinc-950, .bg-zinc-900\\/40, .bg-zinc-900\\/65, .bg-zinc-900\\/80 {
            background: white !important;
          }
          .text-zinc-100, .text-zinc-200, .text-zinc-300 { color: #111 !important; }
        }
      `}</style>
    </div>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-400/80">{eyebrow}</div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Resources() {
  const resources = [
    {
      title: 'Smokefree.gov',
      description: 'Free, evidence-based quitting tools and support.',
      url: 'https://smokefree.gov',
      icon: 'globe' as IconName,
    },
    {
      title: '1-800-QUIT-NOW',
      description: 'Free telephone counseling and support (US).',
      url: 'tel:1-800-784-8669',
      icon: 'heart' as IconName,
    },
    {
      title: 'This Is Quitting',
      description: 'Free text program for quitting vaping — text DITCHVAPE to 88709 (US).',
      url: 'https://truthinitiative.org/thisisquitting',
      icon: 'sparkles' as IconName,
    },
    {
      title: 'Nicotine Anonymous',
      description: '12-step fellowship for nicotine addiction recovery.',
      url: 'https://nicotine-anonymous.org',
      icon: 'shield' as IconName,
    },
    {
      title: 'CDC quit resources',
      description: 'Practical strategies and medication information.',
      url: 'https://www.cdc.gov/tobacco/quit_smoking',
      icon: 'info' as IconName,
    },
    {
      title: 'NHS Quit Smoking (UK)',
      description: 'Free NHS app, local stop-smoking services and advice.',
      url: 'https://www.nhs.uk/better-health/quit-smoking/',
      icon: 'external' as IconName,
    },
  ];

  return (
    <Card variant="outlined">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
            <Icon name="heart" size={20} />
          </div>
          <div>
            <CardTitle>Resources for quitting</CardTitle>
            <CardDescription>You do not have to do this alone — free help is available.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <a
              key={resource.title}
              href={resource.url}
              target={resource.url.startsWith('tel:') ? undefined : '_blank'}
              rel={resource.url.startsWith('tel:') ? undefined : 'noopener noreferrer'}
              className="group flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3.5 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-800/80 text-zinc-400 transition-colors group-hover:bg-emerald-500/10 group-hover:text-emerald-300">
                <Icon name={resource.icon} size={16} />
              </div>
              <div className="min-w-0">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 transition-colors group-hover:text-emerald-200">
                  {resource.title}
                  <Icon name="external" size={11} className="text-zinc-600" />
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">{resource.description}</p>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function WhatIfCard({
  scenario,
  baseline,
  currency,
}: {
  scenario: WhatIfScenario;
  baseline?: CalculatedMetrics;
  currency: UserInputs['currency'];
}) {
  const isBaseline = !baseline || scenario.id === 'current';
  const savings = baseline ? baseline.yearlyCost - scenario.metrics.yearlyCost : 0;
  const riskChange = baseline ? baseline.riskScore - scenario.metrics.riskScore : 0;
  const nicotineChange = baseline ? baseline.dailyNicotineMg - scenario.metrics.dailyNicotineMg : 0;
  const timeChange = baseline ? baseline.minutesPerDaySpent - scenario.metrics.minutesPerDaySpent : 0;
  const lifeChange = baseline ? baseline.daysLostPerYear - scenario.metrics.daysLostPerYear : 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
        isBaseline
          ? 'border-cyan-500/30 bg-cyan-500/[0.07] ring-1 ring-cyan-500/20'
          : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/70'
      }`}
    >
      {isBaseline && (
        <div className="absolute right-3 top-3 rounded-full bg-cyan-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-950">
          Baseline
        </div>
      )}
      <div className="pr-16">
        <h3 className={`font-semibold ${isBaseline ? 'text-cyan-100' : 'text-zinc-100'}`}>{scenario.label}</h3>
        <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">{scenario.description}</p>
      </div>

      {isBaseline ? (
        <div className="mt-5 rounded-xl border border-cyan-500/20 bg-zinc-950/30 p-3">
          <div className="text-[10px] uppercase tracking-wide text-cyan-300/70">Current yearly cost</div>
          <div className="mt-0.5 font-mono text-2xl font-semibold text-zinc-50">
            {formatCurrency(scenario.metrics.yearlyCost, currency)}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            Risk {scenario.metrics.riskScore}/100 · {formatNumber(scenario.metrics.dailyNicotineMg, 1)} mg nicotine/day
          </div>
        </div>
      ) : savings <= 0 ? (
        <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-3">
          <div className="text-[10px] uppercase tracking-wide text-emerald-300/70">Less nicotine each day</div>
          <div className="mt-0.5 font-mono text-2xl font-semibold text-emerald-300">
            -{formatNumber(Math.max(nicotineChange, 0), 0)} mg
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">Same spend — a stepping stone toward quitting</div>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-3">
          <div className="text-[10px] uppercase tracking-wide text-emerald-300/70">Potential yearly savings</div>
          <div className="mt-0.5 font-mono text-2xl font-semibold text-emerald-300">
            {formatCurrency(Math.max(savings, 0), currency)}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {formatCompactCurrency(Math.max(savings, 0) * 10, currency)} over 10 years
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <DeltaRow
          label="Risk score"
          value={`${scenario.metrics.riskScore}/100`}
          change={!isBaseline && riskChange > 0 ? `-${riskChange} pts` : undefined}
        />
        <DeltaRow
          label="Nicotine / day"
          value={`${formatNumber(scenario.metrics.dailyNicotineMg, 1)} mg`}
          change={!isBaseline && nicotineChange > 0 ? `-${formatNumber(nicotineChange, 1)} mg` : undefined}
        />
        <DeltaRow
          label="Time / day"
          value={formatDuration(scenario.metrics.minutesPerDaySpent)}
          change={!isBaseline && timeChange > 0 ? `-${formatDuration(timeChange)}` : undefined}
        />
        {baseline?.lifeLostApplies && (
          <DeltaRow
            label="Life exp. lost / yr"
            value={formatLifeLost(scenario.metrics.daysLostPerYear)}
            change={!isBaseline && lifeChange > 0.5 ? `+${formatLifeLost(lifeChange)} back` : undefined}
          />
        )}
      </div>
    </div>
  );
}

function DeltaRow({ label, value, change }: { label: string; value: string; change?: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-zinc-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-zinc-200">{value}</span>
        {change && (
          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  values,
  highlight = false,
  capitalize = false,
}: {
  label: string;
  values: string[];
  highlight?: boolean;
  capitalize?: boolean;
}) {
  return (
    <tr className="border-b border-zinc-800/50 transition-colors last:border-0 hover:bg-zinc-900/50">
      <td className="sticky left-0 z-10 bg-zinc-950/95 px-4 py-3 text-xs text-zinc-400 sm:px-5">{label}</td>
      {values.map((value, index) => (
        <td
          key={`${value}-${index}`}
          className={`px-3 py-3 text-center font-mono text-xs ${
            highlight ? 'font-semibold text-cyan-300' : 'text-zinc-200'
          } ${capitalize ? 'capitalize' : ''}`}
        >
          {value}
        </td>
      ))}
    </tr>
  );
}

function describeVaping(vaping: NonNullable<UserInputs['vaping']>): string {
  const product = VAPE_PRODUCTS.find((item) => item.id === vaping.productId);
  const unit = DEVICE_PROFILES[vaping.deviceType].unit;
  const days = vaping.volumePerDay > 0 ? vaping.unitSizeMl / vaping.volumePerDay : 0;
  return [
    product ? product.name : DEVICE_PROFILES[vaping.deviceType].label,
    `${formatFlexible(vaping.nicotineConcentration, 1)} mg/mL (${formatFlexible(vaping.nicotineConcentration / 10, 1)}%) ${NICOTINE_TYPE_INFO[vaping.nicotineType].label.toLowerCase()}`,
    `one ${formatFlexible(vaping.unitSizeMl, 1)} mL ${unit} every ${formatFlexible(days, 1)} days`,
    `${formatFlexible(vaping.volumePerDay, 2)} mL/day`,
    `~${vaping.hitsPerDay} puffs/day`,
  ].join(', ');
}

function buildReport(inputs: UserInputs, metrics: CalculatedMetrics, scenarios: WhatIfScenario[]): string {
  const currency = CURRENCIES[inputs.currency];
  const money = (value: number) => formatCurrency(value, inputs.currency);
  const pouchProduct = inputs.pouches ? POUCH_PRODUCTS.find((item) => item.id === inputs.pouches?.productId) : null;
  const lines: string[] = [
    '# Nicotine Impact Report',
    '',
    `Generated: ${new Date().toLocaleString()}`,
    `Currency: ${currency.code} (${currency.label})`,
    '',
    '## What I use',
    '',
    inputs.vaping
      ? `- Vaping: ${describeVaping(inputs.vaping)} — ${money(inputs.costPerVapeMl * inputs.vaping.unitSizeMl)} per ${DEVICE_PROFILES[inputs.vaping.deviceType].unit}`
      : '- Vaping: none',
    inputs.cigarettes
      ? `- Cigarettes: ${inputs.cigarettes.cigarettesPerDay}/day, ${CIGARETTE_TYPE_LABELS[inputs.cigarettes.type]}, ${money(inputs.costPerPack)} per pack of ${inputs.cigarettes.packSize}`
      : '- Cigarettes: none',
    inputs.pouches
      ? `- Nicotine pouches: ${formatFlexible(inputs.pouches.pouchesPerDay, 1)}/day, ${pouchProduct ? pouchProduct.name : `${inputs.pouches.mgPerPouch} mg`}, ${money(inputs.costPerCan)} per can of ${inputs.pouches.pouchesPerCan}`
      : '- Nicotine pouches: none',
    `- Years of use: ${inputs.yearsOfUse}`,
    `- Age: ${inputs.age}`,
    '',
    '## Key estimates',
    '',
    `- Nicotine absorbed: ${metrics.dailyNicotineMg.toFixed(1)} mg/day (≈ ${formatNumber(metrics.dailyCigaretteEquivalent, 0)} cigarettes' worth)`,
    `- Inhaled smoke: ${metrics.dailySmokeVolumeLiters.toFixed(1)} L/day; vape aerosol: ${metrics.dailyVapeAerosolLiters.toFixed(1)} L/day`,
    ...(metrics.dailyTarMg > 0
      ? [`- Tar: ${metrics.dailyTarMg.toFixed(0)} mg/day; carbon monoxide: ${metrics.dailyCarbonMonoxideMg.toFixed(0)} mg/day; ${metrics.packYears.toFixed(1)} pack-years`]
      : []),
    `- Average heart-rate rise: +${metrics.heartRateIncreaseBpm.toFixed(0)} bpm`,
    `- Relative risk score: ${metrics.riskScore}/100 (${metrics.riskLevel})`,
    `- Daily cost: ${money(metrics.dailyCost)}`,
    `- Monthly cost: ${money(metrics.monthlyCost)}`,
    `- Yearly cost: ${money(metrics.yearlyCost)}`,
    `- Projected cost until age 80: ${money(metrics.lifetimeCost)} (${metrics.projectionYears} years)`,
    `- Time spent: ${formatDuration(metrics.minutesPerDaySpent)}/day, ${metrics.hoursPerYearSpent.toFixed(0)} hours/year`,
    metrics.lifeLostApplies
      ? `- Life expectancy lost to smoking so far: ${formatLifeLost(metrics.daysOfLifeLostEstimate)} (${formatLifeLost(metrics.daysLostPerYear)} per year at this rate)`
      : '- Life expectancy: no smoking entered; long-term effects of vaping and pouches are not yet established',
    '',
    '## What-if scenarios',
    '',
    '| Scenario | Risk | Nicotine/day | Yearly cost | Life exp. lost/yr |',
    '| --- | ---: | ---: | ---: | ---: |',
    ...scenarios.map(
      (scenario) =>
        `| ${scenario.label} | ${scenario.metrics.riskScore}/100 | ${scenario.metrics.dailyNicotineMg.toFixed(1)} mg | ${money(scenario.metrics.yearlyCost)} | ${formatLifeLost(scenario.metrics.daysLostPerYear)} |`
    ),
    '',
    '## Disclaimer',
    '',
    'This report is for educational and awareness purposes only. It does not constitute medical advice, diagnosis, or treatment. All calculations are estimates based on population-level averages and may not reflect individual health outcomes. Consult a qualified healthcare professional for personal guidance.',
    '',
    'Generated with NiclNTime. No data was sent to a server.',
  ];

  return lines.join('\n');
}
