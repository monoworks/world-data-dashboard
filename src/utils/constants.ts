import type { IndicatorMeta, IndicatorCategory } from '@/types/indicator'

export const WORLD_BANK_BASE_URL = 'https://api.worldbank.org/v2'
export const REST_COUNTRIES_BASE_URL = 'https://restcountries.com/v3.1'

export const DEFAULT_YEAR_RANGE = { start: 2000, end: 2023 }
export const WORLD_COUNTRY_CODE = 'WLD'

export const INDICATOR_REGISTRY: Record<string, IndicatorMeta> = {
  // Economy
  'NY.GDP.MKTP.CD': {
    code: 'NY.GDP.MKTP.CD',
    name: 'GDP (current US$)',
    nameJa: 'GDP（名目、米ドル）',
    category: 'economy',
    unit: 'currency',
    description: 'Gross Domestic Product at current US dollars',
  },
  'NY.GDP.PCAP.CD': {
    code: 'NY.GDP.PCAP.CD',
    name: 'GDP per capita (current US$)',
    nameJa: '一人当たりGDP（米ドル）',
    category: 'economy',
    unit: 'currency',
    description: 'GDP per capita at current US dollars',
  },
  'NY.GDP.MKTP.KD.ZG': {
    code: 'NY.GDP.MKTP.KD.ZG',
    name: 'GDP growth (annual %)',
    nameJa: 'GDP成長率（年率%）',
    category: 'economy',
    unit: 'percent',
    description: 'Annual percentage growth rate of GDP',
  },
  'FP.CPI.TOTL.ZG': {
    code: 'FP.CPI.TOTL.ZG',
    name: 'Inflation, consumer prices (annual %)',
    nameJa: 'インフレ率（消費者物価、年率%）',
    category: 'economy',
    unit: 'percent',
    description: 'Annual percentage change in consumer price index',
  },

  // Population
  'SP.POP.TOTL': {
    code: 'SP.POP.TOTL',
    name: 'Population, total',
    nameJa: '総人口',
    category: 'population',
    unit: 'number',
    description: 'Total population count',
  },
  'SP.DYN.LE00.IN': {
    code: 'SP.DYN.LE00.IN',
    name: 'Life expectancy at birth (years)',
    nameJa: '平均寿命（出生時、年）',
    category: 'population',
    unit: 'years',
    description: 'Life expectancy at birth, total',
  },
  'SP.DYN.CBRT.IN': {
    code: 'SP.DYN.CBRT.IN',
    name: 'Birth rate, crude (per 1,000)',
    nameJa: '出生率（粗、1,000人当たり）',
    category: 'population',
    unit: 'per1000',
    description: 'Crude birth rate per 1,000 people',
  },
  'SP.DYN.CDRT.IN': {
    code: 'SP.DYN.CDRT.IN',
    name: 'Death rate, crude (per 1,000)',
    nameJa: '死亡率（粗、1,000人当たり）',
    category: 'population',
    unit: 'per1000',
    description: 'Crude death rate per 1,000 people',
  },

  // Trade
  'NE.TRD.GNFS.ZS': {
    code: 'NE.TRD.GNFS.ZS',
    name: 'Trade (% of GDP)',
    nameJa: '貿易（GDP比%）',
    category: 'trade',
    unit: 'percent',
    description: 'Trade as percentage of GDP',
  },
  'BX.KLT.DINV.WD.GD.ZS': {
    code: 'BX.KLT.DINV.WD.GD.ZS',
    name: 'Foreign direct investment, net inflows (% of GDP)',
    nameJa: '外国直接投資（純流入、GDP比%）',
    category: 'trade',
    unit: 'percent',
    description: 'Foreign direct investment net inflows as % of GDP',
  },

  // Social
  'SL.UEM.TOTL.ZS': {
    code: 'SL.UEM.TOTL.ZS',
    name: 'Unemployment, total (% of labor force)',
    nameJa: '失業率（労働力人口比%）',
    category: 'social',
    unit: 'percent',
    description: 'Unemployment as percentage of total labor force',
  },
  'SE.XPD.TOTL.GD.ZS': {
    code: 'SE.XPD.TOTL.GD.ZS',
    name: 'Government expenditure on education (% of GDP)',
    nameJa: '教育支出（GDP比%）',
    category: 'social',
    unit: 'percent',
    description: 'Government expenditure on education as % of GDP',
  },
  'SH.XPD.CHEX.GD.ZS': {
    code: 'SH.XPD.CHEX.GD.ZS',
    name: 'Current health expenditure (% of GDP)',
    nameJa: '医療費支出（GDP比%）',
    category: 'social',
    unit: 'percent',
    description: 'Current health expenditure as % of GDP',
  },
  'SI.POV.DDAY': {
    code: 'SI.POV.DDAY',
    name: 'Poverty headcount ratio at $2.15 a day (%)',
    nameJa: '貧困率（$2.15/日基準、%）',
    category: 'social',
    unit: 'percent',
    description: 'Percentage of population living on less than $2.15 a day',
  },

  // Governance
  'PV.EST': {
    code: 'PV.EST',
    name: 'Political Stability and Absence of Violence',
    nameJa: '政治安定性（暴力の不在）',
    category: 'governance',
    unit: 'index',
    description: 'Political Stability and Absence of Violence/Terrorism estimate',
  },
  'GE.EST': {
    code: 'GE.EST',
    name: 'Government Effectiveness',
    nameJa: '政府の効率性',
    category: 'governance',
    unit: 'index',
    description: 'Government Effectiveness estimate',
  },
  'RL.EST': {
    code: 'RL.EST',
    name: 'Rule of Law',
    nameJa: '法の支配',
    category: 'governance',
    unit: 'index',
    description: 'Rule of Law estimate',
  },
  'CC.EST': {
    code: 'CC.EST',
    name: 'Control of Corruption',
    nameJa: '腐敗の統制',
    category: 'governance',
    unit: 'index',
    description: 'Control of Corruption estimate',
  },
}

export const INDICATOR_CATEGORIES: { key: IndicatorCategory; label: string; labelJa: string }[] = [
  { key: 'economy', label: 'Economy', labelJa: '経済' },
  { key: 'population', label: 'Population', labelJa: '人口' },
  { key: 'trade', label: 'Trade', labelJa: '貿易' },
  { key: 'social', label: 'Social', labelJa: '社会' },
  { key: 'governance', label: 'Governance', labelJa: 'ガバナンス' },
]

export function getIndicatorsByCategory(category: IndicatorCategory): IndicatorMeta[] {
  return Object.values(INDICATOR_REGISTRY).filter((ind) => ind.category === category)
}

export const COMPARISON_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
]
