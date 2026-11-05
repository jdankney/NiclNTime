'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';

/* -------------------------------------------------------------------------- */
/* Sources                                                                     */
/* -------------------------------------------------------------------------- */

const SOURCES = {
  benowitz2010: {
    cite: 'Benowitz NL. Nicotine addiction. N Engl J Med. 2010;362:2295–2303.',
    url: 'https://doi.org/10.1056/NEJMra0809890',
  },
  hughes2007: {
    cite: 'Hughes JR. Effects of abstinence from tobacco: valid symptoms and time course. Nicotine Tob Res. 2007;9:315–327.',
    url: 'https://doi.org/10.1080/14622200701188919',
  },
  taylor2014: {
    cite: 'Taylor G, et al. Change in mental health after smoking cessation: systematic review and meta-analysis. BMJ. 2014;348:g1151.',
    url: 'https://www.bmj.com/content/348/bmj.g1151',
  },
  sg2014: {
    cite: 'US Surgeon General. The Health Consequences of Smoking — 50 Years of Progress. 2014.',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK179276/',
  },
  hackshaw2018: {
    cite: 'Hackshaw A, et al. Low cigarette consumption and risk of coronary heart disease and stroke. BMJ. 2018;360:j5855.',
    url: 'https://www.bmj.com/content/360/bmj.j5855',
  },
  nasem2018: {
    cite: 'National Academies of Sciences, Engineering, and Medicine. Public Health Consequences of E-Cigarettes. 2018.',
    url: 'https://nap.nationalacademies.org/catalog/24952',
  },
  aubin2012: {
    cite: 'Aubin HJ, et al. Weight gain in smokers after quitting cigarettes: meta-analysis. BMJ. 2012;345:e4439.',
    url: 'https://www.bmj.com/content/345/bmj.e4439',
  },
  mayer2014: {
    cite: 'Mayer B. How much nicotine kills a human? Tracing back the generally accepted lethal dose to dubious self-experiments in the nineteenth century. Arch Toxicol. 2014;88:5.',
    url: 'https://doi.org/10.1007/s00204-013-1127-0',
  },
  lunell2020: {
    cite: 'Lunell E, et al. Nicotine extraction and pharmacokinetics of ZYN nicotine pouches compared with snus. Nicotine Tob Res. 2020.',
    url: 'https://doi.org/10.1093/ntr/ntaa068',
  },
  jha2013: {
    cite: 'Jha P, et al. 21st-century hazards of smoking and benefits of cessation in the United States. N Engl J Med. 2013;368:341–350.',
    url: 'https://doi.org/10.1056/NEJMsa1211128',
  },
  jackson2025: {
    cite: 'Jackson SE, Jarvis MJ, West R. The price of a cigarette: 20 minutes of life? Addiction. 2025.',
    url: 'https://doi.org/10.1111/add.16757',
  },
  mcconnell2017: {
    cite: 'McConnell R, et al. Electronic cigarette use and respiratory symptoms in adolescents. Am J Respir Crit Care Med. 2017;195:1043–1049.',
    url: 'https://doi.org/10.1164/rccm.201604-0804OC',
  },
  blount2020: {
    cite: 'Blount BC, et al. Vitamin E acetate in bronchoalveolar-lavage fluid associated with EVALI. N Engl J Med. 2020;382:697–705.',
    url: 'https://doi.org/10.1056/NEJMoa1916433',
  },
  sg2016: {
    cite: 'US Surgeon General. E-Cigarette Use Among Youth and Young Adults. 2016.',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK538680/',
  },
  cdcYouth: {
    cite: 'CDC. E-cigarettes and young people.',
    url: 'https://www.cdc.gov/tobacco/e-cigarettes/youth.html',
  },
  sg2012: {
    cite: 'US Surgeon General. Preventing Tobacco Use Among Youth and Young Adults. 2012.',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK99237/',
  },
  difranza2007: {
    cite: 'DiFranza JR, et al. Symptoms of tobacco dependence after brief intermittent use (DANDY-2 study). Arch Pediatr Adolesc Med. 2007;161:704–710.',
    url: 'https://doi.org/10.1001/archpedi.161.7.704',
  },
} as const;

type SourceId = keyof typeof SOURCES;
const SOURCE_IDS = Object.keys(SOURCES) as SourceId[];
const sourceNumber = (id: SourceId) => SOURCE_IDS.indexOf(id) + 1;

/* -------------------------------------------------------------------------- */
/* Evidence levels                                                             */
/* -------------------------------------------------------------------------- */

type Evidence = 'established' | 'strong' | 'association' | 'animal';

const EVIDENCE: Record<Evidence, { label: string; description: string; badge: string }> = {
  established: {
    label: 'Established',
    description: 'Scientific consensus, confirmed by major reviews such as US Surgeon General reports.',
    badge: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  },
  strong: {
    label: 'Strong evidence',
    description: 'Consistent findings from good-quality human studies.',
    badge: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
  },
  association: {
    label: 'Association',
    description: 'Seen repeatedly in people, but cause and effect isn’t proven yet.',
    badge: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  },
  animal: {
    label: 'Animal & lab',
    description: 'Shown in animal or lab studies; how much applies to people is still uncertain.',
    badge: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
  },
};

/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

interface Fact {
  title: string;
  body: string;
  evidence: Evidence;
  sources: SourceId[];
}

interface Section {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  accent: string;
  facts: Fact[];
}

const SECTIONS: Section[] = [
  {
    id: 'brain',
    title: 'Your brain',
    description: 'How nicotine creates pleasure, habit and withdrawal',
    icon: 'sparkles',
    accent: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
    facts: [
      {
        title: 'It hijacks the reward system',
        body: 'Nicotine attaches to nicotinic acetylcholine receptors in the brain, which triggers a release of dopamine in the reward pathway. That dopamine hit is what makes nicotine feel good and teaches the brain to want more.',
        evidence: 'established',
        sources: ['benowitz2010', 'sg2014'],
      },
      {
        title: 'Faster delivery = more addictive',
        body: 'Inhaled nicotine reaches the brain within about 10–20 seconds. The quicker and higher the spike, the stronger the reinforcement — which is why cigarettes and nicotine-salt vapes are more habit-forming than slower products like nicotine gum or patches.',
        evidence: 'established',
        sources: ['benowitz2010'],
      },
      {
        title: 'Tolerance builds quickly',
        body: 'With regular use the brain adds more nicotine receptors. You need nicotine just to feel normal, and as levels fall between doses — nicotine’s half-life is about 2 hours — cravings return.',
        evidence: 'established',
        sources: ['benowitz2010'],
      },
      {
        title: 'Withdrawal is real, and temporary',
        body: 'Irritability, anxiety, low mood, trouble concentrating, restlessness, poor sleep and strong cravings are all genuine withdrawal symptoms. They peak in the first week and mostly fade within 2–4 weeks.',
        evidence: 'established',
        sources: ['hughes2007'],
      },
      {
        title: '“It calms me down” is mostly withdrawal relief',
        body: 'Nicotine eases the stress caused by its own withdrawal. People who quit report less anxiety, depression and stress, and better mood and quality of life, than people who keep using.',
        evidence: 'association',
        sources: ['taylor2014'],
      },
    ],
  },
  {
    id: 'heart',
    title: 'Heart & blood vessels',
    description: 'Short-term effects are clear; long-term effects depend on the product',
    icon: 'heart',
    accent: 'border-red-500/20 bg-red-500/10 text-red-300',
    facts: [
      {
        title: 'Heart rate and blood pressure go up',
        body: 'Nicotine releases adrenaline-like hormones that speed up the heart, raise blood pressure and narrow blood vessels. This happens with every product, including vapes.',
        evidence: 'established',
        sources: ['benowitz2010', 'nasem2018'],
      },
      {
        title: 'For smoking, there’s no safe level',
        body: 'Smoke damages blood vessels and makes blood more likely to clot. Even one cigarette a day carries roughly a third to half of the extra heart-disease and stroke risk of a pack a day.',
        evidence: 'strong',
        sources: ['hackshaw2018', 'sg2014'],
      },
      {
        title: 'Long-term heart effects of vaping aren’t known yet',
        body: 'There isn’t yet enough long-term data to say whether vaping leads to heart attacks or strokes. The short-term rises in heart rate and blood pressure are well documented.',
        evidence: 'association',
        sources: ['nasem2018'],
      },
    ],
  },
  {
    id: 'body',
    title: 'Metabolism, pregnancy & cancer',
    description: 'Effects across the rest of the body',
    icon: 'activity',
    accent: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    facts: [
      {
        title: 'Appetite and weight',
        body: 'Nicotine suppresses appetite and slightly raises metabolic rate. People who quit gain about 4–5 kg (9–11 lb) on average in the first year, mostly in the first 3 months — though results vary a lot and some people lose weight.',
        evidence: 'strong',
        sources: ['aubin2012'],
      },
      {
        title: 'Smoking causes type 2 diabetes',
        body: 'People who smoke are 30–40% more likely to develop type 2 diabetes than people who don’t.',
        evidence: 'established',
        sources: ['sg2014'],
      },
      {
        title: 'Nicotine harms pregnancy',
        body: 'Nicotine affects the developing baby, contributing to outcomes such as preterm birth and stillbirth, and has lasting effects on fetal brain development.',
        evidence: 'established',
        sources: ['sg2014'],
      },
      {
        title: 'The cancer risk comes mainly from smoke',
        body: 'Nicotine itself isn’t classified as a cause of cancer — the dozens of carcinogens in tobacco smoke are. Some lab and animal studies suggest nicotine could help existing tumors grow, but this hasn’t been shown in people.',
        evidence: 'animal',
        sources: ['sg2014'],
      },
      {
        title: 'Liquid nicotine is a poisoning risk',
        body: 'Swallowing e-liquid is dangerous, especially for children and pets — keep refills and pods locked away. In adults, the fatal swallowed dose is now estimated at 0.5–1 g, far above the old “60 mg” figure. Too much nicotine at once causes nausea, dizziness and a racing heart.',
        evidence: 'strong',
        sources: ['mayer2014'],
      },
    ],
  },
  {
    id: 'lungs',
    title: 'Lungs & product-specific risks',
    description: 'Where smoking, vaping and pouches differ',
    icon: 'lungs',
    accent: 'border-purple-500/20 bg-purple-500/10 text-purple-300',
    facts: [
      {
        title: 'Smoking shortens life by about 10 years',
        body: 'Smoking causes lung cancer, COPD and many other diseases. Each cigarette costs about 20 minutes of life expectancy on average. Quitting before 40 avoids about 90% of the extra risk of death — and quitting at any age helps.',
        evidence: 'established',
        sources: ['jha2013', 'jackson2025', 'sg2014'],
      },
      {
        title: 'Vaping is linked to airway symptoms',
        body: 'Teens who vape report about twice as much chronic cough, phlegm and bronchitis-like symptoms as those who don’t. Whether vaping causes long-term lung disease isn’t known yet.',
        evidence: 'association',
        sources: ['mcconnell2017', 'nasem2018'],
      },
      {
        title: 'The 2019 “vaping lung injury” outbreak (EVALI)',
        body: 'The outbreak was strongly linked to vitamin E acetate, an additive found mainly in illicit THC cartridges — not to regular nicotine vapes. Avoid vapes from unofficial sources.',
        evidence: 'strong',
        sources: ['blount2020'],
      },
      {
        title: 'Pouches skip the lungs, not the nicotine',
        body: 'Nicotine pouches avoid smoke and vapor, but they still deliver real doses of nicotine: ZYN pouches release more than half their nicotine during use — more than traditional Swedish snus. The brain and heart effects above still apply.',
        evidence: 'strong',
        sources: ['lunell2020'],
      },
    ],
  },
];

const UNDER_25: Fact[] = [
  {
    title: 'The brain is still building itself',
    body: 'The brain keeps developing until about age 25, especially the prefrontal cortex, which handles planning, impulse control and decision-making. Nicotine during this time can harm the parts of the brain that control attention, learning, mood and impulse control.',
    evidence: 'established',
    sources: ['sg2016', 'cdcYouth'],
  },
  {
    title: 'Addiction can start within days',
    body: 'In a study of young teens who had inhaled from a cigarette, 10% had already lost some control over their use within 2 days, and 25% within a month. Signs of dependence often showed up before they were using daily.',
    evidence: 'strong',
    sources: ['difranza2007'],
  },
  {
    title: 'Starting young means using longer',
    body: 'Nearly 9 in 10 adults who smoke daily first tried it by age 18. The earlier someone starts, the harder it tends to be to quit and the heavier their use is likely to become.',
    evidence: 'established',
    sources: ['sg2012'],
  },
  {
    title: 'Smoking stunts lung growth',
    body: 'Lungs keep growing through the teens. Smoking during that time reduces lung function and slows lung growth, which raises the risk of COPD later in life.',
    evidence: 'established',
    sources: ['sg2012'],
  },
  {
    title: 'Vaping raises the odds of trying cigarettes',
    body: 'Young people who vape are more likely to go on to try smoking. Researchers still debate how much of this vaping causes and how much is down to shared risk factors.',
    evidence: 'association',
    sources: ['nasem2018'],
  },
  {
    title: 'More coughing and bronchitis symptoms',
    body: 'Teen vapers report about twice the rate of chronic bronchitis symptoms, even when they have never smoked.',
    evidence: 'association',
    sources: ['mcconnell2017'],
  },
  {
    title: 'Lasting changes in animal studies',
    body: 'In animal studies, nicotine during adolescence causes longer-lasting changes in attention and in brain circuits than the same exposure in adults, and may make the brain more responsive to other addictive substances.',
    evidence: 'animal',
    sources: ['sg2016'],
  },
];

const QUICK_FACTS = [
  { value: '10–20 s', label: 'for inhaled nicotine to reach the brain', source: 'benowitz2010' as SourceId },
  { value: '~2 hrs', label: 'nicotine half-life — why cravings come back', source: 'benowitz2010' as SourceId },
  { value: '2–4 wks', label: 'for most withdrawal symptoms to fade', source: 'hughes2007' as SourceId },
  { value: '~25', label: 'age the brain finishes developing', source: 'cdcYouth' as SourceId },
];

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

interface ScienceProps {
  /** Section to scroll to when the tab opens. */
  focus?: 'under-25' | null;
  onFocusHandled?: () => void;
}

export function Science({ focus, onFocusHandled }: ScienceProps) {
  const under25Ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (focus !== 'under-25' || !under25Ref.current) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    under25Ref.current.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    onFocusHandled?.();
  }, [focus, onFocusHandled]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-400/80">The science</div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
          What nicotine does to your brain and body
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-zinc-500">
          What researchers have confirmed, what’s strongly suggested, and what’s still unknown. Every point
          is labelled with how strong the evidence is and links to its sources.
        </p>
      </div>

      <nav aria-label="Jump to section" className="flex flex-wrap gap-1.5">
        {[...SECTIONS.map((section) => ({ id: section.id, title: section.title })), { id: 'under-25', title: 'Under 25' }].map(
          (item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                item.id === 'under-25'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100'
              }`}
            >
              {item.title}
            </a>
          )
        )}
        <a
          href="#sources"
          className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          Sources
        </a>
      </nav>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {QUICK_FACTS.map((fact) => (
          <div key={fact.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="font-mono text-2xl font-semibold text-zinc-50">{fact.value}</div>
            <div className="mt-1 text-[11px] leading-snug text-zinc-500">
              {fact.label} <Citation id={fact.source} />
            </div>
          </div>
        ))}
      </div>

      <EvidenceLegend />

      {SECTIONS.map((section) => (
        <Card key={section.id} variant="default" className="scroll-mt-28 overflow-hidden" id={section.id}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`grid h-10 w-10 place-items-center rounded-xl border ${section.accent}`}>
                <Icon name={section.icon} size={20} />
              </div>
              <div>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FactGrid facts={section.facts} />
          </CardContent>
        </Card>
      ))}

      <section
        id="under-25"
        ref={under25Ref}
        aria-labelledby="under-25-heading"
        className="scroll-mt-28 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.08] via-zinc-900/40 to-red-500/[0.05]"
      >
        <div className="border-b border-amber-500/20 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
              <Icon name="alert" size={20} />
            </div>
            <div>
              <h2 id="under-25-heading" className="text-lg font-semibold text-zinc-50">
                If you’re under 25
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
                Teens and young adults aren’t just smaller adults when it comes to nicotine. A brain that’s
                still developing is more sensitive to it — so addiction can set in faster and the effects can
                last longer.
              </p>
            </div>
          </div>
        </div>
        <div className="px-5 py-5 sm:px-6">
          <FactGrid facts={UNDER_25} />

          <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4">
            <div className="flex items-start gap-3">
              <Icon name="heart" size={18} className="mt-0.5 shrink-0 text-emerald-300" />
              <div className="text-xs leading-relaxed text-zinc-300">
                <strong className="text-emerald-200">The good news:</strong> the younger you quit, the more of
                the damage you avoid. People who stopped smoking at 25–34 gained about 10 years of life
                compared with those who kept going.
                <Citation id="jha2013" /> Free, confidential help made for young people: text{' '}
                <strong className="font-mono text-zinc-100">DITCHVAPE</strong> to{' '}
                <strong className="font-mono text-zinc-100">88709</strong> (US, This is Quitting), or visit{' '}
                <a
                  href="https://teen.smokefree.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300 underline decoration-emerald-500/40 underline-offset-2 hover:text-emerald-200"
                >
                  teen.smokefree.gov
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </section>

      <Card variant="outlined" id="sources" className="scroll-mt-28">
        <CardHeader>
          <CardTitle>Sources</CardTitle>
          <CardDescription>Peer-reviewed studies and official public-health reports</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {SOURCE_IDS.map((id) => (
              <li key={id} id={`source-${id}`} className="scroll-mt-28 flex gap-3 text-xs leading-relaxed">
                <span className="w-6 shrink-0 text-right font-mono text-zinc-500">{sourceNumber(id)}.</span>
                <a
                  href={SOURCES[id].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-1.5 text-zinc-400 transition-colors hover:text-cyan-300"
                >
                  <span>{SOURCES[id].cite}</span>
                  <Icon name="external" size={12} className="mt-0.5 shrink-0 text-zinc-600 group-hover:text-cyan-400" />
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-5 border-t border-zinc-800/80 pt-4 text-[11px] leading-relaxed text-zinc-600">
            This page summarizes published research for education. It isn’t medical advice. If you’re
            worried about your health or want help quitting, talk to a doctor, pharmacist or a free quitline.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function FactGrid({ facts }: { facts: Fact[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {facts.map((fact) => (
        <li key={fact.title} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-zinc-100">{fact.title}</h3>
            <EvidenceBadge level={fact.evidence} />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            {fact.body}{' '}
            {fact.sources.map((id) => (
              <Citation key={id} id={id} />
            ))}
          </p>
        </li>
      ))}
    </ul>
  );
}

function EvidenceBadge({ level }: { level: Evidence }) {
  const info = EVIDENCE[level];
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${info.badge}`}
      title={info.description}
    >
      {info.label}
    </span>
  );
}

function Citation({ id }: { id: SourceId }) {
  const n = sourceNumber(id);
  return (
    <a
      href={`#source-${id}`}
      aria-label={`Source ${n}: ${SOURCES[id].cite}`}
      className="ml-0.5 inline-block rounded px-0.5 align-super font-mono text-[9px] text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
    >
      [{n}]
    </a>
  );
}

function EvidenceLegend() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">How sure is the science?</h2>
      <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(EVIDENCE) as Evidence[]).map((level) => (
          <div key={level}>
            <dt>
              <EvidenceBadge level={level} />
            </dt>
            <dd className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">{EVIDENCE[level].description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
