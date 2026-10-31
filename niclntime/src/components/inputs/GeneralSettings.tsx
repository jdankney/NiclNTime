'use client';

import { UserInputs, CurrencyCode, CURRENCY_OPTIONS, CURRENCIES } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { NumberInput, Slider, Select } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';

interface GeneralSettingsProps {
  value: Pick<UserInputs, 'costPerVapeMl' | 'costPerPack' | 'yearsOfUse' | 'age' | 'currency'>;
  onChange: (
    value: Pick<UserInputs, 'costPerVapeMl' | 'costPerPack' | 'yearsOfUse' | 'age' | 'currency'>
  ) => void;
}

export function GeneralSettings({ value, onChange }: GeneralSettingsProps) {
  const update = (patch: Partial<typeof value>) => onChange({ ...value, ...patch });
  const currency = CURRENCIES[value.currency];

  return (
    <Card variant="default" className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700">
            <Icon name="settings" size={20} />
          </div>
          <div>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Costs, time horizon and currency</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Select
          label="Currency"
          value={value.currency}
          onChange={(event) => update({ currency: event.target.value as CurrencyCode })}
          options={CURRENCY_OPTIONS}
          helperText={`Prices are entered in ${currency.label} (${currency.symbol}).`}
        />

        <div className="grid grid-cols-1 gap-5">
          <NumberInput
            label={`E-liquid cost (${currency.symbol}/mL)`}
            value={value.costPerVapeMl}
            onChange={(event) => update({ costPerVapeMl: Number(event.target.value) || 0 })}
            min={0}
            max={10000}
            step={0.01}
            helperText="Bottle price ÷ milliliters in the bottle."
          />
          <NumberInput
            label={`Cigarette pack cost (${currency.symbol})`}
            value={value.costPerPack}
            onChange={(event) => update({ costPerPack: Number(event.target.value) || 0 })}
            min={0}
            max={100000}
            step={0.5}
            helperText="Price of one standard pack of 20 cigarettes."
          />
        </div>

        <div className="space-y-5 border-t border-zinc-800/80 pt-5">
          <Slider
            label="How long have you used nicotine?"
            min={0}
            max={60}
            value={value.yearsOfUse}
            onChange={(yearsOfUse) => update({ yearsOfUse })}
            formatValue={(years) => `${years} ${years === 1 ? 'year' : 'years'}`}
            helperText="Used for duration-related risk and life-lost estimates."
          />
          <Slider
            label="Current age"
            min={10}
            max={100}
            value={value.age}
            onChange={(age) => update({ age })}
            formatValue={(age) => `${age} yrs`}
            helperText="Lifetime cost projects current spending until age 80."
          />
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
          <div className="flex items-start gap-3">
            <Icon name="shield" size={18} className="mt-0.5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-zinc-200">Private by design</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                Your numbers stay in this browser. No account, no server, no tracking. Share links only
                contain the values you choose to share.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
