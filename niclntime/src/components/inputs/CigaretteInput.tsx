'use client';

import {
  CIGARETTE_CO_MG,
  CIGARETTE_NICOTINE_MG,
  CIGARETTE_TAR_MG,
  CIGARETTE_TYPE_LABELS,
  CURRENCIES,
  DEFAULT_CIGARETTES,
  MINUTES_OF_LIFE_PER_CIGARETTE,
  type CigaretteInput,
  type CigaretteType,
  type CurrencyCode,
} from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { NumberInput, Toggle } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { formatCurrency, formatDuration, formatNumber } from '@/lib/calculations';
import { LiveStat, ModuleOff, StepHeading } from './VapingInput';

interface CigaretteInputProps {
  value: CigaretteInput | null;
  onChange: (value: CigaretteInput | null) => void;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  costPerPack: number;
  onCostPerPackChange: (cost: number) => void;
  currency: CurrencyCode;
}

const countChips = (packSize: number) => [
  { label: '1–2', value: 2 },
  { label: '5', value: 5 },
  { label: '½ pack', value: Math.round(packSize / 2) },
  { label: '1 pack', value: packSize },
  { label: '1½ packs', value: Math.round(packSize * 1.5) },
  { label: '2 packs', value: packSize * 2 },
];

const PACK_SIZES = [20, 25];

export function CigaretteInputForm({
  value,
  onChange,
  enabled,
  onToggle,
  costPerPack,
  onCostPerPackChange,
  currency,
}: CigaretteInputProps) {
  const current = value ?? DEFAULT_CIGARETTES;
  const symbol = CURRENCIES[currency].symbol;
  const update = (patch: Partial<CigaretteInput>) => onChange({ ...current, ...patch });

  if (!enabled) {
    return (
      <ModuleOff
        onToggle={onToggle}
        title="Cigarettes"
        description="Factory-made or roll-your-own — even a few a day counts."
        icon="activity"
        accent="amber"
      />
    );
  }

  const dailyCost = (current.cigarettesPerDay / current.packSize) * costPerPack;
  const chips = countChips(current.packSize);

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-500/[0.07] to-transparent">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
              <Icon name="activity" size={22} />
            </div>
            <div>
              <CardTitle>Cigarettes</CardTitle>
              <CardDescription>On an average day</CardDescription>
            </div>
          </div>
          <Toggle checked={enabled} onChange={onToggle} ariaLabel="Turn off cigarettes" />
        </div>
      </CardHeader>

      <CardContent className="space-y-7">
        <section aria-labelledby="cig-count-heading">
          <StepHeading id="cig-count-heading" step={1} title="How many a day?" accent="amber" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,180px)_1fr] sm:items-start">
            <NumberInput
              label="Cigarettes per day"
              value={current.cigarettesPerDay}
              onChange={(event) => update({ cigarettesPerDay: Math.round(Number(event.target.value) || 0) })}
              min={0}
              max={200}
              step={1}
            />
            <div className="flex flex-wrap gap-1.5 sm:pt-7">
              {chips.map((chip) => {
                const selected = current.cigarettesPerDay === chip.value;
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => update({ cigarettesPerDay: chip.value })}
                    aria-pressed={selected}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 ${
                      selected
                        ? 'border-amber-500/60 bg-amber-500/10 text-amber-200'
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Roll-your-own? Count each rollie as one cigarette.
          </p>
        </section>

        <section aria-labelledby="cig-price-heading">
          <StepHeading id="cig-price-heading" step={2} title="What do you pay per pack?" accent="amber" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,220px)_1fr] sm:items-start">
            <NumberInput
              label={`Pack price (${symbol})`}
              value={costPerPack}
              onChange={(event) => onCostPerPackChange(Number(event.target.value) || 0)}
              min={0}
              max={100000}
              step={0.5}
            />
            <div className="sm:pt-7">
              <div className="flex items-center gap-1.5" role="group" aria-label="Cigarettes per pack">
                <span className="mr-1 text-xs text-zinc-500">Pack of</span>
                {PACK_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => update({ packSize: size })}
                    aria-pressed={current.packSize === size}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 ${
                      current.packSize === size
                        ? 'border-amber-500/60 bg-amber-500/10 text-amber-200'
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-zinc-500">≈ {formatCurrency(dailyCost, currency)} a day</p>
        </section>

        <div className="grid grid-cols-3 gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-3 text-center">
          <LiveStat
            value={`${formatNumber(current.cigarettesPerDay * CIGARETTE_NICOTINE_MG[current.type], 0)} mg`}
            label="nicotine absorbed / day"
          />
          <LiveStat
            value={`${formatNumber(current.cigarettesPerDay * CIGARETTE_TAR_MG[current.type])} mg`}
            label="tar / day"
          />
          <LiveStat
            value={formatDuration(current.cigarettesPerDay * MINUTES_OF_LIFE_PER_CIGARETTE)}
            label="life expectancy / day"
          />
        </div>

        <details className="group rounded-xl border border-zinc-800 bg-zinc-950/30">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-inset">
            <span className="flex items-center gap-2">
              <Icon name="settings" size={15} className="text-amber-400" />
              Cigarette strength
            </span>
            <Icon name="chevron-down" size={16} className="text-zinc-500 transition-transform group-open:rotate-180" />
          </summary>
          <div className="space-y-3 border-t border-zinc-800 px-4 py-5">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {(Object.keys(CIGARETTE_TYPE_LABELS) as CigaretteType[]).map((type) => {
                const selected = current.type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => update({ type })}
                    aria-pressed={selected}
                    className={`rounded-xl border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 ${
                      selected
                        ? 'border-amber-500/60 bg-amber-500/10'
                        : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/60'
                    }`}
                  >
                    <span className={`block text-sm font-medium ${selected ? 'text-amber-200' : 'text-zinc-200'}`}>
                      {CIGARETTE_TYPE_LABELS[type]}
                    </span>
                    <span className="mt-1 block text-[11px] text-zinc-500">
                      ~{formatNumber(CIGARETTE_NICOTINE_MG[type], 1)} mg nicotine absorbed
                    </span>
                    <span className="block text-[11px] text-zinc-600">
                      {CIGARETTE_TAR_MG[type]} mg tar · {CIGARETTE_CO_MG[type]} mg CO (machine yield)
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-500">
              “Light” cigarettes aren’t meaningfully safer: people inhale more deeply to get the same
              nicotine, which is why “light” and “mild” labels are banned in the US, UK and EU. Tar and CO
              are smoking-machine figures — real intake is usually higher.
            </p>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
