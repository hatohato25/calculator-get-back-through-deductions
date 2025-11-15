import {
  DONATION_INCOME_LIMIT_RATE,
  DONATION_SELF_BURDEN,
  EARTHQUAKE_INSURANCE_MAX,
  HOUSING_LOAN_LIMITS,
  HOUSING_LOAN_RATE,
  LIFE_INSURANCE_MAX_NEW,
  LIFE_INSURANCE_MAX_OLD,
  LIFE_INSURANCE_NEW_SYSTEM,
  LIFE_INSURANCE_OLD_SYSTEM,
  MEDICAL_EXPENSE_INCOME_RATE,
  MEDICAL_EXPENSE_MAX,
  MEDICAL_EXPENSE_THRESHOLD,
} from '../../constants';
import type { HousingType, LifeInsurancePayments } from '../types';

/**
 * 各種控除額を計算
 *
 * 純粋関数として実装し、副作用を持たない
 */
export class DeductionCalculator {
  /**
   * 小規模企業共済等掛金控除（iDeCo）を計算
   *
   * 掛金全額が所得控除の対象
   *
   * @param annualPayment 年間掛金
   * @returns 控除額
   *
   * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1130.htm
   */
  calculateIdecoDeduction(annualPayment: number): number {
    if (annualPayment < 0) {
      throw new Error('年間掛金は0以上である必要があります');
    }

    // 全額控除
    return annualPayment;
  }

  /**
   * 生命保険料控除を計算
   *
   * 新制度・旧制度で計算式が異なる
   *
   * @param payments 各保険料の支払額
   * @param isNewSystem true: 新制度, false: 旧制度
   * @returns 控除額
   *
   * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1140.htm
   */
  calculateLifeInsuranceDeduction(payments: LifeInsurancePayments, isNewSystem: boolean): number {
    const table = isNewSystem ? LIFE_INSURANCE_NEW_SYSTEM : LIFE_INSURANCE_OLD_SYSTEM;
    const maxDeduction = isNewSystem ? LIFE_INSURANCE_MAX_NEW : LIFE_INSURANCE_MAX_OLD;

    let totalDeduction = 0;

    // 一般生命保険料
    if (payments.generalLifeInsurance && payments.generalLifeInsurance > 0) {
      totalDeduction += this.calculateSingleLifeInsurance(payments.generalLifeInsurance, table);
    }

    // 個人年金保険料
    if (payments.personalPensionInsurance && payments.personalPensionInsurance > 0) {
      totalDeduction += this.calculateSingleLifeInsurance(payments.personalPensionInsurance, table);
    }

    // 介護医療保険料（新制度のみ）
    if (isNewSystem && payments.medicalCareInsurance && payments.medicalCareInsurance > 0) {
      totalDeduction += this.calculateSingleLifeInsurance(payments.medicalCareInsurance, table);
    }

    // 合計控除額が上限を超えないようにする
    return Math.min(totalDeduction, maxDeduction);
  }

  /**
   * 単一の生命保険料の控除額を計算
   *
   * @param payment 支払額
   * @param table 計算テーブル
   * @returns 控除額
   */
  private calculateSingleLifeInsurance(
    payment: number,
    table: typeof LIFE_INSURANCE_NEW_SYSTEM
  ): number {
    if (payment < 0) {
      throw new Error('支払額は0以上である必要があります');
    }

    if (payment === 0) {
      return 0;
    }

    // 新制度か旧制度かを判定
    const isNewSystem = table === LIFE_INSURANCE_NEW_SYSTEM;

    // 該当する閾値を検索して計算
    for (let i = 0; i < table.length; i++) {
      const entry = table[i];
      if (payment <= entry.paymentMax) {
        return Math.floor(this.calculateLifeInsuranceByThreshold(payment, i, isNewSystem));
      }
    }

    // ここに到達することはないはずだが、念のため最後の閾値を使用
    return Math.floor(
      this.calculateLifeInsuranceByThreshold(payment, table.length - 1, isNewSystem)
    );
  }

  /**
   * 生命保険料控除を閾値インデックスに基づいて計算
   *
   * @param payment 支払額
   * @param thresholdIndex 閾値のインデックス (0-3)
   * @param isNewSystem true: 新制度, false: 旧制度
   * @returns 控除額
   */
  private calculateLifeInsuranceByThreshold(
    payment: number,
    thresholdIndex: number,
    isNewSystem: boolean
  ): number {
    if (isNewSystem) {
      // 新制度の計算ロジック
      switch (thresholdIndex) {
        case 0: // payment <= 20,000
          return payment;
        case 1: // payment <= 40,000
          return payment * 0.5 + 10_000;
        case 2: // payment <= 80,000
          return payment * 0.25 + 20_000;
        case 3: // payment > 80,000
          return 40_000;
        default:
          return 40_000;
      }
    }

    // 旧制度の計算ロジック
    switch (thresholdIndex) {
      case 0: // payment <= 25,000
        return payment;
      case 1: // payment <= 50,000
        return payment * 0.5 + 12_500;
      case 2: // payment <= 100,000
        return payment * 0.25 + 25_000;
      case 3: // payment > 100,000
        return 50_000;
      default:
        return 50_000;
    }
  }

  /**
   * 地震保険料控除を計算
   *
   * 支払額全額（最大5万円）
   *
   * @param annualPayment 年間支払額
   * @returns 控除額
   *
   * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1145.htm
   */
  calculateEarthquakeInsuranceDeduction(annualPayment: number): number {
    if (annualPayment < 0) {
      throw new Error('年間支払額は0以上である必要があります');
    }

    return Math.min(annualPayment, EARTHQUAKE_INSURANCE_MAX);
  }

  /**
   * 医療費控除を計算
   *
   * (医療費 - 10万円) または (医療費 - 所得 × 5%) のいずれか少ない方
   *
   * @param medicalExpense 年間医療費
   * @param income 給与所得
   * @returns 控除額
   *
   * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1120.htm
   */
  calculateMedicalExpenseDeduction(medicalExpense: number, income: number): number {
    if (medicalExpense < 0 || income < 0) {
      throw new Error('医療費と所得は0以上である必要があります');
    }

    if (medicalExpense === 0) {
      return 0;
    }

    // 10万円 または 所得の5% のいずれか少ない方を足切り額とする
    const threshold = Math.min(
      MEDICAL_EXPENSE_THRESHOLD,
      Math.floor(income * MEDICAL_EXPENSE_INCOME_RATE)
    );

    const deduction = medicalExpense - threshold;

    // 0円未満の場合は0円、上限200万円を超える場合は200万円
    return Math.max(0, Math.min(deduction, MEDICAL_EXPENSE_MAX));
  }

  /**
   * 寄附金控除を計算
   *
   * (寄附額 - 2,000円)、ただし所得の40%が上限
   *
   * @param donation 寄附額
   * @param income 給与所得
   * @returns 控除額
   *
   * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1150.htm
   */
  calculateDonationDeduction(donation: number, income: number): number {
    if (donation < 0 || income < 0) {
      throw new Error('寄附額と所得は0以上である必要があります');
    }

    if (donation <= DONATION_SELF_BURDEN) {
      return 0;
    }

    const deduction = donation - DONATION_SELF_BURDEN;

    // 所得の40%が上限
    const limit = Math.floor(income * DONATION_INCOME_LIMIT_RATE);

    return Math.min(deduction, limit);
  }

  /**
   * 特定支出控除を計算
   *
   * 給与所得控除額の1/2を超えた部分が控除対象
   *
   * @param expense 特定支出額
   * @param salaryDeduction 給与所得控除額
   * @returns 控除額
   *
   * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1415.htm
   */
  calculateSpecialExpenseDeduction(expense: number, salaryDeduction: number): number {
    if (expense < 0 || salaryDeduction < 0) {
      throw new Error('特定支出額と給与所得控除額は0以上である必要があります');
    }

    const threshold = Math.floor(salaryDeduction / 2);

    if (expense <= threshold) {
      return 0;
    }

    return expense - threshold;
  }

  /**
   * 住宅ローン控除を計算（税額控除）
   *
   * - 2021年以前: 年末借入残高 × 1%（認定住宅は上限5,000万円、一般住宅は上限4,000万円）
   * - 2022年以降: 年末借入残高 × 0.7%（住宅種別により借入限度額が異なる）
   *
   * @param loanBalance 年末借入残高
   * @param residenceYear 居住開始年
   * @param housingType 住宅の種類
   * @returns 控除額（税額控除）
   *
   * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1213.htm
   */
  calculateHousingLoanTaxCredit(
    loanBalance: number,
    residenceYear: number,
    housingType: HousingType
  ): number {
    if (loanBalance < 0) {
      throw new Error('借入残高は0以上である必要があります');
    }

    if (loanBalance === 0) {
      return 0;
    }

    // 2021年以前: 旧制度（1%控除）
    if (residenceYear <= 2021) {
      const rate = 0.01;

      // 住宅種別を2021年以前の区分にマッピング
      // new-certified: 認定住宅（上限5,000万円、最大50万円控除）
      // その他: 一般住宅（上限4,000万円、最大40万円控除）
      const isCertified = housingType === 'new-certified';
      const maxLoanBalance = isCertified ? 50_000_000 : 40_000_000;
      const maxDeduction = isCertified ? 500_000 : 400_000;

      const applicableLoanBalance = Math.min(loanBalance, maxLoanBalance);
      const deduction = Math.min(applicableLoanBalance * rate, maxDeduction);

      return Math.floor(deduction);
    }

    // 2022年以降: 現行制度（0.7%控除、住宅種別による上限）
    const limitsForYear = HOUSING_LOAN_LIMITS[residenceYear];
    if (!limitsForYear) {
      throw new Error(`居住開始年 ${residenceYear} の住宅ローン控除限度額が見つかりません`);
    }

    const limit = limitsForYear[housingType];
    if (!limit) {
      throw new Error(`住宅種類 ${housingType} の住宅ローン控除限度額が見つかりません`);
    }

    // 控除対象外の場合（limitが0）
    if (limit.limit === 0) {
      return 0;
    }

    // 借入限度額を超えている場合は限度額を使用
    const effectiveLoanBalance = Math.min(loanBalance, limit.limit);

    // 借入残高 × 0.7%
    return Math.floor(effectiveLoanBalance * HOUSING_LOAN_RATE);
  }
}
