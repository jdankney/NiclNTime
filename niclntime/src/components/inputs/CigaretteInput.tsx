'use client';

import {
  CigaretteInput,
  CigaretteType,
  CIGARETTE_TYPE_LABELS,
  CIGARETTE_NICOTINE_MG,
  CIGARETTE_TAR_MG,
  CIGARETTE_CO_MG,
} from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { NumberInput, Toggle } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { formatNumber } from '@/lib/calculations';

interface CigaretteInputProps {
  value: CigaretteInput | null;
  onChange: (value: CigaretteInput | null) => void;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const DEFAULT_CIGARETTES: CigaretteInput = {
  cigarettesPerDay: 10,
  type: 'regular',
};

const PRESETS: Array<{ label: string; detail: string; value: CigaretteInput }> = [
  { label: 'Light', detail: '5 / day', value: { cigarettesPerDay: 5, type: 'light' } },
  { label: 'Moderate', detail: '10 / day', value: { cigarettesPerDay: 10, type: 'regular' } },
  { label: 'Heavy', detail: '20 / day', value: { cigarettesPerDay: 20, type: 'full-flavor' } },
  { label: 'Chain', detail: '40 / day', value: { cigarettesPerDay: 40, type: 'full-flavor' } },
];

export function CigaretteInputForm({ value, onChange, enabled, onToggle }: CigaretteInputProps) {
  const current = value ?? DEFAULT_CIGARETTES;

  const update = (patch: Partial<CigaretteInput>) => {
    onChange({ ...current, ...patch });
  };

  if (!enabled) {
    return (
      <Card variant="outlined" className="overflow-hidden">
        <CardContent className="py-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Icon name="activity" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">Cigarette module</h3>
                <p className="text-sm text-zinc-500">Track nicotine, tar and carbon monoxide exposure.</p>
              </div>
            </div>
            <Toggle checked={false} onChange={onToggle} label="Enable" ariaLabel="Enable cigarette module" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-500/[0.07] to-transparent">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Icon name="activity" size={22} />
            </div>
            <div>
              <CardTitle>Cigarette module</CardTitle>
              <CardDescription>Enter your daily cigarette consumption</CardDescription>
            </div>
          </div>
          <Toggle
            checked={enabled}
            onChange={onToggle}
            label="Enabled"
            ariaLabel="Toggle cigarette module"
            className="hidden sm:flex"
          />
          <Toggle
            checked={enabled}
            onChange={onToggle}
            ariaLabel="Toggle cigarette module"
            className="sm:hidden"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-7">
        <NumberInput
          label="Cigarettes per day"
          value={current.cigarettesPerDay}
          onChange={(event) => update({ cigarettesPerDay: Number(event.target.value) || 0 })}
          min={0}
          max={200}
          step={1}
          helperText="A standard pack contains 20 cigarettes."
        />

        <div>
          <div className="mb-3">
            <h4 className="text-sm font-medium text-zinc-200">Cigarette strength</h4>
            <p className="text-xs text-zinc-500">Typical published tar and nicotine yields per cigarette.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                    {formatNumber(CIGARETTE_NICOTINE_MG[type], 1)} mg nic · {CIGARETTE_TAR_MG[type]} mg tar
                  </span>
                  <span className="block text-[11px] text-zinc-600">
                    {CIGARETTE_CO_MG[type]} mg CO
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
          <div className="flex items-start gap-3">
            <Icon name="info" size={18} className="mt-0.5 shrink-0 text-amber-300" />
            <p className="text-xs leading-relaxed text-amber-100/70">
              Yields are based on smoking-machine averages. How you smoke can change actual exposure.
              This tool is educational and does not assess individual health.
            </p>
          </div>
        </div>

        <div className="pt-1 border-t border-zinc-800/80">
          <div className="flex items-center gap-2 mb-3 pt-5">
            <Icon name="sparkles" size={16} className="text-amber-400" />
            <h4 className="text-sm font-medium text-zinc-200">Quick presets</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2.5 text-left transition-all hover:border-amber-500/40 hover:bg-amber-500/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
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
