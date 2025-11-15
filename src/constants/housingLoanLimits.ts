import type { HousingType } from '../domain/types';
import type { HousingLoanLimit } from '../domain/types';

/**
 * 住宅ローン控除の借入限度額表
 *
 * 居住開始年と住宅の種類に応じた借入限度額と控除期間
 *
 * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1213.htm
 */
export const HOUSING_LOAN_LIMITS: Record<number, Record<HousingType, HousingLoanLimit>> = {
  2022: {
    'new-certified': {
      limit: 50_000_000,
      years: 13,
    },
    'new-zeh': {
      limit: 45_000_000,
      years: 13,
    },
    'new-energy-saving': {
      limit: 40_000_000,
      years: 13,
    },
    'new-other': {
      limit: 30_000_000,
      years: 13,
    },
    used: {
      limit: 20_000_000,
      years: 10,
    },
  },
  2023: {
    'new-certified': {
      limit: 50_000_000,
      years: 13,
    },
    'new-zeh': {
      limit: 45_000_000,
      years: 13,
    },
    'new-energy-saving': {
      limit: 40_000_000,
      years: 13,
    },
    'new-other': {
      limit: 0, // 2023年以降の新築その他は控除対象外
      years: 0,
    },
    used: {
      limit: 30_000_000,
      years: 10,
    },
  },
  2024: {
    'new-certified': {
      limit: 45_000_000,
      years: 13,
    },
    'new-zeh': {
      limit: 35_000_000,
      years: 13,
    },
    'new-energy-saving': {
      limit: 30_000_000,
      years: 13,
    },
    'new-other': {
      limit: 0, // 2024年以降の新築その他は控除対象外
      years: 0,
    },
    used: {
      limit: 30_000_000,
      years: 10,
    },
  },
  2025: {
    'new-certified': {
      limit: 45_000_000,
      years: 13,
    },
    'new-zeh': {
      limit: 35_000_000,
      years: 13,
    },
    'new-energy-saving': {
      limit: 30_000_000,
      years: 13,
    },
    'new-other': {
      limit: 0, // 2025年の新築その他は控除対象外
      years: 0,
    },
    used: {
      limit: 30_000_000,
      years: 10,
    },
  },
};

/**
 * 住宅ローン控除の控除率
 *
 * 年末借入残高の0.7%
 */
export const HOUSING_LOAN_RATE = 0.007;
