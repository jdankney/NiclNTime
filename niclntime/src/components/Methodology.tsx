'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import {
  MINUTES_OF_LIFE_PER_CIGARETTE,
  POUCH_NICOTINE_ABSORPTION,
  REAL_INVESTMENT_RETURN,
  VAPE_NICOTINE_ABSORPTION,
} from '@/types';

const ASSUMPTIONS: Array<{ topic: string; value: string; why: string; color: string }> = [
  {
    topic: 'Vape nicotine absorbed',
    value: `${Math.round(VAPE_NICOTINE_ABSORPTION * 100)}% of the nicotine in the liquid you use`,
    why: 'About 94% of nicotine that reaches the lungs is retained, but some condenses in the device or is exhaled. Real values range roughly 30–90% depending on device and puffing style.',
    color: 'bg-cyan-400',
  },
  {
    topic: 'E-liquid used',
    value: 'Device or pod size ÷ how many days it lasts',
    why: 'Manufacturer puff ratings (e.g. “25k puffs”) are measured with short lab puffs and overstate real use, so the tool works from liquid instead.',
    color: 'bg-cyan-400',
  },
  {
    topic: 'Cigarette nicotine',
    value: '~1 mg absorbed per cigarette (0.9–1.2 by type)',
    why: '“Light” cigarettes deliver nearly as much because smokers compensate by inhaling more deeply.',
    color: 'bg-amber-400',
  },
  {
    topic: 'Tar and carbon monoxide',
    value: '6–14 mg tar, 7–13 mg CO per cigarette',
    why: 'Smoking-machine (ISO) yields. The UK/EU legal maximum is 10 mg of each; real intake is usually higher.',
    color: 'bg-amber-400',
  },
  {
    topic: 'Pouch nicotine absorbed',
    value: `${Math.round(POUCH_NICOTINE_ABSORPTION * 100)}% of the mg on the can`,
    why: 'ZYN pouches release ~56–59% of their nicotine during use; a little is swallowed and broken down before it reaches the blood.',
    color: 'bg-emerald-400',
  },
  {
    topic: 'Life expectancy',
    value: `~${MINUTES_OF_LIFE_PER_CIGARETTE} minutes per cigarette smoked`,
    why: '2025 UCL estimate from the British Doctors and Million Women studies (≈17 min for men, ≈22 for women), replacing the older 11-minute figure. Not applied to vaping or pouches because there is no long-term mortality data yet.',
    color: 'bg-red-400',
  },
  {
    topic: 'Heart rate',
    value: 'Average daytime rise of up to ~10 bpm',
    why: 'Nicotine raises heart rate 10–20 bpm right after use; across a day, regular smokers average ~7 bpm higher. Tolerance makes the effect level off at higher doses.',
    color: 'bg-red-400',
  },
  {
    topic: 'Relative risk score',
    value: 'Smoke toxicants 45 · nicotine 15 · inhaled load 10 · heart 10 · years 10 · age 10',
    why: 'A transparent composite made for this tool, weighted so combustion dominates; vape aerosol counts at 10% of the same volume of smoke. It is not a validated clinical calculator.',
    color: 'bg-purple-400',
  },
  {
    topic: 'If invested',
    value: `${Math.round(REAL_INVESTMENT_RETURN * 100)}% a year after inflation, monthly contributions`,
    why: 'Roughly the long-run stock-market average. Investments can fall as well as rise.',
    color: 'bg-emerald-400',
  },
];

const SOURCES = [
  {
    title: 'Jackson, Jarvis & West — The price of a cigarette: 20 minutes of life? (Addiction, 2025)',
    url: 'https://doi.org/10.1111/add.16757',
    note: 'Current estimate of life expectancy lost per cigarette.',
  },
  {
    title: 'Shaw, Mitchell & Dorling — Time for a smoke? (BMJ, 2000)',
    url: 'https://www.bmj.com/content/320/7226/53',
    note: 'The earlier, widely quoted 11-minute estimate.',
  },
  {
    title: 'Hackshaw et al. — Low cigarette consumption and heart disease and stroke (BMJ, 2018)',
    url: 'https://www.bmj.com/content/360/bmj.j5855',
    note: 'Why even a few cigarettes a day score highly.',
  },
  {
    title: 'St Helen et al. — Nicotine delivery and retention from e-cigarettes (Addiction, 2016)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26430813/',
    note: 'Retention of inhaled e-cigarette nicotine.',
  },
  {
    title: 'Lunell et al. — Nicotine extraction and pharmacokinetics of ZYN pouches (Nicotine Tob Res, 2020)',
    url: 'https://doi.org/10.1093/ntr/ntaa068',
    note: 'How much nicotine pouches release.',
  },
  {
    title: 'Benowitz & Jacob — Daily intake of nicotine during cigarette smoking (1984)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Benowitz+Jacob+1984+daily+intake+of+nicotine+during+cigarette+smoking',
    note: 'The ~1 mg absorbed per cigarette figure.',
  },
  {
    title: 'National Academies — Public Health Consequences of E-Cigarettes (2018)',
    url: 'https://nap.nationalacademies.org/catalog/24952',
    note: 'Evidence review on vaping harms and what is still unknown.',
  },
  {
    title: 'CDC — E-cigarettes and young people',
    url: 'https://www.cdc.gov/tobacco/e-cigarettes/youth.html',
    note: 'Nicotine and the developing brain (up to about age 25).',
  },
  {
    title: 'NHS — Using e-cigarettes to stop smoking',
    url: 'https://www.nhs.uk/live-well/quit-smoking/using-e-cigarettes-to-stop-smoking/',
    note: 'Vaping is much less harmful than smoking, but not risk-free.',
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
              <p className="text-xs text-zinc-500">Every assumption, its source, and what we don’t know</p>
            </div>
          </div>
          <Icon
            name="chevron-down"
            size={18}
            className="shrink-0 text-zinc-500 transition-transform group-open:rotate-180"
          />
        </summary>

        <CardContent className="border-t border-zinc-800/80 pt-5">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
            <div>
              <h4 className="text-sm font-medium text-zinc-200">Key assumptions</h4>
              <dl className="mt-3 space-y-3">
                {ASSUMPTIONS.map((item) => (
                  <div key={item.topic} className="flex gap-2.5">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${item.color}`} />
                    <div>
                      <dt className="text-xs font-medium text-zinc-300">
                        {item.topic}: <span className="font-normal text-zinc-200">{item.value}</span>
                      </dt>
                      <dd className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">{item.why}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <h4 className="mt-6 text-sm font-medium text-zinc-200">What this can’t tell you</h4>
              <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-zinc-500">
                <li>• Vaping is far less harmful than smoking, but it isn’t harmless, and its long-term effects are still being studied.</li>
                <li>• Nicotine is highly addictive at any dose. A lower score doesn’t mean a habit is easy to stop.</li>
                <li>• Your own health depends on genetics, other habits and medical history that this tool doesn’t ask about.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-zinc-200">Sources</h4>
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
            Product specs (size, strength, puff rating) come from manufacturer and retailer listings and are
            only used to pre-fill the form — check your own packaging. This project is independent and isn’t
            affiliated with any brand or public-health organization. If you are concerned about your health,
            contact a healthcare professional.
          </p>
        </CardContent>
      </details>
    </Card>
  );
}
