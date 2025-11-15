import {
  INCOME_TAX_RATES,
  RESIDENT_TAX_RATE,
  SALARY_DEDUCTION_TABLE,
  SOCIAL_INSURANCE_RATE,
} from '../../constants';

/**
 * 税額計算エンジン
 *
 * 純粋関数として実装し、副作用を持たない
 */
export class TaxCalculator {
  /**
   * 給与収入から給与所得を計算
   *
   * 給与所得 = 給与収入 - 給与所得控除額
   *
   * @param salaryRevenue 給与収入
   * @returns 給与所得
   *
   * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm
   */
  calculateSalaryIncome(salaryRevenue: number): number {
    if (salaryRevenue < 0) {
      throw new Error('給与収入は0以上である必要があります');
    }

    // 給与所得控除表から該当する行を検索
    const entry = SALARY_DEDUCTION_TABLE.find(
      (e) => salaryRevenue >= e.min && salaryRevenue <= e.max
    );

    if (!entry) {
      throw new Error('給与所得控除表に該当する範囲が見つかりません');
    }

    let deduction: number;

    if (entry.deduction !== undefined) {
      // 固定控除額
      deduction = entry.deduction;
    } else if (entry.rate !== undefined && entry.adjustment !== undefined) {
      // 計算式: 給与収入 × 料率 + 調整額
      deduction = Math.floor(salaryRevenue * entry.rate + entry.adjustment);
    } else {
      throw new Error('給与所得控除の計算方法が不正です');
    }

    return Math.max(0, salaryRevenue - deduction);
  }

  /**
   * 課税所得を計算
   *
   * 課税所得 = 給与所得 - 所得控除合計
   *
   * @param salaryIncome 給与所得
   * @param totalDeduction 所得控除合計
   * @returns 課税所得（マイナスの場合は0）
   */
  calculateTaxableIncome(salaryIncome: number, totalDeduction: number): number {
    if (salaryIncome < 0 || totalDeduction < 0) {
      throw new Error('給与所得と所得控除合計は0以上である必要があります');
    }

    return Math.max(0, salaryIncome - totalDeduction);
  }

  /**
   * 所得税額を計算（累進課税）
   *
   * 所得税額 = 課税所得 × 税率 - 控除額
   *
   * @param taxableIncome 課税所得
   * @returns 所得税額
   *
   * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
   */
  calculateIncomeTax(taxableIncome: number): number {
    if (taxableIncome < 0) {
      throw new Error('課税所得は0以上である必要があります');
    }

    if (taxableIncome === 0) {
      return 0;
    }

    // 所得税率表から該当する税率を検索
    const entry = INCOME_TAX_RATES.find((e) => taxableIncome >= e.min && taxableIncome <= e.max);

    if (!entry) {
      throw new Error('所得税率表に該当する範囲が見つかりません');
    }

    // 所得税額 = 課税所得 × 税率 - 控除額
    const tax = Math.floor(taxableIncome * entry.rate - entry.deduction);

    return Math.max(0, tax);
  }

  /**
   * 住民税額を計算
   *
   * 住民税額 = 課税所得 × 10%
   *
   * ※所得割のみを計算（均等割は省略）
   *
   * @param taxableIncome 課税所得
   * @returns 住民税額
   *
   * 参照: https://www.tax.metro.tokyo.lg.jp/kazei/kojin_ju.html
   */
  calculateResidentTax(taxableIncome: number): number {
    if (taxableIncome < 0) {
      throw new Error('課税所得は0以上である必要があります');
    }

    // 住民税は一律10%
    return Math.floor(taxableIncome * RESIDENT_TAX_RATE);
  }

  /**
   * 社会保険料を概算
   *
   * 給与収入 × 約15%
   *
   * ※実際の社会保険料は標準報酬月額に基づくが、ここでは簡易計算
   *
   * @param salaryRevenue 給与収入
   * @returns 社会保険料（概算）
   */
  calculateSocialInsurance(salaryRevenue: number): number {
    if (salaryRevenue < 0) {
      throw new Error('給与収入は0以上である必要があります');
    }

    return Math.floor(salaryRevenue * SOCIAL_INSURANCE_RATE);
  }

  /**
   * 適用税率を取得
   *
   * @param taxableIncome 課税所得
   * @returns 適用税率（例: 0.10 = 10%）
   */
  getApplicableTaxRate(taxableIncome: number): number {
    if (taxableIncome < 0) {
      throw new Error('課税所得は0以上である必要があります');
    }

    if (taxableIncome === 0) {
      return 0;
    }

    const entry = INCOME_TAX_RATES.find((e) => taxableIncome >= e.min && taxableIncome <= e.max);

    if (!entry) {
      throw new Error('所得税率表に該当する範囲が見つかりません');
    }

    return entry.rate;
  }
}
