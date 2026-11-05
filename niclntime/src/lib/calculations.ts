/**
 * Calculation engine for the Nicotine Impact Visualizer.
 *
 * All functions are pure and defensive: inputs are clamped to sensible ranges
 * before they are used, so the dashboard never renders NaN or Infinity.
 * Sources for every constant are documented in `@/types`.
 */

import type {
  UserInputs,
  CalculatedMetrics,
  VapingInput,
  CigaretteInput,
  PouchInput,
  WhatIfScenario,
  DeviceType,
  NicotineType,
  CigaretteType,
  CurrencyCode,
  RiskFactors,
} from '@/types';
import {
  CURRENCIES,
  CIGARETTE_TYPE_LABELS,
  CIGARETTE_NICOTINE_MG,
  CIGARETTE_TAR_MG,
  CIGARETTE_CO_MG,
  CUSTOM_PRODUCT_ID,
  DEFAULT_INPUTS,
  DEVICE_PROFILES,
  RISK_THRESHOLDS,
  AVERAGE_PUFF_DURATION_SECONDS,
  AVERAGE_CIGARETTE_DURATION_MINUTES,
  DAYS_PER_MONTH,
  DAYS_PER_YEAR,
  LIFE_EXPECTANCY_YEARS,
  MINUTES_OF_LIFE_PER_CIGARETTE,
  NICOTINE_PER_CIGARETTE_EQUIVALENT_MG,
  POUCH_NICOTINE_ABSORPTION,
  SMOKE_PER_CIGARETTE_ML,
  VAPE_NICOTINE_ABSORPTION,
} from '@/types';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);

const num = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/* -------------------------------------------------------------------------- */
/* Input normalisation                                                         */
/* -------------------------------------------------------------------------- */

/** Device ids used before v2 of the app, mapped onto the current categories. */
const LEGACY_DEVICE_TYPES: Record<string, DeviceType> = {
  disposable: 'disposable',
  'geek-bar': 'disposable',
  pod: 'prefilled-pod',
  cigalike: 'prefilled-pod',
  'prefilled-pod': 'prefilled-pod',
  'pod-mod': 'refillable-pod',
  aio: 'refillable-pod',
  'refillable-pod': 'refillable-pod',
  mod: 'sub-ohm',
  fogger: 'sub-ohm',
  squonk: 'sub-ohm',
  'sub-ohm': 'sub-ohm',
};

const DEFAULT_UNIT_SIZE_ML: Record<DeviceType, number> = {
  disposable: 16,
  'prefilled-pod': 2,
  'refillable-pod': 30,
  'sub-ohm': 100,
};

/**
 * Clean up data loaded from localStorage or a shared link. Unknown device
 * types and currencies fall back to safe defaults instead of breaking the UI,
 * and data saved by older versions of the app is migrated.
 */
export function normalizeInputs(inputs: Partial<UserInputs> | null | undefined): UserInputs {
  const source = (inputs ?? {}) as Partial<Record<keyof UserInputs, unknown>>;
  const rawVaping = source.vaping as Partial<Record<keyof VapingInput, unknown>> | null | undefined;
  const rawCigarettes = source.cigarettes as
    | Partial<Record<keyof CigaretteInput, unknown>>
    | null
    | undefined;
  const rawPouches = source.pouches as Partial<Record<keyof PouchInput, unknown>> | null | undefined;

  let vaping: VapingInput | null = null;
  if (rawVaping && typeof rawVaping === 'object' && Object.keys(rawVaping).length > 0) {
    const deviceType = LEGACY_DEVICE_TYPES[String(rawVaping.deviceType)] ?? 'disposable';
    const nicotineType: NicotineType =
      rawVaping.nicotineType === 'salt' || rawVaping.nicotineType === 'freebase'
        ? rawVaping.nicotineType
        : DEVICE_PROFILES[deviceType].defaultNicotineType;
    vaping = {
      productId: typeof rawVaping.productId === 'string' ? rawVaping.productId : CUSTOM_PRODUCT_ID,
      deviceType,
      nicotineConcentration: clamp(num(rawVaping.nicotineConcentration), 0, 100),
      nicotineType,
      unitSizeMl: clamp(num(rawVaping.unitSizeMl, DEFAULT_UNIT_SIZE_ML[deviceType]), 0.1, 1000),
      volumePerDay: clamp(num(rawVaping.volumePerDay), 0, 100),
      hitsPerDay: Math.round(clamp(num(rawVaping.hitsPerDay), 0, 5000)),
    };
  }

  let cigarettes: CigaretteInput | null = null;
  if (rawCigarettes && typeof rawCigarettes === 'object' && Object.keys(rawCigarettes).length > 0) {
    const type = String(rawCigarettes.type);
    cigarettes = {
      cigarettesPerDay: Math.round(clamp(num(rawCigarettes.cigarettesPerDay), 0, 200)),
      type: (type in CIGARETTE_TYPE_LABELS ? type : 'regular') as CigaretteType,
      packSize: Math.round(clamp(num(rawCigarettes.packSize, 20), 1, 100)),
    };
  }

  let pouches: PouchInput | null = null;
  if (rawPouches && typeof rawPouches === 'object' && Object.keys(rawPouches).length > 0) {
    pouches = {
      productId: typeof rawPouches.productId === 'string' ? rawPouches.productId : CUSTOM_PRODUCT_ID,
      pouchesPerDay: clamp(num(rawPouches.pouchesPerDay), 0, 100),
      mgPerPouch: clamp(num(rawPouches.mgPerPouch, 6), 0, 50),
      pouchesPerCan: Math.round(clamp(num(rawPouches.pouchesPerCan, 15), 1, 100)),
    };
  }

  const currency = (
    typeof source.currency === 'string' && source.currency in CURRENCIES ? source.currency : 'USD'
  ) as CurrencyCode;

  return {
    vaping,
    cigarettes,
    pouches,
    costPerVapeMl: clamp(num(source.costPerVapeMl, DEFAULT_INPUTS.costPerVapeMl), 0, 1_000_000),
    costPerPack: clamp(num(source.costPerPack, DEFAULT_INPUTS.costPerPack), 0, 10_000_000),
    costPerCan: clamp(num(source.costPerCan, DEFAULT_INPUTS.costPerCan), 0, 10_000_000),
    yearsOfUse: clamp(num(source.yearsOfUse, DEFAULT_INPUTS.yearsOfUse), 0, 80),
    age: Math.round(clamp(num(source.age, DEFAULT_INPUTS.age), 10, 110)),
    currency,
  };
}

/* -------------------------------------------------------------------------- */
/* Helpers shared with the input forms                                         */
/* -------------------------------------------------------------------------- */

/** Suggested real-world puffs per day from liquid used. */
export function estimatePuffsPerDay(volumePerDayMl: number, deviceType: DeviceType): number {
  return Math.round(Math.max(volumePerDayMl, 0) * DEVICE_PROFILES[deviceType].puffsPerMl);
}

/** mg/mL → the "%" printed on US packaging (5% ≈ 50 mg/mL). */
export function mgPerMlToPercent(mgPerMl: number): number {
  return mgPerMl / 10;
}

export function vapeNicotineAbsorbedMg(vaping: VapingInput): number {
  return vaping.volumePerDay * vaping.nicotineConcentration * VAPE_NICOTINE_ABSORPTION[vaping.nicotineType];
}

export function pouchNicotineAbsorbedMg(pouches: PouchInput): number {
  return pouches.pouchesPerDay * pouches.mgPerPouch * POUCH_NICOTINE_ABSORPTION;
}

/* -------------------------------------------------------------------------- */
/* Physiology                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Average daytime heart-rate rise. Nicotine raises heart rate by ~10–20 bpm
 * right after use; averaged over the day, regular smokers' heart rate runs
 * ~7 bpm higher (Benowitz et al.). Tolerance makes the effect level off, so a
 * saturating curve is used: ~7 bpm at 20 mg/day, approaching ~10 bpm.
 */
const HEART_RATE_MAX_BPM = 10;
const SYSTOLIC_MAX_MMHG = 6;
const CARDIO_DOSE_SCALE_MG = 15;

function cardiovascularEstimate(dailyNicotineMg: number) {
  const saturation = 1 - Math.exp(-Math.max(dailyNicotineMg, 0) / CARDIO_DOSE_SCALE_MG);
  return {
    heartRateIncreaseBpm: HEART_RATE_MAX_BPM * saturation,
    systolicBpIncreaseMmHg: SYSTOLIC_MAX_MMHG * saturation,
  };
}

/* -------------------------------------------------------------------------- */
/* Risk score                                                                  */
/* -------------------------------------------------------------------------- */

/** Maximum points per factor. Smoke toxicants dominate because combustion causes most smoking harm. */
const RISK_WEIGHTS = {
  chemicals: 45,
  nicotine: 15,
  respiratory: 10,
  cardiovascular: 10,
  duration: 10,
  age: 10,
} as const;

/**
 * Vape aerosol contains far fewer toxicants than smoke — most measured
 * carcinogens are at a few percent of smoke levels or less — but it is not
 * harmless. It is weighted at 10% of the same volume of smoke.
 */
export const VAPE_AEROSOL_RESPIRATORY_WEIGHT = 0.1;

interface RiskInputs {
  cigarettesPerDay: number;
  tarPerCigaretteMg: number;
  dailyNicotineMg: number;
  dailySmokeVolumeLiters: number;
  dailyVapeAerosolLiters: number;
  heartRateIncreaseBpm: number;
  yearsOfUse: number;
  age: number;
  hasExposure: boolean;
}

/**
 * A transparent, non-clinical composite score (0–100). Each factor is also
 * returned as a 0–100 percentage of its maximum for the UI breakdown.
 */
function calculateRiskScore(input: RiskInputs): {
  riskScore: number;
  riskLevel: CalculatedMetrics['riskLevel'];
  riskFactors: RiskFactors;
} {
  if (!input.hasExposure) {
    return {
      riskScore: 0,
      riskLevel: 'low',
      riskFactors: { nicotine: 0, chemicals: 0, respiratory: 0, cardiovascular: 0, duration: 0, age: 0 },
    };
  }

  // Smoking risk rises steeply at low consumption: one cigarette a day carries
  // roughly 30–50% of the excess heart-disease and stroke risk of 20 a day (Hackshaw et
  // al., BMJ 2018). A steep power curve reflects "no safe level".
  const tarAdjustedCigarettes = input.cigarettesPerDay * (input.tarPerCigaretteMg / CIGARETTE_TAR_MG.regular);
  const chemicals =
    input.cigarettesPerDay > 0 ? Math.min(1, Math.pow(tarAdjustedCigarettes / 20, 0.35)) : 0;

  // Scaled to 60 mg/day absorbed — the range reached by heavy high-strength
  // disposable users — so that cutting down still shows up for them.
  const nicotine = Math.min(1, input.dailyNicotineMg / 60);

  const weightedInhaled =
    input.dailySmokeVolumeLiters + input.dailyVapeAerosolLiters * VAPE_AEROSOL_RESPIRATORY_WEIGHT;
  const respiratory = Math.min(1, weightedInhaled / 12);

  const cardiovascular = Math.min(1, input.heartRateIncreaseBpm / 8);
  const duration = Math.min(1, input.yearsOfUse / 15);

  // The brain keeps developing until about age 25, and nicotine exposure
  // during that time is linked to stronger addiction and effects on attention
  // and learning (US Surgeon General, CDC).
  const age = input.age < 18 ? 1 : input.age < 25 ? 0.7 : 0;

  const factors: RiskFactors = { chemicals, nicotine, respiratory, cardiovascular, duration, age };
  const riskScore = Math.min(
    Math.round(
      (Object.keys(RISK_WEIGHTS) as Array<keyof RiskFactors>).reduce(
        (total, key) => total + factors[key] * RISK_WEIGHTS[key],
        0
      )
    ),
    100
  );

  let riskLevel: CalculatedMetrics['riskLevel'] = 'low';
  if (riskScore >= RISK_THRESHOLDS.high) riskLevel = 'critical';
  else if (riskScore >= RISK_THRESHOLDS.moderate) riskLevel = 'high';
  else if (riskScore >= RISK_THRESHOLDS.low) riskLevel = 'moderate';

  return {
    riskScore,
    riskLevel,
    riskFactors: {
      nicotine: Math.round(nicotine * 100),
      chemicals: Math.round(chemicals * 100),
      respiratory: Math.round(respiratory * 100),
      cardiovascular: Math.round(cardiovascular * 100),
      duration: Math.round(duration * 100),
      age: Math.round(age * 100),
    },
  };
}

export const RISK_FACTOR_WEIGHTS = RISK_WEIGHTS;

/* -------------------------------------------------------------------------- */
/* Main calculation                                                            */
/* -------------------------------------------------------------------------- */

export function calculateMetrics(rawInputs: UserInputs): CalculatedMetrics {
  const inputs = normalizeInputs(rawInputs);
  const { vaping, cigarettes, pouches } = inputs;

  // Nicotine
  const vapingNicotine = vaping ? vapeNicotineAbsorbedMg(vaping) : 0;
  const cigarettesPerDay = cigarettes?.cigarettesPerDay ?? 0;
  const cigaretteNicotine = cigarettes ? cigarettesPerDay * CIGARETTE_NICOTINE_MG[cigarettes.type] : 0;
  const pouchNicotine = pouches ? pouchNicotineAbsorbedMg(pouches) : 0;
  const dailyNicotineMg = vapingNicotine + cigaretteNicotine + pouchNicotine;
  const dailyNicotineContentMg =
    (vaping ? vaping.volumePerDay * vaping.nicotineConcentration : 0) +
    cigaretteNicotine +
    (pouches ? pouches.pouchesPerDay * pouches.mgPerPouch : 0);

  // Smoke toxicants
  const tarPerCigaretteMg = cigarettes ? CIGARETTE_TAR_MG[cigarettes.type] : 0;
  const dailyTarMg = cigarettesPerDay * tarPerCigaretteMg;
  const dailyCarbonMonoxideMg = cigarettes ? cigarettesPerDay * CIGARETTE_CO_MG[cigarettes.type] : 0;
  const packYears = (cigarettesPerDay / 20) * inputs.yearsOfUse;

  // Inhaled volume
  const dailySmokeVolumeLiters = (cigarettesPerDay * SMOKE_PER_CIGARETTE_ML) / 1000;
  const dailyVapeAerosolLiters = vaping
    ? (vaping.hitsPerDay * DEVICE_PROFILES[vaping.deviceType].puffVolumeMl) / 1000
    : 0;
  const dailyAerosolVolumeLiters = dailySmokeVolumeLiters + dailyVapeAerosolLiters;

  const { heartRateIncreaseBpm, systolicBpIncreaseMmHg } = cardiovascularEstimate(dailyNicotineMg);

  // Money
  const dailyCost =
    (vaping ? vaping.volumePerDay * inputs.costPerVapeMl : 0) +
    (cigarettes ? (cigarettesPerDay / cigarettes.packSize) * inputs.costPerPack : 0) +
    (pouches ? (pouches.pouchesPerDay / pouches.pouchesPerCan) * inputs.costPerCan : 0);
  const yearlyCost = dailyCost * DAYS_PER_YEAR;
  const projectionYears = Math.max(1, LIFE_EXPECTANCY_YEARS - inputs.age);

  // Time actively spent using. Pouches sit under the lip without interrupting
  // what you are doing, so they are not counted as time spent.
  const minutesPerDaySpent =
    (vaping ? (vaping.hitsPerDay * AVERAGE_PUFF_DURATION_SECONDS) / 60 : 0) +
    cigarettesPerDay * AVERAGE_CIGARETTE_DURATION_MINUTES;

  // Life expectancy: evidence exists for smoking only.
  const daysLostPerYear = (cigarettesPerDay * MINUTES_OF_LIFE_PER_CIGARETTE * DAYS_PER_YEAR) / 1440;
  const daysOfLifeLost = daysLostPerYear * inputs.yearsOfUse;

  const risk = calculateRiskScore({
    cigarettesPerDay,
    tarPerCigaretteMg,
    dailyNicotineMg,
    dailySmokeVolumeLiters,
    dailyVapeAerosolLiters,
    heartRateIncreaseBpm,
    yearsOfUse: inputs.yearsOfUse,
    age: inputs.age,
    hasExposure: Boolean(vaping || cigarettes || pouches),
  });

  return {
    dailyNicotineMg,
    yearlyNicotineMg: dailyNicotineMg * DAYS_PER_YEAR,
    lifetimeNicotineMg: dailyNicotineMg * DAYS_PER_YEAR * inputs.yearsOfUse,
    nicotineBySource: { vaping: vapingNicotine, cigarettes: cigaretteNicotine, pouches: pouchNicotine },
    dailyNicotineContentMg,
    dailyTarMg,
    yearlyTarMg: dailyTarMg * DAYS_PER_YEAR,
    dailyCarbonMonoxideMg,
    yearlyCarbonMonoxideMg: dailyCarbonMonoxideMg * DAYS_PER_YEAR,
    packYears,
    dailyAerosolVolumeLiters,
    dailySmokeVolumeLiters,
    dailyVapeAerosolLiters,
    yearlyAerosolVolumeLiters: dailyAerosolVolumeLiters * DAYS_PER_YEAR,
    dailyCigaretteEquivalent:
      cigarettesPerDay + (vapingNicotine + pouchNicotine) / NICOTINE_PER_CIGARETTE_EQUIVALENT_MG,
    heartRateIncreaseBpm,
    systolicBpIncreaseMmHg,
    dailyCost,
    monthlyCost: dailyCost * DAYS_PER_MONTH,
    yearlyCost,
    tenYearCost: yearlyCost * 10,
    lifetimeCost: yearlyCost * projectionYears,
    projectionYears,
    minutesPerDaySpent,
    hoursPerYearSpent: (minutesPerDaySpent * DAYS_PER_YEAR) / 60,
    daysOfLifeLostEstimate: Math.round(daysOfLifeLost),
    yearsOfLifeLostEstimate: daysOfLifeLost / DAYS_PER_YEAR,
    daysLostPerYear,
    lifeLostApplies: cigarettesPerDay > 0,
    hasNonCombustible: Boolean(
      (vaping && vaping.volumePerDay > 0) || (pouches && pouches.pouchesPerDay > 0)
    ),
    ...risk,
  };
}

/* -------------------------------------------------------------------------- */
/* What-if scenarios                                                           */
/* -------------------------------------------------------------------------- */

function scaleUsage(inputs: UserInputs, factor: number): UserInputs {
  return {
    ...inputs,
    vaping: inputs.vaping
      ? {
          ...inputs.vaping,
          volumePerDay: inputs.vaping.volumePerDay * factor,
          hitsPerDay: Math.round(inputs.vaping.hitsPerDay * factor),
        }
      : null,
    cigarettes: inputs.cigarettes
      ? { ...inputs.cigarettes, cigarettesPerDay: Math.round(inputs.cigarettes.cigarettesPerDay * factor) }
      : null,
    pouches: inputs.pouches
      ? { ...inputs.pouches, pouchesPerDay: inputs.pouches.pouchesPerDay * factor }
      : null,
  };
}

/**
 * Generate "what if" scenarios relevant to the user's current inputs.
 */
export function generateWhatIfScenarios(rawInputs: UserInputs): WhatIfScenario[] {
  const inputs = normalizeInputs(rawInputs);
  const scenarios: WhatIfScenario[] = [
    {
      id: 'current',
      label: 'Current usage',
      description: 'Your baseline, using the numbers you entered.',
      metrics: calculateMetrics(inputs),
    },
  ];

  const active = [
    inputs.vaping && 'vaping',
    inputs.cigarettes && 'cigarettes',
    inputs.pouches && 'pouches',
  ].filter(Boolean) as Array<'vaping' | 'cigarettes' | 'pouches'>;

  if (active.length === 0) return scenarios;

  scenarios.push({
    id: 'cut-50',
    label: 'Cut down 50%',
    description:
      active.length > 1 ? 'Halve everything you use.' : 'Halve how much you use each day.',
    metrics: calculateMetrics(scaleUsage(inputs, 0.5)),
  });

  if (inputs.vaping && inputs.vaping.nicotineConcentration >= 10) {
    scenarios.push({
      id: 'lower-strength',
      label: 'Halve vape strength',
      description: `Drop from ${formatNumber(mgPerMlToPercent(inputs.vaping.nicotineConcentration), 1)}% to ${formatNumber(
        mgPerMlToPercent(inputs.vaping.nicotineConcentration / 2),
        1
      )}% and vape the same amount. Many people vape more to compensate, so this is a best case.`,
      metrics: calculateMetrics({
        ...inputs,
        vaping: { ...inputs.vaping, nicotineConcentration: inputs.vaping.nicotineConcentration / 2 },
      }),
    });
  }

  if (active.length > 1) {
    if (inputs.cigarettes) {
      scenarios.push({
        id: 'quit-smoking',
        label: 'Quit smoking',
        description: 'Stop cigarettes completely and keep everything else.',
        metrics: calculateMetrics({ ...inputs, cigarettes: null }),
      });
    }
    if (inputs.vaping) {
      scenarios.push({
        id: 'quit-vaping',
        label: 'Quit vaping',
        description: 'Stop vaping and keep everything else.',
        metrics: calculateMetrics({ ...inputs, vaping: null }),
      });
    }
    if (inputs.pouches) {
      scenarios.push({
        id: 'quit-pouches',
        label: 'Quit pouches',
        description: 'Stop nicotine pouches and keep everything else.',
        metrics: calculateMetrics({ ...inputs, pouches: null }),
      });
    }
  }

  scenarios.push({
    id: 'quit-all',
    label: 'Quit nicotine',
    description: 'No vaping, smoking or pouches.',
    metrics: calculateMetrics({ ...inputs, vaping: null, cigarettes: null, pouches: null }),
  });

  return scenarios;
}

/* -------------------------------------------------------------------------- */
/* Formatting helpers                                                          */
/* -------------------------------------------------------------------------- */

export function formatNumber(num: number, decimals = 0): string {
  if (!Number.isFinite(num)) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/** Up to `decimals` digits, dropping trailing zeros (7 → "7", 2.5 → "2.5"). */
export function formatFlexible(num: number, decimals = 1): string {
  if (!Number.isFinite(num)) return '0';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(num);
}

export function formatCompactNumber(num: number): string {
  if (!Number.isFinite(num)) return '0';
  if (Math.abs(num) < 1000) return formatNumber(num, num < 10 && num % 1 !== 0 ? 1 : 0);
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

/** Currencies that are normally shown without minor units. */
const ZERO_DECIMAL_CURRENCIES = new Set<CurrencyCode>([
  'JPY',
  'KRW',
  'IDR',
  'VND',
  'CLP',
  'COP',
  'HUF',
  'NGN',
  'PKR',
  'ARS',
]);

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD',
  maximumFractionDigits?: number
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const digits =
    maximumFractionDigits !== undefined
      ? maximumFractionDigits
      : Math.abs(safeAmount) >= 1000 || ZERO_DECIMAL_CURRENCIES.has(currency)
        ? 0
        : 2;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(safeAmount);
}

export function formatCompactCurrency(amount: number, currency: CurrencyCode = 'USD'): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  if (Math.abs(safeAmount) < 1000) return formatCurrency(safeAmount, currency);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(safeAmount);
}

export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return '0m';
  const totalMinutes = Math.round(minutes);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

/** Days of life expectancy, switching to years once it gets large. */
export function formatLifeLost(days: number): string {
  if (!Number.isFinite(days) || days <= 0) return '0 days';
  if (days >= 730) return `${formatNumber(days / DAYS_PER_YEAR, 1)} years`;
  const rounded = Math.round(days);
  return `${formatNumber(rounded)} ${rounded === 1 ? 'day' : 'days'}`;
}

export function formatCigaretteType(type: CigaretteType): string {
  return CIGARETTE_TYPE_LABELS[type];
}

/** Round a converted reference price to two significant figures for display. */
export function roundToSignificant(value: number, digits = 2): number {
  if (!Number.isFinite(value) || value === 0) return 0;
  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(value))) - digits + 1);
  return Math.round(value / magnitude) * magnitude;
}
