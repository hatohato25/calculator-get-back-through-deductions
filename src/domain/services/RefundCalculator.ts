import { BASIC_DEDUCTION } from '../../constants';
import type {
  DeductionDetail,
  DeductionInput,
  DeductionSummary,
  RefundResult,
  TaxCalculationDetail,
} from '../types';
import { DeductionCalculator } from './DeductionCalculator';
import { TaxCalculator } from './TaxCalculator';

/**
 * 還付金計算統合ロジック
 *
 * 控除適用前後の税額を計算し、その差額（還付金）を算出する
 */
export class RefundCalculator {
  private taxCalculator: TaxCalculator;
  private deductionCalculator: DeductionCalculator;

  constructor() {
    this.taxCalculator = new TaxCalculator();
    this.deductionCalculator = new DeductionCalculator();
  }

  /**
   * 還付金を計算
   *
   * @param input ユーザー入力データ
   * @returns 還付金計算結果
   */
  calculate(input: DeductionInput): RefundResult {
    // 給与所得を計算
    const salaryIncome = this.taxCalculator.calculateSalaryIncome(input.salary);

    // 給与所得控除額を計算（給与収入 - 給与所得）
    const salaryDeduction = input.salary - salaryIncome;

    // 社会保険料を概算
    const socialInsurance = this.taxCalculator.calculateSocialInsurance(input.salary);

    // 1. 控除なし（基礎控除と社会保険料控除のみ）の税額を計算
    const beforeDeduction = this.calculateWithMinimalDeductions(salaryIncome, socialInsurance);

    // 2. 全ての控除を計算
    const deductions = this.calculateAllDeductions(
      input,
      salaryIncome,
      salaryDeduction,
      socialInsurance
    );

    // 3. 控除ありの税額を計算
    const afterDeduction = this.calculateWithDeductions(salaryIncome, deductions);

    // 4. 住宅ローン控除（税額控除）を計算
    const housingLoanTaxCredit = input.housingLoan
      ? this.deductionCalculator.calculateHousingLoanTaxCredit(
          input.housingLoan.yearEndBalance,
          input.housingLoan.residenceYear,
          input.housingLoan.housingType
        )
      : 0;

    // 5. 税額控除を適用した最終税額を計算
    // 所得税: 税額控除を適用（0円未満にはならない）
    const finalIncomeTax = Math.max(0, afterDeduction.incomeTax - housingLoanTaxCredit);

    // 住民税: 所得税で控除しきれなかった分を住民税から控除（上限あり）
    // 住民税からの控除上限 = 課税所得 × 7% （最大13.65万円）
    const residentTaxCreditLimit = Math.min(afterDeduction.taxableIncome * 0.07, 136500);
    const remainingCredit = Math.max(0, housingLoanTaxCredit - afterDeduction.incomeTax);
    const residentTaxCredit = Math.min(remainingCredit, residentTaxCreditLimit);
    const finalResidentTax = Math.max(0, afterDeduction.residentTax - residentTaxCredit);

    // 6. 還付額を計算（税額控除適用後の差額）
    const incomeTaxRefund = Math.max(0, beforeDeduction.incomeTax - finalIncomeTax);
    const residentTaxReduction = Math.max(0, beforeDeduction.residentTax - finalResidentTax);

    // 7. 適用税率を取得
    const applicableTaxRate = this.taxCalculator.getApplicableTaxRate(afterDeduction.taxableIncome);

    return {
      totalRefund: incomeTaxRefund + residentTaxReduction,
      incomeTaxRefund,
      residentTaxReduction,
      breakdown: {
        beforeDeduction,
        afterDeduction,
        deductions: this.convertToDeductionDetail(deductions, input),
        applicableTaxRate,
      },
    };
  }

  /**
   * 最小限の控除（基礎控除+社会保険料控除）のみで税額を計算
   */
  private calculateWithMinimalDeductions(
    salaryIncome: number,
    socialInsurance: number
  ): TaxCalculationDetail {
    const totalDeduction = BASIC_DEDUCTION + socialInsurance;

    const taxableIncome = this.taxCalculator.calculateTaxableIncome(salaryIncome, totalDeduction);

    const incomeTax = this.taxCalculator.calculateIncomeTax(taxableIncome);
    const residentTax = this.taxCalculator.calculateResidentTax(taxableIncome);

    return {
      salaryIncome,
      totalDeduction,
      taxableIncome,
      incomeTax,
      residentTax,
    };
  }

  /**
   * 全ての控除額を計算
   */
  private calculateAllDeductions(
    input: DeductionInput,
    salaryIncome: number,
    salaryDeduction: number,
    socialInsurance: number
  ): DeductionSummary {
    // iDeCo控除
    const ideco = input.ideco
      ? this.deductionCalculator.calculateIdecoDeduction(input.ideco.annualPayment)
      : 0;

    // 生命保険料控除
    const lifeInsurance = input.lifeInsurance
      ? this.deductionCalculator.calculateLifeInsuranceDeduction(
          {
            generalLifeInsurance: input.lifeInsurance.generalLifeInsurance,
            personalPensionInsurance: input.lifeInsurance.personalPensionInsurance,
            medicalCareInsurance: input.lifeInsurance.medicalCareInsurance,
          },
          input.lifeInsurance.isNewSystem
        )
      : 0;

    // 地震保険料控除
    const earthquakeInsurance = input.earthquakeInsurance
      ? this.deductionCalculator.calculateEarthquakeInsuranceDeduction(
          input.earthquakeInsurance.annualPayment
        )
      : 0;

    // 医療費控除
    const medicalExpense = input.medicalExpense
      ? this.deductionCalculator.calculateMedicalExpenseDeduction(
          input.medicalExpense.totalExpense,
          salaryIncome
        )
      : 0;

    // 寄附金控除
    const donation = input.donation
      ? this.deductionCalculator.calculateDonationDeduction(
          (input.donation.furusato ?? 0) + (input.donation.other ?? 0),
          salaryIncome
        )
      : 0;

    // 特定支出控除
    const specialExpense = input.specialExpense
      ? this.deductionCalculator.calculateSpecialExpenseDeduction(
          input.specialExpense.commuteExpense,
          salaryDeduction
        )
      : 0;

    return {
      ideco,
      lifeInsurance,
      earthquakeInsurance,
      medicalExpense,
      donation,
      specialExpense,
      basicDeduction: BASIC_DEDUCTION,
      socialInsurance,
    };
  }

  /**
   * 控除ありで税額を計算
   */
  private calculateWithDeductions(
    salaryIncome: number,
    deductions: DeductionSummary
  ): TaxCalculationDetail {
    // 所得控除の合計
    const totalDeduction =
      deductions.ideco +
      deductions.lifeInsurance +
      deductions.earthquakeInsurance +
      deductions.medicalExpense +
      deductions.donation +
      deductions.specialExpense +
      deductions.basicDeduction +
      deductions.socialInsurance;

    const taxableIncome = this.taxCalculator.calculateTaxableIncome(salaryIncome, totalDeduction);

    const incomeTax = this.taxCalculator.calculateIncomeTax(taxableIncome);
    const residentTax = this.taxCalculator.calculateResidentTax(taxableIncome);

    return {
      salaryIncome,
      totalDeduction,
      taxableIncome,
      incomeTax,
      residentTax,
    };
  }

  /**
   * DeductionSummaryをDeductionDetailに変換
   *
   * 住宅ローン控除（税額控除）を追加
   */
  private convertToDeductionDetail(
    deductions: DeductionSummary,
    input: DeductionInput
  ): DeductionDetail {
    // 住宅ローン控除（税額控除）
    const housingLoanTaxCredit = input.housingLoan
      ? this.deductionCalculator.calculateHousingLoanTaxCredit(
          input.housingLoan.yearEndBalance,
          input.housingLoan.residenceYear,
          input.housingLoan.housingType
        )
      : 0;

    return {
      ...deductions,
      housingLoanTaxCredit,
    };
  }
}
