import type { Lang } from '@/stores/uiStore'

const translations = {
  // App
  'app.title': { en: 'World Data Dashboard', ja: '世界データダッシュボード' },
  'app.description': {
    en: 'Explore economic indicators, population demographics, and more across the globe.',
    ja: '世界各国の経済指標、人口統計などを探索できます。',
  },
  'app.footer': { en: 'World Data Dashboard', ja: '世界データダッシュボード' },
  'app.footer.dataFrom': { en: 'Data from', ja: 'データ提供' },

  // Navigation
  'nav.dashboard': { en: 'Dashboard', ja: 'ダッシュボード' },
  'nav.indicators': { en: 'Indicators', ja: '指標一覧' },
  'nav.compare': { en: 'Compare', ja: '比較' },
  'nav.menu': { en: 'Menu', ja: 'メニュー' },

  // Dashboard
  'dashboard.title': { en: 'World Data Dashboard', ja: '世界データダッシュボード' },
  'dashboard.worldPopulation': { en: 'World Population', ja: '世界人口' },
  'dashboard.globalGDP': { en: 'Global GDP', ja: '世界GDP' },
  'dashboard.avgLifeExpectancy': { en: 'Avg Life Expectancy', ja: '平均寿命' },
  'dashboard.avgUnemployment': { en: 'Avg Unemployment', ja: '平均失業率' },
  'dashboard.selectIndicator': { en: 'Select an indicator', ja: '指標を選択してください' },
  'dashboard.top10': { en: 'Top 10 Countries', ja: 'トップ10ヵ国' },
  'dashboard.exportMapData': { en: 'Export Map Data', ja: '地図データを出力' },

  // Indicators
  'indicators.title': { en: 'Indicators', ja: '指標一覧' },
  'indicators.description': {
    en: 'Browse available World Bank indicators by category.',
    ja: 'World Bankの指標をカテゴリ別に閲覧できます。',
  },
  'indicators.compareCountries': { en: 'Compare Countries', ja: '国を比較' },

  // Comparison
  'comparison.title': { en: 'Country Comparison', ja: '国別比較' },
  'comparison.countries': { en: 'Countries (max 5)', ja: '国（最大5ヵ国）' },
  'comparison.timeRange': { en: 'Time Range', ja: '期間' },
  'comparison.indicator': { en: 'Indicator', ja: '指標' },
  'comparison.selectPrompt': {
    en: 'Select at least 2 countries above to start comparing.',
    ja: '比較するには上のリストから2ヵ国以上を選択してください。',
  },
  'comparison.trendOverTime': { en: 'Trend Over Time', ja: '時系列推移' },
  'comparison.latestValues': { en: 'Latest Values Comparison', ja: '最新値の比較' },
  'comparison.selectCountries': { en: 'Select countries to compare...', ja: '比較する国を選択...' },
  'comparison.loadingCountries': { en: 'Loading countries...', ja: '国データを読み込み中...' },
  'comparison.failedLoadCountries': { en: 'Failed to load countries.', ja: '国データの読み込みに失敗しました。' },
  'comparison.retry': { en: 'Retry', ja: '再試行' },

  // Country Detail
  'country.overview': { en: 'Overview', ja: '概要' },
  'country.indicators': { en: 'Economic Indicators', ja: '経済指標' },
  'country.population': { en: 'Population', ja: '人口' },
  'country.region': { en: 'Region', ja: '地域' },
  'country.subregion': { en: 'Subregion', ja: 'サブ地域' },
  'country.capital': { en: 'Capital', ja: '首都' },
  'country.back': { en: 'Back', ja: '戻る' },
  'country.notFound': { en: 'Country not found', ja: '国が見つかりません' },
  'country.compareWith': { en: 'Compare with other countries', ja: '他の国と比較' },

  // Common
  'common.loading': { en: 'Loading...', ja: '読み込み中...' },
  'common.loadingWorldMap': { en: 'Loading world map...', ja: '世界地図を読み込み中...' },
  'common.error': { en: 'Something went wrong', ja: 'エラーが発生しました' },
  'common.errorMessage': { en: 'An unexpected error occurred.', ja: '予期しないエラーが発生しました。' },
  'common.errorRetry': { en: 'Try Again', ja: '再試行' },
  'common.errorLoadData': { en: 'Failed to load data. Please try again.', ja: 'データの読み込みに失敗しました。再試行してください。' },
  'common.retry': { en: 'Retry', ja: '再試行' },
  'common.export': { en: 'Export', ja: '出力' },
  'common.exportJSON': { en: 'Export JSON', ja: 'JSON出力' },
  'common.import': { en: 'Import', ja: '読み込み' },
  'common.importJSON': { en: 'Import JSON', ja: 'JSON読み込み' },
  'common.noData': { en: 'No data', ja: 'データなし' },

  // 404
  'notFound.title': { en: 'Page Not Found', ja: 'ページが見つかりません' },
  'notFound.description': {
    en: "The page you're looking for doesn't exist.",
    ja: 'お探しのページは存在しません。',
  },
  'notFound.backHome': { en: 'Back to Dashboard', ja: 'ダッシュボードに戻る' },

  // Categories
  'category.economy': { en: 'Economy', ja: '経済' },
  'category.population': { en: 'Population', ja: '人口' },
  'category.trade': { en: 'Trade', ja: '貿易' },
  'category.social': { en: 'Social', ja: '社会' },
  'category.governance': { en: 'Governance', ja: 'ガバナンス' },
  'category.environment': { en: 'Environment', ja: '環境' },
  'category.technology': { en: 'Technology', ja: 'テクノロジー' },
} as const

export type TranslationKey = keyof typeof translations

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] ?? translations[key]?.en ?? key
}

// Helper: get indicator display name based on language
import type { IndicatorMeta } from '@/types/indicator'

export function indicatorName(meta: IndicatorMeta | undefined, lang: Lang): string {
  if (!meta) return ''
  return lang === 'ja' && meta.nameJa ? meta.nameJa : meta.name
}

// Helper: get category display name based on language
import { INDICATOR_CATEGORIES } from './constants'

export function categoryName(key: string, lang: Lang): string {
  const cat = INDICATOR_CATEGORIES.find((c) => c.key === key)
  if (!cat) return key
  return lang === 'ja' ? cat.labelJa : cat.label
}
