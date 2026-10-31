'use client';

import { CalculatedMetrics } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { formatNumber } from '@/lib/calculations';

interface LungsVisualizerProps {
  metrics: CalculatedMetrics;
}

const REFERENCE_VOLUME_LITERS = 12;

export function LungsVisualizer({ metrics }: LungsVisualizerProps) {
  const exposureRatio = Math.min(metrics.dailyAerosolVolumeLiters / REFERENCE_VOLUME_LITERS, 1);
  const exposurePercent = Math.round(exposureRatio * 100);
  const particleCount = Math.min(Math.floor(metrics.dailyAerosolVolumeLiters * 14), 90);

  const status =
    exposurePercent <= 25
      ? {
          label: 'Lower exposure',
          color: 'text-emerald-300',
          border: 'border-emerald-500/40 bg-emerald-500/10',
          stroke: '#34d399',
          message:
            'Your estimated inhaled aerosol or smoke volume is relatively low, but nicotine still affects the cardiovascular system.',
        }
      : exposurePercent <= 60
        ? {
            label: 'Moderate exposure',
            color: 'text-amber-300',
            border: 'border-amber-500/40 bg-amber-500/10',
            stroke: '#fbbf24',
            message:
              'Your lungs are processing a noticeable volume of aerosol or smoke every day. Reducing puffs or cigarettes lowers this load.',
          }
        : {
            label: 'Higher exposure',
            color: 'text-red-300',
            border: 'border-red-500/40 bg-red-500/10',
            stroke: '#f87171',
            message:
              'This is a high estimated inhaled volume. Consider talking with a healthcare professional about ways to reduce exposure.',
          };

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
            <Icon name="lungs" size={20} />
          </div>
          <div>
            <CardTitle>Respiratory load</CardTitle>
            <CardDescription>Illustrative view of daily inhaled volume</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <div className="flex flex-col lg:flex-row items-center gap-7">
          <div className="relative w-full max-w-[280px] shrink-0">
            <div className="relative aspect-square">
              <div
                className="absolute inset-6 rounded-full blur-3xl opacity-30 transition-colors duration-1000"
                style={{ background: status.stroke }}
              />
              <svg
                viewBox="0 0 240 240"
                className="relative h-full w-full"
                role="img"
                aria-label={`Illustrative lung exposure graphic: ${exposurePercent}% of the reference inhaled volume`}
              >
                <defs>
                  <linearGradient id="lung-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={status.stroke} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={status.stroke} stopOpacity="0.04" />
                  </linearGradient>
                  <filter id="lung-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="4" />
                  </filter>
                  <clipPath id="lung-clip">
                    <path d="M112 78 C95 60 68 58 52 74 C34 92 26 124 32 158 C37 188 56 206 80 204 C103 202 112 181 112 154 Z" />
                    <path d="M128 78 C145 60 172 58 188 74 C206 92 214 124 208 158 C203 188 184 206 160 204 C137 202 128 181 128 154 Z" />
                  </clipPath>
                </defs>

                <path
                  d="M116 26h8v46h-8z"
                  fill={status.stroke}
                  opacity="0.45"
                  rx="4"
                />
                <path
                  d="M120 68 88 94M120 68l32 26"
                  fill="none"
                  stroke={status.stroke}
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.45"
                />

                <g filter="url(#lung-soft-glow)" opacity="0.55">
                  <path
                    d="M112 78 C95 60 68 58 52 74 C34 92 26 124 32 158 C37 188 56 206 80 204 C103 202 112 181 112 154 Z"
                    fill={status.stroke}
                  />
                  <path
                    d="M128 78 C145 60 172 58 188 74 C206 92 214 124 208 158 C203 188 184 206 160 204 C137 202 128 181 128 154 Z"
                    fill={status.stroke}
                  />
                </g>

                <g className="transition-all duration-1000">
                  <path
                    d="M112 78 C95 60 68 58 52 74 C34 92 26 124 32 158 C37 188 56 206 80 204 C103 202 112 181 112 154 Z"
                    fill="url(#lung-fill)"
                    stroke={status.stroke}
                    strokeWidth="2"
                    strokeOpacity="0.75"
                  />
                  <path
                    d="M128 78 C145 60 172 58 188 74 C206 92 214 124 208 158 C203 188 184 206 160 204 C137 202 128 181 128 154 Z"
                    fill="url(#lung-fill)"
                    stroke={status.stroke}
                    strokeWidth="2"
                    strokeOpacity="0.75"
                  />
                </g>

                {exposureRatio > 0.03 && (
                  <g clipPath="url(#lung-clip)">
                    {Array.from({ length: particleCount }, (_, index) => {
                      const x = 38 + ((index * 47) % 164);
                      const y = 72 + ((index * 31) % 128);
                      const radius = 1.2 + (index % 3) * 0.75;
                      return (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r={radius}
                          fill={index % 5 === 0 ? '#f87171' : index % 3 === 0 ? '#fb923c' : '#fbbf24'}
                          opacity={0.38 + (index % 3) * 0.14}
                          className="animate-particle"
                          style={{
                            animationDelay: `${(index % 12) * 0.22}s`,
                            animationDuration: `${3.5 + (index % 4) * 0.7}s`,
                          }}
                        />
                      );
                    })}
                  </g>
                )}

                <path
                  d="M116 26h8v46h-8z"
                  fill={status.stroke}
                  opacity="0.7"
                />
                <path
                  d="M120 68 88 94M120 68l32 26"
                  fill="none"
                  stroke={status.stroke}
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>

              <div className="absolute inset-x-0 bottom-1 flex justify-center">
                <div className={`rounded-2xl border px-4 py-2 text-center backdrop-blur-md ${status.border}`}>
                  <div className={`font-mono text-2xl font-bold ${status.color}`}>{exposurePercent}%</div>
                  <div className="text-[10px] uppercase tracking-wide text-zinc-500">relative load</div>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-zinc-200">Daily inhaled volume</h4>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${status.border} ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <div className="space-y-3">
                <VolumeBar
                  label="Aerosol / smoke"
                  value={metrics.dailyAerosolVolumeLiters}
                  max={REFERENCE_VOLUME_LITERS}
                  color="bg-cyan-400"
                  unit="L"
                />
                <VolumeBar
                  label="Reference scale"
                  value={REFERENCE_VOLUME_LITERS}
                  max={REFERENCE_VOLUME_LITERS}
                  color="bg-zinc-600"
                  unit="L"
                  muted
                />
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
                The reference scale is a visual comparison point, not a medical threshold.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <MetricTile label="Daily" value={formatNumber(metrics.dailyAerosolVolumeLiters, 1)} unit="L" color="text-cyan-300" />
              <MetricTile label="Yearly" value={formatNumber(metrics.yearlyAerosolVolumeLiters, 0)} unit="L" color="text-blue-300" />
              <MetricTile label="Time" value={formatNumber(metrics.minutesPerDaySpent, 0)} unit="min/day" color="text-amber-300" />
              <MetricTile label="Particles" value={formatNumber(particleCount)} unit="shown" color="text-purple-300" />
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="flex items-start gap-3">
                <Icon name="info" size={17} className={`mt-0.5 shrink-0 ${status.color}`} />
                <div>
                  <h4 className="text-sm font-medium text-zinc-200">What this means</h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">{status.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VolumeBar({
  label,
  value,
  max,
  color,
  unit,
  muted = false,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  unit: string;
  muted?: boolean;
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div>
      <div className="mb-1 flex justify-between gap-2 text-xs">
        <span className={muted ? 'text-zinc-600' : 'text-zinc-400'}>{label}</span>
        <span className={`font-mono ${muted ? 'text-zinc-600' : 'text-zinc-200'}`}>
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
      <div className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`font-mono text-xl font-semibold ${color}`}>{value}</span>
        <span className="text-[10px] text-zinc-600">{unit}</span>
      </div>
    </div>
  );
}
