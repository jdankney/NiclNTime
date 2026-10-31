/**
 * Type definitions for the Nicotine Impact Visualizer
 */

export type DeviceType =
  | 'disposable'
  | 'pod'
  | 'mod'
  | 'geek-bar'
  | 'fogger'
  | 'pod-mod'
  | 'squonk'
  | 'aio'
  | 'cigalike';

export type CigaretteType = 'light' | 'regular' | 'full-flavor';

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
}

export interface VapingInput {
  hitsPerDay: number;
  deviceType: DeviceType;
  nicotineConcentration: number; // mg/mL
  volumePerDay: number; // mL
}

export interface CigaretteInput {
  cigarettesPerDay: number;
  type: CigaretteType;
}

export interface UserInputs {
  vaping: VapingInput | null;
  cigarettes: CigaretteInput | null;
  costPerVapeMl: number; // in the selected currency
  costPerPack: number; // in the selected currency
  yearsOfUse: number;
  age: number;
  currency: CurrencyCode;
}

export interface RiskFactors {
  nicotine: number;
  chemicals: number;
  respiratory: number;
  cardiovascular: number;
  duration: number;
  age: number;
}

export interface CalculatedMetrics {
  // Nicotine metrics
  dailyNicotineMg: number;
  yearlyNicotineMg: number;
  lifetimeNicotineMg: number;

  // Chemical exposure (cigarettes)
  dailyTarMg: number;
  yearlyTarMg: number;
  dailyCarbonMonoxideMg: number;
  yearlyCarbonMonoxideMg: number;

  // Respiratory
  dailyAerosolVolumeLiters: number;
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
  daysOfLifeLostEstimate: number;
  yearsOfLifeLostEstimate: number;

  // Risk level
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskScore: number; // 0-100
  riskFactors: RiskFactors;
}

export interface WhatIfScenario {
  label: string;
  description: string;
  vapingReduction: number; // percentage 0-100
  cigaretteReduction: number; // percentage 0-100
  metrics: CalculatedMetrics;
}

export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  disposable: 'Disposable (Standard)',
  pod: 'Pod System (Closed)',
  mod: 'Mod / Tank (Sub-ohm)',
  'geek-bar': 'Geek Bar / Elf Bar',
  fogger: 'Fogger / Cloud Chaser',
  'pod-mod': 'Pod Mod (Refillable)',
  squonk: 'Squonk / Bottom-Feeder',
  aio: 'AIO (All-in-One)',
  cigalike: 'Cigalike (Classic)',
};

export const DEVICE_SHORT_LABELS: Record<DeviceType, string> = {
  disposable: 'Disposable',
  pod: 'Pod system',
  mod: 'Mod / tank',
  'geek-bar': 'Geek / Elf Bar',
  fogger: 'Cloud chaser',
  'pod-mod': 'Pod mod',
  squonk: 'Squonk',
  aio: 'AIO',
  cigalike: 'Cigalike',
};

export const DEVICE_ABSORPTION_RATES: Record<DeviceType, number> = {
  disposable: 0.3, // ~30% nicotine absorption
  pod: 0.4, // ~40% nicotine absorption (nic salts)
  mod: 0.25, // ~25% nicotine absorption (freebase)
  'geek-bar': 0.45, // ~45% - high nic salt concentration, efficient delivery
  fogger: 0.2, // ~20% - high VG, lower nic, huge volume
  'pod-mod': 0.35, // ~35% - middle ground
  squonk: 0.22, // ~22% - similar to mod, dripper-style
  aio: 0.3, // ~30% - similar to pod/mod hybrid
  cigalike: 0.15, // ~15% - older tech, less efficient
};

export const DEVICE_AEROSOL_PER_PUFF_ML: Record<DeviceType, number> = {
  disposable: 45,
  pod: 55,
  mod: 100,
  'geek-bar': 50,
  fogger: 150,
  'pod-mod': 70,
  squonk: 110,
  aio: 65,
  cigalike: 30,
};

export const DEVICE_DESCRIPTIONS: Record<DeviceType, string> = {
  disposable: 'Convenience-first devices, often high-strength nicotine salts.',
  pod: 'Closed pod systems such as JUUL, Vuse and similar devices.',
  mod: 'Refillable tanks, typically lower-strength freebase nicotine.',
  'geek-bar': 'Popular high-strength disposable brands with efficient nicotine delivery.',
  fogger: 'High-VG, low-nicotine setups that produce very large clouds.',
  'pod-mod': 'Refillable pods with replaceable coils — a versatile middle ground.',
  squonk: 'Bottom-feeding drippers for rebuildable atomizers.',
  aio: 'Compact all-in-one devices such as Billet Box style kits.',
  cigalike: 'First-generation cigarette-style devices with lower efficiency.',
};

export const CIGARETTE_TYPE_LABELS: Record<CigaretteType, string> = {
  light: 'Light / Ultra Light',
  regular: 'Regular',
  'full-flavor': 'Full Flavor',
};

export const CIGARETTE_NICOTINE_MG: Record<CigaretteType, number> = {
  light: 0.6,
  regular: 1.0,
  'full-flavor': 1.3,
};

export const CIGARETTE_TAR_MG: Record<CigaretteType, number> = {
  light: 6,
  regular: 12,
  'full-flavor': 18,
};

export const CIGARETTE_CO_MG: Record<CigaretteType, number> = {
  light: 7,
  regular: 12,
  'full-flavor': 17,
};

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', label: 'US Dollar', symbol: '$' },
  EUR: { code: 'EUR', label: 'Euro', symbol: '€' },
  GBP: { code: 'GBP', label: 'British Pound', symbol: '£' },
  CAD: { code: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
  AUD: { code: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  NZD: { code: 'NZD', label: 'New Zealand Dollar', symbol: 'NZ$' },
  JPY: { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  CNY: { code: 'CNY', label: 'Chinese Yuan', symbol: '¥' },
  INR: { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
  BRL: { code: 'BRL', label: 'Brazilian Real', symbol: 'R$' },
  MXN: { code: 'MXN', label: 'Mexican Peso', symbol: 'MX$' },
  ZAR: { code: 'ZAR', label: 'South African Rand', symbol: 'R' },
  SEK: { code: 'SEK', label: 'Swedish Krona', symbol: 'kr' },
  NOK: { code: 'NOK', label: 'Norwegian Krone', symbol: 'kr' },
  DKK: { code: 'DKK', label: 'Danish Krone', symbol: 'kr' },
  CHF: { code: 'CHF', label: 'Swiss Franc', symbol: 'CHF' },
  PLN: { code: 'PLN', label: 'Polish Złoty', symbol: 'zł' },
  TRY: { code: 'TRY', label: 'Turkish Lira', symbol: '₺' },
  KRW: { code: 'KRW', label: 'South Korean Won', symbol: '₩' },
  SGD: { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$' },
  HKD: { code: 'HKD', label: 'Hong Kong Dollar', symbol: 'HK$' },
  PHP: { code: 'PHP', label: 'Philippine Peso', symbol: '₱' },
  IDR: { code: 'IDR', label: 'Indonesian Rupiah', symbol: 'Rp' },
  MYR: { code: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM' },
  THB: { code: 'THB', label: 'Thai Baht', symbol: '฿' },
  AED: { code: 'AED', label: 'UAE Dirham', symbol: 'د.إ' },
  SAR: { code: 'SAR', label: 'Saudi Riyal', symbol: '﷼' },
  NGN: { code: 'NGN', label: 'Nigerian Naira', symbol: '₦' },
  KES: { code: 'KES', label: 'Kenyan Shilling', symbol: 'KSh' },
  EGP: { code: 'EGP', label: 'Egyptian Pound', symbol: 'E£' },
  PKR: { code: 'PKR', label: 'Pakistani Rupee', symbol: '₨' },
  BDT: { code: 'BDT', label: 'Bangladeshi Taka', symbol: '৳' },
  VND: { code: 'VND', label: 'Vietnamese Đồng', symbol: '₫' },
  ARS: { code: 'ARS', label: 'Argentine Peso', symbol: 'AR$' },
  CLP: { code: 'CLP', label: 'Chilean Peso', symbol: 'CL$' },
  COP: { code: 'COP', label: 'Colombian Peso', symbol: 'CO$' },
  PEN: { code: 'PEN', label: 'Peruvian Sol', symbol: 'S/' },
  UAH: { code: 'UAH', label: 'Ukrainian Hryvnia', symbol: '₴' },
  CZK: { code: 'CZK', label: 'Czech Koruna', symbol: 'Kč' },
  HUF: { code: 'HUF', label: 'Hungarian Forint', symbol: 'Ft' },
  RON: { code: 'RON', label: 'Romanian Leu', symbol: 'lei' },
  ILS: { code: 'ILS', label: 'Israeli New Shekel', symbol: '₪' },
  TWD: { code: 'TWD', label: 'New Taiwan Dollar', symbol: 'NT$' },
};

export const CURRENCY_OPTIONS = (Object.values(CURRENCIES) as CurrencyInfo[])
  .sort((a, b) => a.code.localeCompare(b.code))
  .map((currency) => ({
    value: currency.code,
    label: `${currency.code} — ${currency.label} (${currency.symbol})`,
  }));

export const RISK_THRESHOLDS = {
  low: 25,
  moderate: 50,
  high: 75,
};

export const AVERAGE_HIT_DURATION_SECONDS = 3;
export const AVERAGE_CIGARETTE_DURATION_MINUTES = 6;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const DAYS_PER_YEAR = 365.25;
export const LIFE_EXPECTANCY_YEARS = 80;
export const MINUTES_PER_DAY = 1440;

export const DEFAULT_INPUTS: UserInputs = {
  vaping: null,
  cigarettes: null,
  costPerVapeMl: 0.3,
  costPerPack: 10,
  yearsOfUse: 5,
  age: 25,
  currency: 'USD',
};

export const EXAMPLE_INPUTS: UserInputs = {
  vaping: {
    hitsPerDay: 180,
    deviceType: 'geek-bar',
    nicotineConcentration: 20,
    volumePerDay: 2,
  },
  cigarettes: {
    cigarettesPerDay: 6,
    type: 'regular',
  },
  costPerVapeMl: 0.3,
  costPerPack: 10,
  yearsOfUse: 4,
  age: 24,
  currency: 'USD',
};
