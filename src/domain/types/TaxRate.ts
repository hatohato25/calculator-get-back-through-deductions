/**
 * 所得税率テーブルの1エントリ
 *
 * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
 */
export type TaxRateEntry = {
  /** 課税所得の最小値 */
  min: number;
  /** 課税所得の最大値 */
  max: number;
  /** 税率（例: 0.05 = 5%） */
  rate: number;
  /** 控除額 */
  deduction: number;
};

/**
 * 給与所得控除テーブルの1エントリ
 *
 * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm
 */
export type SalaryDeductionEntry = {
  /** 給与収入の最小値 */
  min: number;
  /** 給与収入の最大値 */
  max: number;
  /** 固定控除額（計算式がない場合） */
  deduction?: number;
  /** 計算式の料率（給与収入にかける値） */
  rate?: number;
  /** 計算式の調整額（料率計算後に引く値） */
  adjustment?: number;
};

/**
 * 生命保険料控除の計算テーブルの1エントリ
 */
export type LifeInsuranceDeductionEntry = {
  /** 支払額の上限 */
  paymentMax: number;
};

/**
 * 住宅ローン控除の限度額情報
 *
 * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1213.htm
 */
export type HousingLoanLimit = {
  /** 借入限度額 */
  limit: number;
  /** 控除期間（年数） */
  years: number;
};
