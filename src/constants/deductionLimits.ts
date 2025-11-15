import type { LifeInsuranceDeductionEntry } from '../domain/types';

/**
 * 地震保険料控除の上限額
 *
 * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1145.htm
 */
export const EARTHQUAKE_INSURANCE_MAX = 50_000;

/**
 * 医療費控除の計算に使用する定数
 *
 * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1120.htm
 */
export const MEDICAL_EXPENSE_THRESHOLD = 100_000; // 10万円
export const MEDICAL_EXPENSE_MAX = 2_000_000; // 上限200万円
export const MEDICAL_EXPENSE_INCOME_RATE = 0.05; // 所得の5%

/**
 * 寄附金控除の計算に使用する定数
 *
 * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1150.htm
 */
export const DONATION_SELF_BURDEN = 2_000; // 自己負担額
export const DONATION_INCOME_LIMIT_RATE = 0.4; // 所得の40%が上限

/**
 * 生命保険料控除の計算テーブル（新制度）
 *
 * 2012年1月1日以後に締結した保険契約
 *
 * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1140.htm
 */
export const LIFE_INSURANCE_NEW_SYSTEM: LifeInsuranceDeductionEntry[] = [
  { paymentMax: 20_000 },
  { paymentMax: 40_000 },
  { paymentMax: 80_000 },
  { paymentMax: Number.POSITIVE_INFINITY },
];

/**
 * 生命保険料控除の計算テーブル（旧制度）
 *
 * 2011年12月31日以前に締結した保険契約
 *
 * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1140.htm
 */
export const LIFE_INSURANCE_OLD_SYSTEM: LifeInsuranceDeductionEntry[] = [
  { paymentMax: 25_000 },
  { paymentMax: 50_000 },
  { paymentMax: 100_000 },
  { paymentMax: Number.POSITIVE_INFINITY },
];

/**
 * 生命保険料控除の合計上限額
 */
export const LIFE_INSURANCE_MAX_NEW = 120_000; // 新制度：最大12万円
export const LIFE_INSURANCE_MAX_OLD = 100_000; // 旧制度：最大10万円
