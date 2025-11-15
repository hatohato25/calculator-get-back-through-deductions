import type { SalaryDeductionEntry } from '../domain/types';

/**
 * 給与所得控除表（令和7年分）
 *
 * 給与収入から給与所得を算出するための控除額表
 *
 * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm
 */
export const SALARY_DEDUCTION_TABLE: SalaryDeductionEntry[] = [
  {
    min: 0,
    max: 1_625_000,
    deduction: 550_000,
  },
  {
    min: 1_625_001,
    max: 1_800_000,
    rate: 0.4,
    adjustment: -100_000,
  },
  {
    min: 1_800_001,
    max: 3_600_000,
    rate: 0.3,
    adjustment: 80_000,
  },
  {
    min: 3_600_001,
    max: 6_600_000,
    rate: 0.2,
    adjustment: 440_000,
  },
  {
    min: 6_600_001,
    max: 8_500_000,
    rate: 0.1,
    adjustment: 1_100_000,
  },
  {
    min: 8_500_001,
    max: Number.POSITIVE_INFINITY,
    deduction: 1_950_000,
  },
];

/**
 * 社会保険料の概算率
 *
 * 給与収入に対する社会保険料の概算（健康保険・厚生年金・雇用保険の合計）
 * 標準報酬月額の約15%を想定
 *
 * 参照: https://www.nenkin.go.jp/service/kounen/hokenryo/ryogaku/20210101.html
 */
export const SOCIAL_INSURANCE_RATE = 0.15;
