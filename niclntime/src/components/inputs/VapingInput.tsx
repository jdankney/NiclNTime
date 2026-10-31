'use client';

import {
  VapingInput,
  DeviceType,
  DEVICE_TYPE_LABELS,
  DEVICE_SHORT_LABELS,
  DEVICE_DESCRIPTIONS,
  DEVICE_ABSORPTION_RATES,
  DEVICE_AEROSOL_PER_PUFF_ML,
} from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { NumberInput, Toggle } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { formatNumber } from '@/lib/calculations';

interface VapingInputProps {
  value: VapingInput | null;
  onChange: (value: VapingInput | null) => void;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const DEFAULT_VAPING: VapingInput = {
  hitsPerDay: 100,
  deviceType: 'pod',
  nicotineConcentration: 20,
  volumePerDay: 2,
};

const PRESETS: Array<{ label: string; detail: string; value: VapingInput }> = [
  {
    label: 'Light pod',
    detail: '10 mg · 1 mL · 50 puffs',
    value: { hitsPerDay: 50, deviceType: 'pod', nicotineConcentration: 10, volumePerDay: 1 },
  },
  {
    label: 'Standard pod',
    detail: '20 mg · 2 mL · 100 puffs',
    value: { hitsPerDay: 100, deviceType: 'pod', nicotineConcentration: 20, volumePerDay: 2 },
  },
  {
    label: 'Geek / Elf Bar',
    detail: '20 mg · 2 mL · 200 puffs',
    value: { hitsPerDay: 200, deviceType: 'geek-bar', nicotineConcentration: 20, volumePerDay: 2 },
  },
  {
    label: 'Heavy disposable',
    detail: '50 mg · 5 mL · 300 puffs',
    value: { hitsPerDay: 300, deviceType: 'disposable', nicotineConcentration: 50, volumePerDay: 5 },
  },
  {
    label: 'Cloud chaser',
    detail: '3 mg · 10 mL · 150 puffs',
    value: { hitsPerDay: 150, deviceType: 'fogger', nicotineConcentration: 3, volumePerDay: 10 },
  },
  {
    label: 'Pod mod / AIO',
    detail: '12 mg · 3 mL · 120 puffs',
    value: { hitsPerDay: 120, deviceType: 'pod-mod', nicotineConcentration: 12, volumePerDay: 3 },
  },
  {
    label: 'Squonk / dripper',
    detail: '6 mg · 8 mL · 100 puffs',
    value: { hitsPerDay: 100, deviceType: 'squonk', nicotineConcentration: 6, volumePerDay: 8 },
  },
  {
    label: 'Cigalike',
    detail: '18 mg · 1 mL · 80 puffs',
    value: { hitsPerDay: 80, deviceType: 'cigalike', nicotineConcentration: 18, volumePerDay: 1 },
  },
];

export function VapingInputForm({ value, onChange, enabled, onToggle }: VapingInputProps) {
  const current = value ?? DEFAULT_VAPING;

  const update = (patch: Partial<VapingInput>) => {
    onChange({ ...current, ...patch });
  };

  if (!enabled) {
    return (
      <Card variant="outlined" className="overflow-hidden">
        <CardContent className="py-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <Icon name="wind" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">Vaping module</h3>
                <p className="text-sm text-zinc-500">Track nicotine intake from vapes and e-liquids.</p>
              </div>
            </div>
            <Toggle checked={false} onChange={onToggle} label="Enable" ariaLabel="Enable vaping module" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const absorbedPerDay =
    current.volumePerDay *
    current.nicotineConcentration *
    DEVICE_ABSORPTION_RATES[current.deviceType];

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-cyan-500/[0.07] to-transparent">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <Icon name="wind" size={22} />
            </div>
            <div>
              <CardTitle>Vaping module</CardTitle>
              <CardDescription>Enter your daily vaping habits</CardDescription>
            </div>
          </div>
          <Toggle
            checked={enabled}
            onChange={onToggle}
            label="Enabled"
            ariaLabel="Toggle vaping module"
            className="hidden sm:flex"
          />
          <Toggle
            checked={enabled}
            onChange={onToggle}
            ariaLabel="Toggle vaping module"
            className="sm:hidden"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <NumberInput
            label="Hits / puffs per day"
            value={current.hitsPerDay}
            onChange={(event) => update({ hitsPerDay: Number(event.target.value) || 0 })}
            min={0}
            max={5000}
            step={1}
            helperText="Your best estimate is fine — you can adjust it any time."
          />
          <NumberInput
            label="E-liquid used per day (mL)"
            value={current.volumePerDay}
            onChange={(event) => update({ volumePerDay: Number(event.target.value) || 0 })}
            min={0}
            max={100}
            step={0.1}
            helperText="Total milliliters consumed, not the size of the bottle."
          />
        </div>

        <div>
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <h4 className="text-sm font-medium text-zinc-200">Device type</h4>
              <p className="text-xs text-zinc-500">Absorption and aerosol estimates vary by device.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              {Math.round(DEVICE_ABSORPTION_RATES[current.deviceType] * 100)}% absorption estimate
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(DEVICE_TYPE_LABELS) as DeviceType[]).map((device) => {
              const selected = current.deviceType === device;
              return (
                <button
                  key={device}
                  type="button"
                  onClick={() => update({ deviceType: device })}
                  aria-pressed={selected}
                  className={`group rounded-xl border p-3 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                    selected
                      ? 'border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]'
                      : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-medium ${selected ? 'text-cyan-200' : 'text-zinc-200'}`}>
                      {DEVICE_SHORT_LABELS[device]}
                    </span>
                    <span
                      className={`text-[10px] font-mono rounded px-1.5 py-0.5 ${
                        selected ? 'bg-cyan-400/15 text-cyan-200' : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {Math.round(DEVICE_ABSORPTION_RATES[device] * 100)}%
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] leading-snug text-zinc-500 line-clamp-2">
                    {DEVICE_DESCRIPTIONS[device]}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
            <span>
              Aerosol estimate: <span className="text-zinc-300">{DEVICE_AEROSOL_PER_PUFF_ML[current.deviceType]} mL</span> per puff
            </span>
            <span>
              Absorbed nicotine: <span className="text-cyan-300">{formatNumber(absorbedPerDay, 1)} mg</span> / day
            </span>
          </div>
        </div>

        <div>
          <NumberInput
            label="Nicotine concentration (mg/mL)"
            value={current.nicotineConcentration}
            onChange={(event) => update({ nicotineConcentration: Number(event.target.value) || 0 })}
            min={0}
            max={100}
            step={1}
            helperText="The strength printed on your e-liquid or pod. 20 mg/mL is about 2%."
          />
        </div>

        <div className="pt-1 border-t border-zinc-800/80">
          <div className="flex items-center gap-2 mb-3 pt-5">
            <Icon name="sparkles" size={16} className="text-cyan-400" />
            <h4 className="text-sm font-medium text-zinc-200">Quick presets</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2.5 text-left transition-all hover:border-cyan-500/40 hover:bg-cyan-500/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              >
                <span className="block text-xs font-medium text-zinc-200">{preset.label}</span>
                <span className="mt-0.5 block text-[10px] text-zinc-500">{preset.detail}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
