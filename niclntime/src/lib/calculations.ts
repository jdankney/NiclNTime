/**
 * Calculation engine for the Nicotine Impact Visualizer.
 *
 * All functions are pure and defensive: inputs are clamped to sensible ranges
 * before they are used, so the dashboard never renders NaN or Infinity.
 */

import type {
  UserInputs,
  CalculatedMetrics,
  VapingInput,
  CigaretteInput,
  WhatIfScenario,
  DeviceType,
  CigaretteType,
  CurrencyCode,
  RiskFactors,
} from '@/types';
import {
  CURRENCIES,
  CIGARETTE_TYPE_LABELS,
  DEVICE_ABSORPTION_RATES,
  DEVICE_AEROSOL_PER_PUFF_ML,
  CIGARETTE_NICOTINE_MG,
  CIGARETTE_TAR_MG,
  CIGARETTE_CO_MG,
  RISK_THRESHOLDS,
  AVERAGE_HIT_DURATION_SECONDS,
  AVERAGE_CIGARETTE_DURATION_MINUTES,
  DAYS_PER_YEAR,
  LIFE_EXPECTANCY_YEARS,
} from '@/types';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);

/**
 * Clean up data loaded from localStorage or a shared link. Unknown device
 * types and currencies fall back to safe defaults instead of breaking the UI.
 */
export function normalizeInputs(inputs: Partial<UserInputs> | null | undefined): UserInputs {
  const source = inputs ?? {};
  const rawVaping = source.vaping as Partial<VapingInput> | null | undefined;
  const rawCigarettes = source.cigarettes as Partial<CigaretteInput> | null | undefined;

  const vaping: VapingInput | null =
    rawVaping && Object.keys(rawVaping).length > 0
      ? {
          hitsPerDay: Math.round(clamp(Number(rawVaping.hitsPerDay) || 0, 0, 5000)),
          deviceType: (rawVaping.deviceType && rawVaping.deviceType in DEVICE_ABSORPTION_RATES
            ? rawVaping.deviceType
            : 'pod') as DeviceType,
          nicotineConcentration: clamp(Number(rawVaping.nicotineConcentration) || 0, 0, 100),
          volumePerDay: clamp(Number(rawVaping.volumePerDay) || 0, 0, 100),
        }
      : null;

  const cigarettes: CigaretteInput | null =
    rawCigarettes && Object.keys(rawCigarettes).length > 0
      ? {
          cigarettesPerDay: Math.round(clamp(Number(rawCigarettes.cigarettesPerDay) || 0, 0, 200)),
          type: (rawCigarettes.type && ['light', 'regular', 'full-flavor'].includes(rawCigarettes.type)
            ? rawCigarettes.type
            : 'regular') as CigaretteType,
        }
      : null;

  const currency = (source.currency && source.currency in CURRENCIES
    ? source.currency
    : 'USD') as CurrencyCode;

  return {
    vaping,
    cigarettes,
    costPerVapeMl: clamp(Number(source.costPerVapeMl) || 0, 0, 1000),
    costPerPack: clamp(Number(source.costPerPack) || 0, 0, 10000),
    yearsOfUse: clamp(Number(source.yearsOfUse) || 0, 0, 80),
    age: Math.round(clamp(Number(source.age) || 0, 10, 110)),
    currency,
  };
}

/**
 * Calculate metrics for vaping only
 */
function calculateVapingMetrics(vaping: VapingInput) {
  const absorptionRate = DEVICE_ABSORPTION_RATES[vaping.deviceType];
  const nicotinePerMl = vaping.nicotineConcentration; // mg/mL
  const totalNicotineInLiquid = vaping.volumePerDay * nicotinePerMl; // mg/day in liquid
  const absorbedNicotine = totalNicotineInLiquid * absorptionRate; // mg/day absorbed

  const dailyAerosolVolumeLiters =
    (vaping.hitsPerDay * DEVICE_AEROSOL_PER_PUFF_ML[vaping.deviceType]) / 1000;

  // Rough cardiovascular estimate based on absorbed nicotine dose.
  const heartRateIncreaseBpm = Math.min(absorbedNicotine * 1.5, 30);
  const systolicBpIncreaseMmHg = Math.min(absorbedNicotine * 0.8, 20);
  const minutesPerDaySpent = (vaping.hitsPerDay * AVERAGE_HIT_DURATION_SECONDS) / 60;

  return {
    dailyNicotineMg: absorbedNicotine,
    dailyAerosolVolumeLiters,
    heartRateIncreaseBpm,
    systolicBpIncreaseMmHg,
    minutesPerDaySpent,
  };
}

/**
 * Calculate metrics for cigarettes only
 */
function calculateCigaretteMetrics(cigarettes: CigaretteInput) {
  const nicPerCig = CIGARETTE_NICOTINE_MG[cigarettes.type];
  const tarPerCig = CIGARETTE_TAR_MG[cigarettes.type];
  const coPerCig = CIGARETTE_CO_MG[cigarettes.type];

  const dailyNicotineMg = cigarettes.cigarettesPerDay * nicPerCig;
  const dailyTarMg = cigarettes.cigarettesPerDay * tarPerCig;
  const dailyCarbonMonoxideMg = cigarettes.cigarettesPerDay * coPerCig;

  // Smoke volume: average puff volume multiplied by puffs per cigarette.
  const smokePerCigaretteMl = 550;
  const dailyAerosolVolumeLiters = (cigarettes.cigarettesPerDay * smokePerCigaretteMl) / 1000;

  const heartRateIncreaseBpm = Math.min(cigarettes.cigarettesPerDay * 1.2, 35);
  const systolicBpIncreaseMmHg = Math.min(cigarettes.cigarettesPerDay * 0.6, 25);
  const minutesPerDaySpent = cigarettes.cigarettesPerDay * AVERAGE_CIGARETTE_DURATION_MINUTES;

  return {
    dailyNicotineMg,
    dailyTarMg,
    dailyCarbonMonoxideMg,
    dailyAerosolVolumeLiters,
    heartRateIncreaseBpm,
    systolicBpIncreaseMmHg,
    minutesPerDaySpent,
  };
}

/**
 * Calculate financial metrics.
 *
 * `lifetimeCost` projects current spending until age 80 (or one year, whichever
 * is longer) so the number stays meaningful for users of any age.
 */
function calculateFinancialMetrics(
  vaping: VapingInput | null,
  cigarettes: CigaretteInput | null,
  costPerVapeMl: number,
  costPerPack: number,
  age: number
) {
  let dailyCost = 0;

  if (vaping) dailyCost += vaping.volumePerDay * costPerVapeMl;
  if (cigarettes) dailyCost += (cigarettes.cigarettesPerDay / 20) * costPerPack;

  const monthlyCost = dailyCost * 30.44;
  const yearlyCost = dailyCost * DAYS_PER_YEAR;
  const tenYearCost = yearlyCost * 10;
  const projectionYears = Math.max(1, LIFE_EXPECTANCY_YEARS - age);
  const lifetimeCost = yearlyCost * projectionYears;

  return {
    dailyCost,
    monthlyCost,
    yearlyCost,
    tenYearCost,
    lifetimeCost,
    projectionYears,
  };
}

/**
 * Calculate a transparent, non-clinical composite score (0-100).
 * Each factor is also returned as a 0-100 percentage for the UI breakdown.
 */
function calculateRiskScore(
  dailyNicotineMg: number,
  dailyTarMg: number,
  dailyCarbonMonoxideMg: number,
  dailyAerosolVolumeLiters: number,
  heartRateIncreaseBpm: number,
  yearsOfUse: number,
  age: number,
  hasExposure: boolean
): {
  riskScore: number;
  riskLevel: CalculatedMetrics['riskLevel'];
  riskFactors: RiskFactors;
} {
  if (!hasExposure) {
    return {
      riskScore: 0,
      riskLevel: 'low',
      riskFactors: { nicotine: 0, chemicals: 0, respiratory: 0, cardiovascular: 0, duration: 0, age: 0 },
    };
  }

  const nicotinePoints = Math.min(dailyNicotineMg * 2, 25);
  const tarPoints = Math.min(dailyTarMg * 0.5, 15);
  const coPoints = Math.min(dailyCarbonMonoxideMg * 0.3, 10);
  const chemicalPoints = tarPoints + coPoints;
  const respiratoryPoints = Math.min(dailyAerosolVolumeLiters * 2, 15);
  const cardiovascularPoints = Math.min(heartRateIncreaseBpm * 0.35, 10);
  const durationPoints = Math.min(yearsOfUse * 0.8, 10);
  const agePoints = age < 25 ? 10 : age < 35 ? 7 : age < 50 ? 4 : age < 65 ? 2 : 0;

  const riskScore = Math.min(
    Math.round(
      nicotinePoints +
        chemicalPoints +
        respiratoryPoints +
        cardiovascularPoints +
        durationPoints +
        agePoints
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
      nicotine: Math.round((nicotinePoints / 25) * 100),
      chemicals: Math.round((chemicalPoints / 25) * 100),
      respiratory: Math.round((respiratoryPoints / 15) * 100),
      cardiovascular: Math.round((cardiovascularPoints / 10) * 100),
      duration: Math.round((durationPoints / 10) * 100),
      age: Math.round((agePoints / 10) * 100),
    },
  };
}

/**
 * Estimate days of life lost using the widely cited ~11 minutes per cigarette
 * estimate. Vaping is converted to a cigarette-equivalent using absorbed
 * nicotine, which is a rough communication aid — not a clinical prediction.
 */
function calculateLifeLostEstimate(
  vaping: VapingInput | null,
  cigarettes: CigaretteInput | null,
  yearsOfUse: number
) {
  let minutesLostPerDay = 0;

  if (cigarettes) minutesLostPerDay += cigarettes.cigarettesPerDay * 11;
  if (vaping) {
    const absorbedNicotine =
      vaping.volumePerDay * vaping.nicotineConcentration * DEVICE_ABSORPTION_RATES[vaping.deviceType];
    minutesLostPerDay += absorbedNicotine * 11;
  }

  const totalMinutesLost = minutesLostPerDay * DAYS_PER_YEAR * yearsOfUse;
  return {
    days: Math.round(totalMinutesLost / (60 * 24)),
    years: totalMinutesLost / (60 * 24 * DAYS_PER_YEAR),
  };
}

/**
 * Main calculation function
 */
export function calculateMetrics(rawInputs: UserInputs): CalculatedMetrics {
  const inputs = normalizeInputs(rawInputs);

  let dailyNicotineMg = 0;
  let dailyTarMg = 0;
  let dailyCarbonMonoxideMg = 0;
  let dailyAerosolVolumeLiters = 0;
  let heartRateIncreaseBpm = 0;
  let systolicBpIncreaseMmHg = 0;
  let minutesPerDaySpent = 0;

  if (inputs.vaping) {
    const vapingMetrics = calculateVapingMetrics(inputs.vaping);
    dailyNicotineMg += vapingMetrics.dailyNicotineMg;
    dailyAerosolVolumeLiters += vapingMetrics.dailyAerosolVolumeLiters;
    heartRateIncreaseBpm = Math.max(heartRateIncreaseBpm, vapingMetrics.heartRateIncreaseBpm);
    systolicBpIncreaseMmHg = Math.max(systolicBpIncreaseMmHg, vapingMetrics.systolicBpIncreaseMmHg);
    minutesPerDaySpent += vapingMetrics.minutesPerDaySpent;
  }

  if (inputs.cigarettes) {
    const cigMetrics = calculateCigaretteMetrics(inputs.cigarettes);
    dailyNicotineMg += cigMetrics.dailyNicotineMg;
    dailyTarMg += cigMetrics.dailyTarMg;
    dailyCarbonMonoxideMg += cigMetrics.dailyCarbonMonoxideMg;
    dailyAerosolVolumeLiters += cigMetrics.dailyAerosolVolumeLiters;
    heartRateIncreaseBpm = Math.max(heartRateIncreaseBpm, cigMetrics.heartRateIncreaseBpm);
    systolicBpIncreaseMmHg = Math.max(systolicBpIncreaseMmHg, cigMetrics.systolicBpIncreaseMmHg);
    minutesPerDaySpent += cigMetrics.minutesPerDaySpent;
  }

  const yearlyNicotineMg = dailyNicotineMg * DAYS_PER_YEAR;
  const lifetimeNicotineMg = yearlyNicotineMg * inputs.yearsOfUse;
  const yearlyTarMg = dailyTarMg * DAYS_PER_YEAR;
  const yearlyCarbonMonoxideMg = dailyCarbonMonoxideMg * DAYS_PER_YEAR;
  const yearlyAerosolVolumeLiters = dailyAerosolVolumeLiters * DAYS_PER_YEAR;
  const hoursPerYearSpent = (minutesPerDaySpent * DAYS_PER_YEAR) / 60;

  const dailyCigaretteEquivalent =
    (inputs.cigarettes?.cigarettesPerDay ?? 0) + dailyNicotineMg / 1.0;

  const financial = calculateFinancialMetrics(
    inputs.vaping,
    inputs.cigarettes,
    inputs.costPerVapeMl,
    inputs.costPerPack,
    inputs.age
  );

  const hasExposure = Boolean(inputs.vaping || inputs.cigarettes);
  const { riskScore, riskLevel, riskFactors } = calculateRiskScore(
    dailyNicotineMg,
    dailyTarMg,
    dailyCarbonMonoxideMg,
    dailyAerosolVolumeLiters,
    heartRateIncreaseBpm,
    inputs.yearsOfUse,
    inputs.age,
    hasExposure
  );

  const lifeLost = calculateLifeLostEstimate(inputs.vaping, inputs.cigarettes, inputs.yearsOfUse);

  return {
    dailyNicotineMg,
    yearlyNicotineMg,
    lifetimeNicotineMg,
    dailyTarMg,
    yearlyTarMg,
    dailyCarbonMonoxideMg,
    yearlyCarbonMonoxideMg,
    dailyAerosolVolumeLiters,
    yearlyAerosolVolumeLiters,
    dailyCigaretteEquivalent,
    heartRateIncreaseBpm,
    systolicBpIncreaseMmHg,
    dailyCost: financial.dailyCost,
    monthlyCost: financial.monthlyCost,
    yearlyCost: financial.yearlyCost,
    tenYearCost: financial.tenYearCost,
    lifetimeCost: financial.lifetimeCost,
    projectionYears: financial.projectionYears,
    minutesPerDaySpent,
    hoursPerYearSpent,
    daysOfLifeLostEstimate: lifeLost.days,
    yearsOfLifeLostEstimate: lifeLost.years,
    riskLevel,
    riskScore,
    riskFactors,
  };
}

/**
 * Generate "What If" scenarios relevant to the user's current inputs.
 */
export function generateWhatIfScenarios(rawInputs: UserInputs): WhatIfScenario[] {
  const inputs = normalizeInputs(rawInputs);
  const scenarios: WhatIfScenario[] = [
    {
      label: 'Current usage',
      description: 'Your baseline, using the numbers you entered.',
      vapingReduction: 0,
      cigaretteReduction: 0,
      metrics: calculateMetrics(inputs),
    },
  ];

  if (!inputs.vaping && !inputs.cigarettes) return scenarios;

  if (inputs.vaping && inputs.cigarettes) {
    scenarios.push({
      label: 'Cut down 50%',
      description: 'Halve both vaping and cigarette use.',
      vapingReduction: 50,
      cigaretteReduction: 50,
      metrics: calculateMetrics({
        ...inputs,
        vaping: {
          ...inputs.vaping,
          hitsPerDay: Math.round(inputs.vaping.hitsPerDay * 0.5),
          volumePerDay: inputs.vaping.volumePerDay * 0.5,
        },
        cigarettes: {
          ...inputs.cigarettes,
          cigarettesPerDay: Math.round(inputs.cigarettes.cigarettesPerDay * 0.5),
        },
      }),
    });
  } else {
    scenarios.push({
      label: 'Cut down 50%',
      description: 'Halve your current nicotine use.',
      vapingReduction: inputs.vaping ? 50 : 0,
      cigaretteReduction: inputs.cigarettes ? 50 : 0,
      metrics: calculateMetrics({
        ...inputs,
        vaping: inputs.vaping
          ? {
              ...inputs.vaping,
              hitsPerDay: Math.round(inputs.vaping.hitsPerDay * 0.5),
              volumePerDay: inputs.vaping.volumePerDay * 0.5,
            }
          : null,
        cigarettes: inputs.cigarettes
          ? { ...inputs.cigarettes, cigarettesPerDay: Math.round(inputs.cigarettes.cigarettesPerDay * 0.5) }
          : null,
      }),
    });
  }

  if (inputs.vaping && inputs.cigarettes) {
    scenarios.push({
      label: 'Quit vaping',
      description: 'Keep smoking cigarettes, stop vaping.',
      vapingReduction: 100,
      cigaretteReduction: 0,
      metrics: calculateMetrics({ ...inputs, vaping: null }),
    });
    scenarios.push({
      label: 'Quit smoking',
      description: 'Keep vaping, stop cigarettes.',
      vapingReduction: 0,
      cigaretteReduction: 100,
      metrics: calculateMetrics({ ...inputs, cigarettes: null }),
    });
  }

  scenarios.push({
    label: 'Quit entirely',
    description: 'No vaping and no cigarettes.',
    vapingReduction: inputs.vaping ? 100 : 0,
    cigaretteReduction: inputs.cigarettes ? 100 : 0,
    metrics: calculateMetrics({ ...inputs, vaping: null, cigarettes: null }),
  });

  return scenarios;
}

/**
 * Formatting helpers
 */
export function formatNumber(num: number, decimals = 0): string {
  if (!Number.isFinite(num)) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatCompactNumber(num: number): string {
  if (!Number.isFinite(num)) return '0';
  if (Math.abs(num) < 1000) return formatNumber(num, num < 10 && num % 1 !== 0 ? 1 : 0);
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD',
  maximumFractionDigits?: number
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const digits =
    maximumFractionDigits !== undefined
      ? maximumFractionDigits
      : Math.abs(safeAmount) >= 1000
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
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

export function formatCigaretteType(type: CigaretteType): string {
  return CIGARETTE_TYPE_LABELS[type];
}
