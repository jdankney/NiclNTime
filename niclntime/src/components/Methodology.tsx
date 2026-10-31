'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

const SOURCES = [
  {
    title: 'CDC — Health effects of cigarette smoking',
    url: 'https://www.cdc.gov/tobacco/about/health-effects/index.html',
    note: 'General health effects and cessation guidance.',
  },
  {
    title: 'NHS — Vaping and e-cigarettes',
    url: 'https://www.nhs.uk/live-well/quit-smoking/using-e-cigarettes-to-stop-smoking/',
    note: 'Public-health overview of vaping and quitting.',
  },
  {
    title: 'BMJ — Life lost per cigarette',
    url: 'https://www.bmj.com/content/360/bmj.j5855',
    note: 'Source of the widely cited ~11 minutes per cigarette estimate.',
  },
  {
    title: 'Truth Initiative — This is Quitting',
    url: 'https://truthinitiative.org/thisisquitting',
    note: 'Free text-based support for young adults quitting vaping.',
  },
  {
    title: 'Smokefree.gov',
    url: 'https://smokefree.gov',
    note: 'Free evidence-based quitting tools and resources.',
  },
];

export function Methodology() {
  return (
    <Card variant="outlined" className="overflow-hidden">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-inset">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-800/70 text-zinc-300">
              <Icon name="info" size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">How the numbers are estimated</h3>
              <p className="text-xs text-zinc-500">Methodology, limitations and public-health sources</p>
            </div>
          </div>
          <Icon
            name="chevron-down"
            size={18}
            className="shrink-0 text-zinc-500 transition-transform group-open:rotate-180"
          />
        </summary>

        <CardContent className="border-t border-zinc-800/80 pt-5">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-zinc-200">What goes into the score</h4>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-zinc-500">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                  Absorbed nicotine is estimated from e-liquid volume, concentration and a device-specific
                  absorption rate, or from published cigarette yields.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                  Tar and carbon monoxide use typical machine-measured cigarette yields. Real-world
                  exposure depends on how a person smokes.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-400" />
                  Inhaled volume is a communication estimate based on average puff or cigarette volume,
                  not a lung-function measurement.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                  The 0–100 risk score is a weighted composite created for this tool. It is not a
                  validated clinical risk calculator.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                  Life-lost figures convert estimated nicotine exposure into cigarette-equivalents and
                  apply the ~11-minute estimate. Treat them as a rough illustration only.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-zinc-200">Selected sources & support</h4>
              <div className="mt-3 space-y-2">
                {SOURCES.map((source) => (
                  <a
                    key={source.title}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex items-start justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2.5 transition-colors hover:border-zinc-700 hover:bg-zinc-900/60"
                  >
                    <div>
                      <div className="text-xs font-medium text-zinc-300 group-hover/link:text-cyan-300">
                        {source.title}
                      </div>
                      <div className="mt-0.5 text-[10px] text-zinc-600">{source.note}</div>
                    </div>
                    <Icon name="external" size={14} className="mt-0.5 shrink-0 text-zinc-600" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-5 border-t border-zinc-800/80 pt-4 text-[11px] leading-relaxed text-zinc-600">
            This project is independent and is not affiliated with any public-health organization.
            Estimates can be wrong for any individual. If you are concerned about your health, contact a
            healthcare professional. If you are in immediate danger, contact local emergency services.
          </p>
        </CardContent>
      </details>
    </Card>
  );
}
