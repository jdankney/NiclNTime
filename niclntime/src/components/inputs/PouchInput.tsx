'use client';

import {
  CURRENCIES,
  CUSTOM_PRODUCT_ID,
  DEFAULT_POUCHES,
  NICOTINE_PER_CIGARETTE_EQUIVALENT_MG,
  POUCH_PRODUCTS,
  type CurrencyCode,
  type PouchInput,
} from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { NumberInput, Toggle } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { formatCurrency, formatFlexible, formatNumber, pouchNicotineAbsorbedMg } from '@/lib/calculations';
import { LiveStat, ModuleOff, StepHeading } from './VapingInput';

interface PouchInputProps {
  value: PouchInput | null;
  onChange: (value: PouchInput | null) => void;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  costPerCan: number;
  onCostPerCanChange: (cost: number) => void;
  currency: CurrencyCode;
}

const COUNT_CHIPS = [3, 5, 8, 10, 15, 20];

export function PouchInputForm({
  value,
  onChange,
  enabled,
  onToggle,
  costPerCan,
  onCostPerCanChange,
  currency,
}: PouchInputProps) {
  const current = value ?? DEFAULT_POUCHES;
  const symbol = CURRENCIES[currency].symbol;
  const update = (patch: Partial<PouchInput>) => onChange({ ...current, ...patch });
  const product = POUCH_PRODUCTS.find((item) => item.id === current.productId);

  if (!enabled) {
    return (
      <ModuleOff
        onToggle={onToggle}
        title="Nicotine pouches"
        description="ZYN, on!, VELO and other tobacco-free pouches."
        icon="pouch"
        accent="emerald"
      />
    );
  }

  const absorbed = pouchNicotineAbsorbedMg(current);
  const daysPerCan = current.pouchesPerDay > 0 ? current.pouchesPerCan / current.pouchesPerDay : 0;

  const selectProduct = (id: string) => {
    const next = POUCH_PRODUCTS.find((item) => item.id === id);
    if (!next) return;
    onChange({ ...current, productId: next.id, mgPerPouch: next.mgPerPouch, pouchesPerCan: next.pouchesPerCan });
    if (currency === 'USD' && next.typicalPriceUsd) onCostPerCanChange(next.typicalPriceUsd);
  };

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500/[0.07] to-transparent">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <Icon name="pouch" size={22} />
            </div>
            <div>
              <CardTitle>Nicotine pouches</CardTitle>
              <CardDescription>Tobacco-free pouches used under the lip</CardDescription>
            </div>
          </div>
          <Toggle checked={enabled} onChange={onToggle} ariaLabel="Turn off nicotine pouches" />
        </div>
      </CardHeader>

      <CardContent className="space-y-7">
        <section aria-labelledby="pouch-product-heading">
          <StepHeading id="pouch-product-heading" step={1} title="Which pouch?" accent="emerald" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {POUCH_PRODUCTS.map((item) => {
              const selected = current.productId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectProduct(item.id)}
                  aria-pressed={selected}
                  className={`rounded-xl border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                    selected
                      ? 'border-emerald-500/60 bg-emerald-500/10'
                      : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }`}
                >
                  <span className={`block text-sm font-medium ${selected ? 'text-emerald-200' : 'text-zinc-200'}`}>
                    {item.name}
                  </span>
                  <span className="mt-1 block text-[11px] text-zinc-500">{item.pouchesPerCan} per can</span>
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="pouch-count-heading">
          <StepHeading id="pouch-count-heading" step={2} title="How many pouches a day?" accent="emerald" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,180px)_1fr] sm:items-start">
            <NumberInput
              label="Pouches per day"
              value={current.pouchesPerDay}
              onChange={(event) => update({ pouchesPerDay: Number(event.target.value) || 0 })}
              min={0}
              max={100}
              step={1}
            />
            <div className="flex flex-wrap gap-1.5 sm:pt-7">
              {COUNT_CHIPS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => update({ pouchesPerDay: count })}
                  aria-pressed={current.pouchesPerDay === count}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                    current.pouchesPerDay === count
                      ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'
                      : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
          {daysPerCan > 0 && (
            <p className="mt-2 text-xs text-zinc-500">
              One can lasts about {formatFlexible(daysPerCan, 1)} {daysPerCan === 1 ? 'day' : 'days'}.
            </p>
          )}
        </section>

        <section aria-labelledby="pouch-price-heading">
          <StepHeading id="pouch-price-heading" step={3} title="What do you pay per can?" accent="emerald" />
          <div className="max-w-[220px]">
            <NumberInput
              label={`Price per can (${symbol})`}
              value={costPerCan}
              onChange={(event) => onCostPerCanChange(Number(event.target.value) || 0)}
              min={0}
              max={100000}
              step={0.25}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            ≈ {formatCurrency((current.pouchesPerDay / current.pouchesPerCan) * costPerCan, currency)} a day
          </p>
        </section>

        <div className="grid grid-cols-3 gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-3 text-center">
          <LiveStat value={`${formatNumber(absorbed, absorbed < 10 ? 1 : 0)} mg`} label="nicotine absorbed / day" />
          <LiveStat
            value={formatNumber(absorbed / NICOTINE_PER_CIGARETTE_EQUIVALENT_MG, 0)}
            label="cigarettes’ worth of nicotine"
          />
          <LiveStat value="0 L" label="smoke or vapor inhaled" />
        </div>

        <details className="group rounded-xl border border-zinc-800 bg-zinc-950/30" open={!product}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-inset">
            <span className="flex items-center gap-2">
              <Icon name="settings" size={15} className="text-emerald-400" />
              Custom strength or can size
            </span>
            <Icon name="chevron-down" size={16} className="text-zinc-500 transition-transform group-open:rotate-180" />
          </summary>
          <div className="grid grid-cols-1 gap-5 border-t border-zinc-800 px-4 py-5 sm:grid-cols-2">
            <NumberInput
              label="Nicotine per pouch (mg)"
              value={current.mgPerPouch}
              onChange={(event) =>
                update({ mgPerPouch: Number(event.target.value) || 0, productId: CUSTOM_PRODUCT_ID })
              }
              min={0}
              max={50}
              step={0.5}
              helperText="The mg number printed on the can."
            />
            <NumberInput
              label="Pouches per can"
              value={current.pouchesPerCan}
              onChange={(event) =>
                update({
                  pouchesPerCan: Math.max(1, Math.round(Number(event.target.value) || 1)),
                  productId: CUSTOM_PRODUCT_ID,
                })
              }
              min={1}
              max={100}
              step={1}
            />
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
