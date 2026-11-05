'use client';

import {
  CUSTOM_PRODUCT_ID,
  CURRENCIES,
  DEFAULT_VAPING,
  DEVICE_PROFILES,
  DEVICE_TYPES,
  NICOTINE_PER_CIGARETTE_EQUIVALENT_MG,
  NICOTINE_STRENGTH_PRESETS,
  NICOTINE_TYPE_INFO,
  VAPE_NICOTINE_ABSORPTION,
  VAPE_NICOTINE_ABSORPTION_RANGE,
  VAPE_PRODUCTS,
  type CurrencyCode,
  type DeviceType,
  type NicotineType,
  type VapingInput,
} from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { NumberInput, Toggle } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import {
  estimatePuffsPerDay,
  formatCurrency,
  formatFlexible,
  formatNumber,
  mgPerMlToPercent,
  vapeNicotineAbsorbedMg,
} from '@/lib/calculations';

interface VapingInputProps {
  value: VapingInput | null;
  onChange: (value: VapingInput | null) => void;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  costPerMl: number;
  onCostPerMlChange: (costPerMl: number) => void;
  currency: CurrencyCode;
}

/** Sensible starting point for "how long does one last" when switching device category. */
const DEFAULT_DAYS: Record<DeviceType, number> = {
  disposable: 7,
  'prefilled-pod': 1,
  'refillable-pod': 10,
  'sub-ohm': 14,
};

const DAY_CHIPS = [1, 2, 3, 5, 7, 14];

const NICOTINE_TYPES: NicotineType[] = ['salt', 'freebase'];

/** Freebase above this strength is unusually harsh — usually a sign the liquid is actually a salt. */
const FREEBASE_HARSH_MG_PER_ML = 20;

const round = (value: number, decimals: number) => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

export function VapingInputForm({
  value,
  onChange,
  enabled,
  onToggle,
  costPerMl,
  onCostPerMlChange,
  currency,
}: VapingInputProps) {
  const current = value ?? DEFAULT_VAPING;
  const profile = DEVICE_PROFILES[current.deviceType];
  const product = VAPE_PRODUCTS.find((item) => item.id === current.productId);
  const symbol = CURRENCIES[currency].symbol;
  const unit = profile.unit;

  const daysPerUnit = current.volumePerDay > 0 ? current.unitSizeMl / current.volumePerDay : 0;
  const pricePerUnit = costPerMl * current.unitSizeMl;
  const absorbed = vapeNicotineAbsorbedMg(current);

  const update = (patch: Partial<VapingInput>) => onChange({ ...current, ...patch });

  const setDays = (days: number) => {
    const volumePerDay = days > 0 ? current.unitSizeMl / days : 0;
    update({ volumePerDay, hitsPerDay: estimatePuffsPerDay(volumePerDay, current.deviceType) });
  };

  const selectProduct = (productId: string) => {
    const next = VAPE_PRODUCTS.find((item) => item.id === productId);
    if (!next) {
      update({ productId: CUSTOM_PRODUCT_ID });
      return;
    }
    const days =
      next.deviceType === current.deviceType && daysPerUnit > 0 ? daysPerUnit : DEFAULT_DAYS[next.deviceType];
    const volumePerDay = next.unitSizeMl / days;
    onChange({
      productId: next.id,
      deviceType: next.deviceType,
      nicotineConcentration: next.nicotineMgPerMl,
      nicotineType: next.nicotineType,
      unitSizeMl: next.unitSizeMl,
      volumePerDay,
      hitsPerDay: estimatePuffsPerDay(volumePerDay, next.deviceType),
    });
    // Only pre-fill a price when we have a sensible one for this currency.
    if (currency === 'USD' && next.typicalPriceUsd) {
      onCostPerMlChange(next.typicalPriceUsd / next.unitSizeMl);
    } else if (pricePerUnit > 0) {
      onCostPerMlChange(pricePerUnit / next.unitSizeMl);
    }
  };

  if (!enabled) {
    return (
      <ModuleOff
        onToggle={onToggle}
        title="Vaping"
        description="Disposables like Geek Bar & Raz, pods like JUUL & Vuse, or refillables."
      />
    );
  }

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-cyan-500/[0.07] to-transparent">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
              <Icon name="wind" size={22} />
            </div>
            <div>
              <CardTitle>Vaping</CardTitle>
              <CardDescription>Three quick questions — fine-tune below if you like</CardDescription>
            </div>
          </div>
          <Toggle checked={enabled} onChange={onToggle} ariaLabel="Turn off vaping" />
        </div>
      </CardHeader>

      <CardContent className="space-y-7">
        {/* Step 1: product */}
        <section aria-labelledby="vape-product-heading">
          <StepHeading id="vape-product-heading" step={1} title="What do you vape?" hint="Pick the closest match" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {VAPE_PRODUCTS.map((item) => {
              const selected = current.productId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectProduct(item.id)}
                  aria-pressed={selected}
                  className={`rounded-xl border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                    selected
                      ? 'border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]'
                      : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }`}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className={`text-sm font-medium leading-snug ${selected ? 'text-cyan-200' : 'text-zinc-200'}`}>
                      {item.name}
                    </span>
                    {item.market !== 'Global' && (
                      <span className="shrink-0 rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[9px] text-zinc-400">
                        {item.market}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-[11px] text-zinc-500">{item.detail}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => selectProduct(CUSTOM_PRODUCT_ID)}
              aria-pressed={!product}
              className={`rounded-xl border border-dashed p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                !product
                  ? 'border-cyan-500/60 bg-cyan-500/10'
                  : 'border-zinc-700 bg-zinc-950/20 hover:border-zinc-600'
              }`}
            >
              <span className={`block text-sm font-medium ${!product ? 'text-cyan-200' : 'text-zinc-300'}`}>
                Something else
              </span>
              <span className="mt-1 block text-[11px] text-zinc-500">Enter your own specs below</span>
            </button>
          </div>
          {product?.ratedPuffs && (
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">
              The {formatNumber(product.ratedPuffs)}-puff rating is measured with short lab puffs. Real
              devices usually give far fewer, so this tool works from the liquid you use instead.
            </p>
          )}
        </section>

        {/* Step 2: how fast */}
        <section aria-labelledby="vape-usage-heading">
          <StepHeading
            id="vape-usage-heading"
            step={2}
            title={`How long does one ${unit} last you?`}
            hint={`${formatFlexible(current.unitSizeMl, 1)} mL per ${unit}`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,180px)_1fr] sm:items-start">
            <NumberInput
              label={`Days per ${unit}`}
              value={daysPerUnit > 0 ? round(daysPerUnit, 1) : ''}
              onChange={(event) => setDays(Number(event.target.value) || 0)}
              min={0}
              max={365}
              step={0.5}
              rightIcon={<span className="text-xs">days</span>}
            />
            <div className="flex flex-wrap gap-1.5 sm:pt-7">
              {DAY_CHIPS.map((days) => {
                const selected = Math.abs(daysPerUnit - days) < 0.05;
                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDays(days)}
                    aria-pressed={selected}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                      selected
                        ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200'
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {days === 1 ? '1 day' : days === 7 ? '1 week' : days === 14 ? '2 weeks' : `${days} days`}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            That’s about <span className="text-zinc-300">{formatFlexible(current.volumePerDay, 2)} mL</span> of
            e-liquid a day
            {daysPerUnit > 0 && (
              <> — roughly {formatFlexible(7 / daysPerUnit, 1)} {unit}s a week.</>
            )}
          </p>
        </section>

        {/* Step 3: price */}
        <section aria-labelledby="vape-price-heading">
          <StepHeading id="vape-price-heading" step={3} title={`What do you pay per ${unit}?`} />
          <div className="max-w-[220px]">
            <NumberInput
              label={`Price per ${unit} (${symbol})`}
              value={round(pricePerUnit, 2)}
              onChange={(event) =>
                onCostPerMlChange(current.unitSizeMl > 0 ? (Number(event.target.value) || 0) / current.unitSizeMl : 0)
              }
              min={0}
              max={1_000_000}
              step={0.5}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            ≈ {formatCurrency(costPerMl * current.volumePerDay, currency)} a day ·{' '}
            {formatCurrency(costPerMl, currency)} per mL
          </p>
        </section>

        {/* Live summary */}
        <div className="grid grid-cols-3 gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] p-3 text-center">
          <LiveStat
            value={`${formatNumber(absorbed, absorbed < 10 ? 1 : 0)} mg`}
            label={`nicotine absorbed / day (likely ${formatNumber(
              current.volumePerDay * current.nicotineConcentration * VAPE_NICOTINE_ABSORPTION_RANGE[0]
            )}–${formatNumber(current.volumePerDay * current.nicotineConcentration * VAPE_NICOTINE_ABSORPTION_RANGE[1])})`}
          />
          <LiveStat
            value={formatNumber(absorbed / NICOTINE_PER_CIGARETTE_EQUIVALENT_MG, 0)}
            label="cigarettes’ worth of nicotine"
          />
          <LiveStat value={formatNumber(current.hitsPerDay)} label="puffs / day (est.)" />
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3.5">
          <span
            className={`mt-0.5 shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${
              current.nicotineType === 'salt'
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                : 'border-zinc-600 bg-zinc-800 text-zinc-300'
            }`}
          >
            {NICOTINE_TYPE_INFO[current.nicotineType].short}
          </span>
          <p className="text-[11px] leading-relaxed text-zinc-400">
            {current.nicotineType === 'salt' ? (
              <>
                <span className="text-zinc-200">Nicotine salt</span> hits faster with a higher, cigarette-like
                peak, which makes it easier to get hooked on. Salts are also what makes{' '}
                {formatFlexible(mgPerMlToPercent(current.nicotineConcentration), 1)}% strengths smooth enough to
                vape — and strength is the biggest driver of how much nicotine you get.
              </>
            ) : (
              <>
                <span className="text-zinc-200">Freebase</span> nicotine is harsher, so it’s usually vaped at low
                strengths. It reaches the blood more slowly and peaks lower than a nicotine salt at the same
                strength.
              </>
            )}{' '}
            <span className="text-zinc-500">Change it under “Fine-tune”.</span>
          </p>
        </div>

        {/* Fine-tune */}
        <details className="group rounded-xl border border-zinc-800 bg-zinc-950/30" open={!product}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-inset rounded-xl">
            <span className="flex items-center gap-2">
              <Icon name="settings" size={15} className="text-cyan-400" />
              Fine-tune nicotine type, strength, size and puffs
            </span>
            <Icon name="chevron-down" size={16} className="text-zinc-500 transition-transform group-open:rotate-180" />
          </summary>
          <div className="space-y-6 border-t border-zinc-800 px-4 py-5">
            <div>
              <h4 className="mb-2 text-sm font-medium text-zinc-200">Device type</h4>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DEVICE_TYPES.map((device) => {
                  const selected = current.deviceType === device;
                  return (
                    <button
                      key={device}
                      type="button"
                      onClick={() =>
                        update({
                          deviceType: device,
                          nicotineType: DEVICE_PROFILES[device].defaultNicotineType,
                          productId: CUSTOM_PRODUCT_ID,
                          hitsPerDay: estimatePuffsPerDay(current.volumePerDay, device),
                        })
                      }
                      aria-pressed={selected}
                      title={DEVICE_PROFILES[device].description}
                      className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                        selected
                          ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200'
                          : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {DEVICE_PROFILES[device].shortLabel}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] text-zinc-600">{profile.description}</p>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-zinc-200">Nicotine type</h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="group" aria-label="Nicotine type">
                {NICOTINE_TYPES.map((type) => {
                  const selected = current.nicotineType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update({ nicotineType: type, productId: CUSTOM_PRODUCT_ID })}
                      aria-pressed={selected}
                      className={`rounded-xl border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                        selected
                          ? 'border-cyan-500/60 bg-cyan-500/10'
                          : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/60'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-medium ${selected ? 'text-cyan-200' : 'text-zinc-200'}`}>
                          {NICOTINE_TYPE_INFO[type].label}
                        </span>
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                          ~{Math.round(VAPE_NICOTINE_ABSORPTION[type] * 100)}% absorbed
                        </span>
                      </span>
                      <span className="mt-1 block text-[11px] leading-snug text-zinc-500">
                        {NICOTINE_TYPE_INFO[type].description}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">
                Not sure? Look for “salt”, “nic salt” or “benzoate” on the box. If it’s a disposable or a pre-filled
                pod, it’s almost certainly a salt.
              </p>
            </div>

            <div>
              <NumberInput
                label={`Nicotine strength (mg/mL) — ${formatFlexible(mgPerMlToPercent(current.nicotineConcentration), 1)}%`}
                value={current.nicotineConcentration}
                onChange={(event) =>
                  update({ nicotineConcentration: Number(event.target.value) || 0, productId: CUSTOM_PRODUCT_ID })
                }
                min={0}
                max={100}
                step={1}
                helperText="Check the box or pod. On US labels 5% ≈ 50 mg/mL; UK/EU products are capped at 20 mg/mL (2%)."
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {NICOTINE_STRENGTH_PRESETS.map((mg) => (
                  <button
                    key={mg}
                    type="button"
                    onClick={() => update({ nicotineConcentration: mg, productId: CUSTOM_PRODUCT_ID })}
                    aria-pressed={current.nicotineConcentration === mg}
                    className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                      current.nicotineConcentration === mg
                        ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200'
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-500 hover:text-zinc-200'
                    }`}
                  >
                    {mg} mg · {formatFlexible(mg / 10, 1)}%
                  </button>
                ))}
              </div>
              {current.nicotineType === 'freebase' && current.nicotineConcentration > FREEBASE_HARSH_MG_PER_ML && (
                <p className="mt-2 flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] p-2.5 text-[11px] leading-relaxed text-amber-100/80">
                  <Icon name="alert" size={14} className="mt-0.5 shrink-0 text-amber-300" />
                  Freebase above {FREEBASE_HARSH_MG_PER_ML} mg/mL is very harsh and uncommon. Double-check the label —
                  this strength is usually a nicotine salt.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <NumberInput
                label={`Size of one ${unit} (mL)`}
                value={current.unitSizeMl}
                onChange={(event) => {
                  const unitSizeMl = Math.max(Number(event.target.value) || 0, 0.1);
                  // Keep the price per unit stable while the size changes.
                  onCostPerMlChange(pricePerUnit / unitSizeMl);
                  update({ unitSizeMl, productId: CUSTOM_PRODUCT_ID });
                }}
                min={0.1}
                max={1000}
                step={0.1}
              />
              <NumberInput
                label="E-liquid used per day (mL)"
                value={round(current.volumePerDay, 2)}
                onChange={(event) => {
                  const volumePerDay = Number(event.target.value) || 0;
                  update({ volumePerDay, hitsPerDay: estimatePuffsPerDay(volumePerDay, current.deviceType) });
                }}
                min={0}
                max={100}
                step={0.1}
              />
              <NumberInput
                label="Puffs per day"
                value={current.hitsPerDay}
                onChange={(event) => update({ hitsPerDay: Math.round(Number(event.target.value) || 0) })}
                min={0}
                max={5000}
                step={10}
                helperText="Estimated from liquid used. Only affects inhaled volume and time."
              />
            </div>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}

export function StepHeading({
  id,
  step,
  title,
  hint,
  accent = 'cyan',
}: {
  id: string;
  step: number;
  title: string;
  hint?: string;
  accent?: 'cyan' | 'amber' | 'emerald';
}) {
  const accents = {
    cyan: 'bg-cyan-400/15 text-cyan-300 border-cyan-500/30',
    amber: 'bg-amber-400/15 text-amber-300 border-amber-500/30',
    emerald: 'bg-emerald-400/15 text-emerald-300 border-emerald-500/30',
  };
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h4 id={id} className="flex items-center gap-2 text-sm font-medium text-zinc-200">
        <span className={`grid h-5 w-5 place-items-center rounded-full border font-mono text-[10px] ${accents[accent]}`}>
          {step}
        </span>
        {title}
      </h4>
      {hint && <span className="shrink-0 text-[11px] text-zinc-500">{hint}</span>}
    </div>
  );
}

export function LiveStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-mono text-lg font-semibold text-zinc-50">{value}</div>
      <div className="mt-0.5 text-[10px] leading-tight text-zinc-500">{label}</div>
    </div>
  );
}

export function ModuleOff({
  onToggle,
  title,
  description,
  icon = 'wind',
  accent = 'cyan',
}: {
  onToggle: (enabled: boolean) => void;
  title: string;
  description: string;
  icon?: 'wind' | 'activity' | 'pouch';
  accent?: 'cyan' | 'amber' | 'emerald';
}) {
  const accents = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  };
  return (
    <Card variant="outlined" className="overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(true)}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-zinc-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-inset sm:px-6"
      >
        <span className="flex items-center gap-4">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border ${accents[accent]}`}>
            <Icon name={icon} size={24} />
          </span>
          <span>
            <span className="block font-semibold text-zinc-100">{title}</span>
            <span className="block text-sm text-zinc-500">{description}</span>
          </span>
        </span>
        <span className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200">
          + Add
        </span>
      </button>
    </Card>
  );
}
