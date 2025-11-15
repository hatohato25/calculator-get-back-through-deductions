import type { TaxRateEntry } from '../domain/types';

/**
 * 所得税率表（令和7年分）
 *
 * 累進課税：課税所得に応じて7段階の税率を適用
 *
 * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
 */
export const INCOME_TAX_RATES: TaxRateEntry[] = [
  {
    min: 0,
    max: 1_949_000,
    rate: 0.05,
    deduction: 0,
  },
  {
    min: 1_950_000,
    max: 3_299_000,
    rate: 0.1,
    deduction: 97_500,
  },
  {
    min: 3_300_000,
    max: 6_949_000,
    rate: 0.2,
    deduction: 427_500,
  },
  {
    min: 6_950_000,
    max: 8_999_000,
    rate: 0.23,
    deduction: 636_000,
  },
  {
    min: 9_000_000,
    max: 17_999_000,
    rate: 0.33,
    deduction: 1_536_000,
  },
  {
    min: 18_000_000,
    max: 39_999_000,
    rate: 0.4,
    deduction: 2_796_000,
  },
  {
    min: 40_000_000,
    max: Number.POSITIVE_INFINITY,
    rate: 0.45,
    deduction: 4_796_000,
  },
];

/**
 * 住民税率（所得割）
 *
 * 一律10%（都道府県民税4% + 市区町村民税6%）
 * ※均等割（5,000円程度）は本計算では省略
 *
 * 参照: https://www.tax.metro.tokyo.lg.jp/kazei/kojin_ju.html
 */
export const RESIDENT_TAX_RATE = 0.1;

/**
 * 基礎控除額
 *
 * 令和2年分以降、合計所得金額が2,400万円以下の場合は一律48万円
 *
 * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1199.htm
 */
export const BASIC_DEDUCTION = 480_000;
