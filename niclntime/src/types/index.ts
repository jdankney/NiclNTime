/**
 * Types, reference data and defaults for the Nicotine Impact Visualizer.
 *
 * Every number in this file that feeds a calculation is documented with where
 * it comes from. Product specs come from manufacturer/retailer listings and are
 * only used to pre-fill the form — users can edit everything.
 */

/* -------------------------------------------------------------------------- */
/* Vaping                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Broad vape categories. Earlier versions of the app used a longer list
 * (`geek-bar`, `mod`, `fogger`, …); `normalizeInputs` maps those to these.
 */
export type DeviceType = 'disposable' | 'prefilled-pod' | 'refillable-pod' | 'sub-ohm';

/**
 * How the nicotine in the e-liquid is prepared.
 * - `salt`: nicotine mixed with a mild acid (e.g. benzoic acid). Smooth enough
 *   to sell at 20–59 mg/mL. Used in almost all disposables and pre-filled pods.
 * - `freebase`: the original form. Harsh above ~12–20 mg/mL, so it is usually
 *   sold at 3–12 mg/mL for tanks.
 */
export type NicotineType = 'salt' | 'freebase';

export interface DeviceProfile {
  label: string;
  shortLabel: string;
  description: string;
  /** Typical inhaled puff volume (mL of air + aerosol) from puff-topography studies. */
  puffVolumeMl: number;
  /**
   * Real-world puffs per mL of e-liquid, used only to suggest a puff count.
   * Low-power mouth-to-lung devices use roughly 4–8 mg of liquid per puff;
   * sub-ohm tanks use 20–30 mg. Manufacturer puff ratings are measured with
   * short lab puffs and are usually much higher than real use.
   */
  puffsPerMl: number;
  /** What the user buys/replaces: shown as "one {unit} lasts …". */
  unit: string;
  /** Nicotine type these devices normally use. */
  defaultNicotineType: NicotineType;
}

export const DEVICE_PROFILES: Record<DeviceType, DeviceProfile> = {
  disposable: {
    label: 'Disposable',
    shortLabel: 'Disposable',
    description: 'Pre-filled, single-use devices such as Geek Bar, Raz, Elf Bar and Lost Mary.',
    puffVolumeMl: 60,
    puffsPerMl: 200,
    unit: 'device',
    defaultNicotineType: 'salt',
  },
  'prefilled-pod': {
    label: 'Pre-filled pod system',
    shortLabel: 'Pre-filled pod',
    description: 'Rechargeable device with sealed pods such as JUUL, Vuse Alto and NJOY Ace.',
    puffVolumeMl: 55,
    puffsPerMl: 250,
    unit: 'pod',
    defaultNicotineType: 'salt',
  },
  'refillable-pod': {
    label: 'Refillable pod / AIO',
    shortLabel: 'Refillable pod',
    description: 'Pods you fill from a bottle, e.g. Caliburn, XROS, Vinci — usually nic salt.',
    puffVolumeMl: 70,
    puffsPerMl: 150,
    unit: 'bottle',
    defaultNicotineType: 'salt',
  },
  'sub-ohm': {
    label: 'Sub-ohm tank / mod',
    shortLabel: 'Sub-ohm tank',
    description: 'Direct-to-lung tanks and rebuildables with low-strength freebase e-liquid.',
    puffVolumeMl: 200,
    puffsPerMl: 40,
    unit: 'bottle',
    defaultNicotineType: 'freebase',
  },
};

export const DEVICE_TYPES = Object.keys(DEVICE_PROFILES) as DeviceType[];

/**
 * Share of the nicotine in the e-liquid you use up that reaches your
 * bloodstream. Lab studies find ~94% of *inhaled* nicotine is retained
 * (St Helen et al., Addiction 2016), but some nicotine never reaches the lungs
 * (condensation inside the device, mouth-held puffs, exhaled aerosol).
 *
 * Nicotine salts are absorbed faster, with a higher, more cigarette-like peak,
 * and at the same strength give somewhat higher uptake than freebase (e.g.
 * Sci Rep 2020, PMC7686355). The size of the difference in *total* daily
 * absorption isn't well established, so only a modest ±5-point adjustment
 * around the 50% central estimate is applied. Strength matters far more.
 */
export const VAPE_NICOTINE_ABSORPTION: Record<NicotineType, number> = {
  salt: 0.55,
  freebase: 0.45,
};

export const NICOTINE_TYPE_INFO: Record<NicotineType, { label: string; short: string; description: string }> = {
  salt: {
    label: 'Nicotine salt',
    short: 'Salt',
    description:
      'Smooth at high strengths (20–59 mg/mL). Hits faster with a higher, cigarette-like peak. Used in nearly all disposables and pods.',
  },
  freebase: {
    label: 'Freebase',
    short: 'Freebase',
    description:
      'Harsher, so usually 3–12 mg/mL in tanks. Nicotine builds up more slowly and peaks lower.',
  },
};
/** Plausible spread around the central estimate, shown next to vaping results. */
export const VAPE_NICOTINE_ABSORPTION_RANGE: [number, number] = [0.3, 0.7];

/** Seconds per puff, from puff-topography studies (typically 2–4 s). */
export const AVERAGE_PUFF_DURATION_SECONDS = 3;

export interface VapeProduct {
  id: string;
  name: string;
  /** Short spec line shown on the product chip. */
  detail: string;
  deviceType: DeviceType;
  /** Size of the thing you buy (device, pod or bottle), in mL. */
  unitSizeMl: number;
  /** Nicotine strength in mg/mL. "5%" on US labels ≈ 50 mg/mL. */
  nicotineMgPerMl: number;
  nicotineType: NicotineType;
  /** Manufacturer puff rating, if any. */
  ratedPuffs?: number;
  /** Rough US retail price per unit (USD), used only when the currency is USD. */
  typicalPriceUsd?: number;
  /** Where the product is typically sold — helps users find their device. */
  market: 'US' | 'UK/EU' | 'Global';
}

export const CUSTOM_PRODUCT_ID = 'custom';

export const VAPE_PRODUCTS: VapeProduct[] = [
  {
    id: 'geek-bar-pulse',
    name: 'Geek Bar Pulse',
    detail: '16 mL · 5% · 15k puffs',
    deviceType: 'disposable',
    unitSizeMl: 16,
    nicotineMgPerMl: 50,
    nicotineType: 'salt',
    ratedPuffs: 15000,
    typicalPriceUsd: 20,
    market: 'US',
  },
  {
    id: 'geek-bar-pulse-x',
    name: 'Geek Bar Pulse X',
    detail: '18 mL · 5% · 25k puffs',
    deviceType: 'disposable',
    unitSizeMl: 18,
    nicotineMgPerMl: 50,
    nicotineType: 'salt',
    ratedPuffs: 25000,
    typicalPriceUsd: 25,
    market: 'US',
  },
  {
    id: 'raz-dc25000',
    name: 'Raz DC25000',
    detail: '16 mL · 5% · 25k puffs',
    deviceType: 'disposable',
    unitSizeMl: 16,
    nicotineMgPerMl: 50,
    nicotineType: 'salt',
    ratedPuffs: 25000,
    typicalPriceUsd: 22,
    market: 'US',
  },
  {
    id: 'elf-bar-bc5000',
    name: 'Elf Bar / EBDesign BC5000',
    detail: '13 mL · 5% · 5k puffs',
    deviceType: 'disposable',
    unitSizeMl: 13,
    nicotineMgPerMl: 50,
    nicotineType: 'salt',
    ratedPuffs: 5000,
    typicalPriceUsd: 15,
    market: 'US',
  },
  {
    id: 'lost-mary-mo5000',
    name: 'Lost Mary MO5000',
    detail: '13.5 mL · 5% · 5k puffs',
    deviceType: 'disposable',
    unitSizeMl: 13.5,
    nicotineMgPerMl: 50,
    nicotineType: 'salt',
    ratedPuffs: 5000,
    typicalPriceUsd: 15,
    market: 'US',
  },
  {
    id: 'breeze-pro',
    name: 'Breeze Pro',
    detail: '6 mL · 5% · 2k puffs',
    deviceType: 'disposable',
    unitSizeMl: 6,
    nicotineMgPerMl: 50,
    nicotineType: 'salt',
    ratedPuffs: 2000,
    typicalPriceUsd: 12,
    market: 'US',
  },
  {
    id: 'tpd-600',
    name: '600-puff bar / pod (UK & EU)',
    detail: '2 mL · 20 mg/mL · 600 puffs',
    deviceType: 'prefilled-pod',
    unitSizeMl: 2,
    nicotineMgPerMl: 20,
    nicotineType: 'salt',
    ratedPuffs: 600,
    market: 'UK/EU',
  },
  {
    id: 'juul',
    name: 'JUUL pod',
    detail: '0.7 mL · 5% (≈59 mg/mL)',
    deviceType: 'prefilled-pod',
    unitSizeMl: 0.7,
    nicotineMgPerMl: 59,
    nicotineType: 'salt',
    ratedPuffs: 200,
    typicalPriceUsd: 6.5,
    market: 'US',
  },
  {
    id: 'vuse-alto',
    name: 'Vuse Alto pod',
    detail: '1.8 mL · 5%',
    deviceType: 'prefilled-pod',
    unitSizeMl: 1.8,
    nicotineMgPerMl: 50,
    nicotineType: 'salt',
    typicalPriceUsd: 6,
    market: 'US',
  },
  {
    id: 'njoy-ace',
    name: 'NJOY Ace pod',
    detail: '1.9 mL · 5%',
    deviceType: 'prefilled-pod',
    unitSizeMl: 1.9,
    nicotineMgPerMl: 50,
    nicotineType: 'salt',
    typicalPriceUsd: 6.5,
    market: 'US',
  },
  {
    id: 'salt-bottle',
    name: 'Refillable pod + nic salt',
    detail: '30 mL bottle · salt 20–50 mg/mL',
    deviceType: 'refillable-pod',
    unitSizeMl: 30,
    nicotineMgPerMl: 35,
    nicotineType: 'salt',
    typicalPriceUsd: 16,
    market: 'Global',
  },
  {
    id: 'freebase-bottle',
    name: 'Sub-ohm tank + freebase',
    detail: '100 mL bottle · freebase 3–6 mg/mL',
    deviceType: 'sub-ohm',
    unitSizeMl: 100,
    nicotineMgPerMl: 3,
    nicotineType: 'freebase',
    typicalPriceUsd: 22,
    market: 'Global',
  },
];

export const NICOTINE_STRENGTH_PRESETS = [3, 6, 12, 20, 35, 50] as const;

/* -------------------------------------------------------------------------- */
/* Cigarettes                                                                  */
/* -------------------------------------------------------------------------- */

export type CigaretteType = 'light' | 'regular' | 'full-flavor';

export const CIGARETTE_TYPE_LABELS: Record<CigaretteType, string> = {
  light: '“Light” / blue pack',
  regular: 'Regular / gold',
  'full-flavor': 'Full flavor / red',
};

/**
 * Nicotine actually absorbed per cigarette (mg). Smokers absorb ~1 mg per
 * cigarette on average (range ~0.4–1.6 mg; Benowitz & Jacob 1984). "Light"
 * cigarettes deliver nearly as much because people inhale more deeply to
 * compensate — the main reason "light" labels were banned in the US and EU.
 */
export const CIGARETTE_NICOTINE_MG: Record<CigaretteType, number> = {
  light: 0.9,
  regular: 1.0,
  'full-flavor': 1.2,
};

/** Machine-measured (ISO) tar yield per cigarette, mg. EU/UK legal maximum is 10 mg. */
export const CIGARETTE_TAR_MG: Record<CigaretteType, number> = {
  light: 6,
  regular: 10,
  'full-flavor': 14,
};

/** Machine-measured (ISO) carbon monoxide yield per cigarette, mg. EU/UK maximum is 10 mg. */
export const CIGARETTE_CO_MG: Record<CigaretteType, number> = {
  light: 7,
  regular: 10,
  'full-flavor': 13,
};

/** Total smoke volume per cigarette: ~10–12 puffs of ~45–55 mL. */
export const SMOKE_PER_CIGARETTE_ML = 550;
export const AVERAGE_CIGARETTE_DURATION_MINUTES = 6;

/**
 * Average life expectancy lost per cigarette smoked, in minutes.
 * Jackson, Jarvis & West, Addiction 2025 (UCL): ~20 minutes (≈17 for men,
 * ≈22 for women), updating the older ~11-minute estimate (Shaw et al., BMJ 2000).
 */
export const MINUTES_OF_LIFE_PER_CIGARETTE = 20;

/** Absorbed nicotine in one "average" cigarette, used for cigarette-equivalents. */
export const NICOTINE_PER_CIGARETTE_EQUIVALENT_MG = 1.0;

/* -------------------------------------------------------------------------- */
/* Nicotine pouches                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Share of a pouch's labelled nicotine that reaches the bloodstream. ZYN
 * releases ~56–59% of its nicotine during use (Lunell et al., Nicotine Tob Res
 * 2020); a little of what is released is swallowed and partly broken down by
 * the liver, so ~50% is used here.
 */
export const POUCH_NICOTINE_ABSORPTION = 0.5;

export interface PouchProduct {
  id: string;
  name: string;
  mgPerPouch: number;
  pouchesPerCan: number;
  typicalPriceUsd?: number;
}

export const POUCH_PRODUCTS: PouchProduct[] = [
  { id: 'zyn-3', name: 'ZYN 3 mg', mgPerPouch: 3, pouchesPerCan: 15, typicalPriceUsd: 6 },
  { id: 'zyn-6', name: 'ZYN 6 mg', mgPerPouch: 6, pouchesPerCan: 15, typicalPriceUsd: 6 },
  { id: 'on-4', name: 'on! 4 mg', mgPerPouch: 4, pouchesPerCan: 20, typicalPriceUsd: 5 },
  { id: 'on-8', name: 'on! 8 mg', mgPerPouch: 8, pouchesPerCan: 20, typicalPriceUsd: 5 },
  { id: 'velo-4', name: 'VELO 4 mg', mgPerPouch: 4, pouchesPerCan: 15, typicalPriceUsd: 5.5 },
  { id: 'strong-10', name: 'Strong (UK/EU) 10 mg', mgPerPouch: 10, pouchesPerCan: 20 },
];

/* -------------------------------------------------------------------------- */
/* Inputs                                                                      */
/* -------------------------------------------------------------------------- */

export interface VapingInput {
  /** Product preset used to fill the form, or `custom`. */
  productId: string;
  deviceType: DeviceType;
  nicotineConcentration: number; // mg/mL
  nicotineType: NicotineType;
  /** Size of one device/pod/bottle in mL. Used to convert "lasts N days" and price per unit. */
  unitSizeMl: number;
  volumePerDay: number; // mL
  hitsPerDay: number;
}

export interface CigaretteInput {
  cigarettesPerDay: number;
  type: CigaretteType;
  /** Cigarettes in the pack you buy (20 is standard; 25 is common in AU/CA). */
  packSize: number;
}

export interface PouchInput {
  productId: string;
  pouchesPerDay: number;
  mgPerPouch: number;
  pouchesPerCan: number;
}

export interface UserInputs {
  vaping: VapingInput | null;
  cigarettes: CigaretteInput | null;
  pouches: PouchInput | null;
  costPerVapeMl: number; // in the selected currency
  costPerPack: number; // in the selected currency
  costPerCan: number; // in the selected currency
  yearsOfUse: number;
  age: number;
  currency: CurrencyCode;
}

/* -------------------------------------------------------------------------- */
/* Outputs                                                                     */
/* -------------------------------------------------------------------------- */

export interface RiskFactors {
  nicotine: number;
  chemicals: number;
  respiratory: number;
  cardiovascular: number;
  duration: number;
  age: number;
}

export interface NicotineBySource {
  vaping: number;
  cigarettes: number;
  pouches: number;
}

export interface CalculatedMetrics {
  // Nicotine metrics (absorbed, mg)
  dailyNicotineMg: number;
  yearlyNicotineMg: number;
  lifetimeNicotineMg: number;
  nicotineBySource: NicotineBySource;
  /** Nicotine contained in what you use each day (before absorption). */
  dailyNicotineContentMg: number;

  // Chemical exposure (cigarettes)
  dailyTarMg: number;
  yearlyTarMg: number;
  dailyCarbonMonoxideMg: number;
  yearlyCarbonMonoxideMg: number;
  packYears: number;

  // Respiratory
  dailyAerosolVolumeLiters: number;
  dailySmokeVolumeLiters: number;
  dailyVapeAerosolLiters: number;
  yearlyAerosolVolumeLiters: number;
  dailyCigaretteEquivalent: number;

  // Cardiovascular
  heartRateIncreaseBpm: number;
  systolicBpIncreaseMmHg: number;

  // Financial
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  tenYearCost: number;
  lifetimeCost: number;
  projectionYears: number;

  // Time
  minutesPerDaySpent: number;
  hoursPerYearSpent: number;
  /** Life expectancy lost so far from smoking, in days. */
  daysOfLifeLostEstimate: number;
  yearsOfLifeLostEstimate: number;
  /** Life expectancy lost per year of continued smoking at the current rate, in days. */
  daysLostPerYear: number;
  /** True when smoking is part of the inputs, so the life-lost estimate applies. */
  lifeLostApplies: boolean;
  /** True when vaping or pouches are used — their long-term mortality is not established. */
  hasNonCombustible: boolean;

  // Risk level
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskScore: number; // 0-100
  riskFactors: RiskFactors;
}

export interface WhatIfScenario {
  id: string;
  label: string;
  description: string;
  metrics: CalculatedMetrics;
}

/* -------------------------------------------------------------------------- */
/* Currencies                                                                  */
/* -------------------------------------------------------------------------- */

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CAD'
  | 'AUD'
  | 'NZD'
  | 'JPY'
  | 'CNY'
  | 'INR'
  | 'BRL'
  | 'MXN'
  | 'ZAR'
  | 'SEK'
  | 'NOK'
  | 'DKK'
  | 'CHF'
  | 'PLN'
  | 'TRY'
  | 'KRW'
  | 'SGD'
  | 'HKD'
  | 'PHP'
  | 'IDR'
  | 'MYR'
  | 'THB'
  | 'AED'
  | 'SAR'
  | 'NGN'
  | 'KES'
  | 'EGP'
  | 'PKR'
  | 'BDT'
  | 'VND'
  | 'ARS'
  | 'CLP'
  | 'COP'
  | 'PEN'
  | 'UAH'
  | 'CZK'
  | 'HUF'
  | 'RON'
  | 'ILS'
  | 'TWD';

export interface CurrencyInfo {
  code: CurrencyCode;
  label: string;
  symbol: string;
  /**
   * Approximate units per 1 USD (late 2025). Only used to scale the
   * "what this could buy" examples into sensible local amounts — never to
   * convert anything the user typed.
   */
  perUsd: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', label: 'US Dollar', symbol: '$', perUsd: 1 },
  EUR: { code: 'EUR', label: 'Euro', symbol: '€', perUsd: 0.86 },
  GBP: { code: 'GBP', label: 'British Pound', symbol: '£', perUsd: 0.76 },
  CAD: { code: 'CAD', label: 'Canadian Dollar', symbol: 'C$', perUsd: 1.4 },
  AUD: { code: 'AUD', label: 'Australian Dollar', symbol: 'A$', perUsd: 1.53 },
  NZD: { code: 'NZD', label: 'New Zealand Dollar', symbol: 'NZ$', perUsd: 1.75 },
  JPY: { code: 'JPY', label: 'Japanese Yen', symbol: '¥', perUsd: 152 },
  CNY: { code: 'CNY', label: 'Chinese Yuan', symbol: '¥', perUsd: 7.1 },
  INR: { code: 'INR', label: 'Indian Rupee', symbol: '₹', perUsd: 88 },
  BRL: { code: 'BRL', label: 'Brazilian Real', symbol: 'R$', perUsd: 5.4 },
  MXN: { code: 'MXN', label: 'Mexican Peso', symbol: 'MX$', perUsd: 18.5 },
  ZAR: { code: 'ZAR', label: 'South African Rand', symbol: 'R', perUsd: 17.5 },
  SEK: { code: 'SEK', label: 'Swedish Krona', symbol: 'kr', perUsd: 9.5 },
  NOK: { code: 'NOK', label: 'Norwegian Krone', symbol: 'kr', perUsd: 10.1 },
  DKK: { code: 'DKK', label: 'Danish Krone', symbol: 'kr', perUsd: 6.45 },
  CHF: { code: 'CHF', label: 'Swiss Franc', symbol: 'CHF', perUsd: 0.8 },
  PLN: { code: 'PLN', label: 'Polish Złoty', symbol: 'zł', perUsd: 3.65 },
  TRY: { code: 'TRY', label: 'Turkish Lira', symbol: '₺', perUsd: 42 },
  KRW: { code: 'KRW', label: 'South Korean Won', symbol: '₩', perUsd: 1420 },
  SGD: { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$', perUsd: 1.3 },
  HKD: { code: 'HKD', label: 'Hong Kong Dollar', symbol: 'HK$', perUsd: 7.78 },
  PHP: { code: 'PHP', label: 'Philippine Peso', symbol: '₱', perUsd: 58.5 },
  IDR: { code: 'IDR', label: 'Indonesian Rupiah', symbol: 'Rp', perUsd: 16600 },
  MYR: { code: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM', perUsd: 4.2 },
  THB: { code: 'THB', label: 'Thai Baht', symbol: '฿', perUsd: 32.5 },
  AED: { code: 'AED', label: 'UAE Dirham', symbol: 'د.إ', perUsd: 3.67 },
  SAR: { code: 'SAR', label: 'Saudi Riyal', symbol: '﷼', perUsd: 3.75 },
  NGN: { code: 'NGN', label: 'Nigerian Naira', symbol: '₦', perUsd: 1460 },
  KES: { code: 'KES', label: 'Kenyan Shilling', symbol: 'KSh', perUsd: 129 },
  EGP: { code: 'EGP', label: 'Egyptian Pound', symbol: 'E£', perUsd: 47.5 },
  PKR: { code: 'PKR', label: 'Pakistani Rupee', symbol: '₨', perUsd: 282 },
  BDT: { code: 'BDT', label: 'Bangladeshi Taka', symbol: '৳', perUsd: 122 },
  VND: { code: 'VND', label: 'Vietnamese Đồng', symbol: '₫', perUsd: 26300 },
  ARS: { code: 'ARS', label: 'Argentine Peso', symbol: 'AR$', perUsd: 1450 },
  CLP: { code: 'CLP', label: 'Chilean Peso', symbol: 'CL$', perUsd: 940 },
  COP: { code: 'COP', label: 'Colombian Peso', symbol: 'CO$', perUsd: 3850 },
  PEN: { code: 'PEN', label: 'Peruvian Sol', symbol: 'S/', perUsd: 3.4 },
  UAH: { code: 'UAH', label: 'Ukrainian Hryvnia', symbol: '₴', perUsd: 41.8 },
  CZK: { code: 'CZK', label: 'Czech Koruna', symbol: 'Kč', perUsd: 21 },
  HUF: { code: 'HUF', label: 'Hungarian Forint', symbol: 'Ft', perUsd: 335 },
  RON: { code: 'RON', label: 'Romanian Leu', symbol: 'lei', perUsd: 4.38 },
  ILS: { code: 'ILS', label: 'Israeli New Shekel', symbol: '₪', perUsd: 3.25 },
  TWD: { code: 'TWD', label: 'New Taiwan Dollar', symbol: 'NT$', perUsd: 30.7 },
};

export const CURRENCY_OPTIONS = (Object.values(CURRENCIES) as CurrencyInfo[])
  .sort((a, b) => a.code.localeCompare(b.code))
  .map((currency) => ({
    value: currency.code,
    label: `${currency.code} — ${currency.label} (${currency.symbol})`,
  }));

/* -------------------------------------------------------------------------- */
/* General constants and defaults                                              */
/* -------------------------------------------------------------------------- */

export const RISK_THRESHOLDS = {
  low: 25,
  moderate: 50,
  high: 75,
};

export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const DAYS_PER_YEAR = 365.25;
export const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;
export const LIFE_EXPECTANCY_YEARS = 80;
export const MINUTES_PER_DAY = 1440;

/** Long-run stock-market return after inflation, used for the "if invested" illustration. */
export const REAL_INVESTMENT_RETURN = 0.07;

export const DEFAULT_VAPING: VapingInput = {
  productId: 'geek-bar-pulse',
  deviceType: 'disposable',
  nicotineConcentration: 50,
  nicotineType: 'salt',
  unitSizeMl: 16,
  volumePerDay: 16 / 7,
  hitsPerDay: Math.round((16 / 7) * DEVICE_PROFILES.disposable.puffsPerMl),
};

export const DEFAULT_CIGARETTES: CigaretteInput = {
  cigarettesPerDay: 10,
  type: 'regular',
  packSize: 20,
};

export const DEFAULT_POUCHES: PouchInput = {
  productId: 'zyn-6',
  pouchesPerDay: 8,
  mgPerPouch: 6,
  pouchesPerCan: 15,
};

export const DEFAULT_INPUTS: UserInputs = {
  vaping: null,
  cigarettes: null,
  pouches: null,
  costPerVapeMl: 20 / 16,
  costPerPack: 10,
  costPerCan: 6,
  yearsOfUse: 3,
  age: 25,
  currency: 'USD',
};

export const EXAMPLE_INPUTS: UserInputs = {
  vaping: { ...DEFAULT_VAPING },
  cigarettes: {
    cigarettesPerDay: 4,
    type: 'regular',
    packSize: 20,
  },
  pouches: null,
  costPerVapeMl: 20 / 16,
  costPerPack: 10,
  costPerCan: 6,
  yearsOfUse: 4,
  age: 22,
  currency: 'USD',
};
