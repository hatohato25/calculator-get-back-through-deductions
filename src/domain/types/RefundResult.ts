/**
 * 還付金計算結果
 */
export type RefundResult = {
  /** 合計還付金額（所得税還付 + 住民税軽減） */
  totalRefund: number;

  /** 所得税還付額 */
  incomeTaxRefund: number;

  /** 住民税軽減額（翌年度） */
  residentTaxReduction: number;

  /** 詳細情報 */
  breakdown: RefundBreakdown;
};

/**
 * 還付金計算の詳細内訳
 */
export type RefundBreakdown = {
  /** 控除適用前 */
  beforeDeduction: TaxCalculationDetail;

  /** 控除適用後 */
  afterDeduction: TaxCalculationDetail;

  /** 各控除の詳細 */
  deductions: DeductionDetail;

  /** 適用税率（所得税） */
  applicableTaxRate: number;
};

/**
 * 税額計算の詳細
 */
export type TaxCalculationDetail = {
  /** 給与所得 */
  salaryIncome: number;

  /** 所得控除合計額 */
  totalDeduction: number;

  /** 課税所得 */
  taxableIncome: number;

  /** 所得税額 */
  incomeTax: number;

  /** 住民税額（所得割のみ） */
  residentTax: number;
};

/**
 * 各控除の詳細
 */
export type DeductionDetail = {
  /** 小規模企業共済等掛金控除（iDeCo） */
  ideco: number;

  /** 生命保険料控除 */
  lifeInsurance: number;

  /** 地震保険料控除 */
  earthquakeInsurance: number;

  /** 医療費控除 */
  medicalExpense: number;

  /** 寄附金控除 */
  donation: number;

  /** 特定支出控除 */
  specialExpense: number;

  /** 基礎控除 */
  basicDeduction: number;

  /** 社会保険料控除 */
  socialInsurance: number;

  /** 住宅ローン控除（税額控除） */
  housingLoanTaxCredit: number;
};
