import { describe, expect, it } from 'vitest';
import { DeductionCalculator } from '../../../src/domain/services/DeductionCalculator';

describe('DeductionCalculator', () => {
  const calculator = new DeductionCalculator();

  describe('calculateIdecoDeduction', () => {
    it('年間掛金27.6万円の場合、全額控除', () => {
      expect(calculator.calculateIdecoDeduction(276_000)).toBe(276_000);
    });

    it('年間掛金81.6万円の場合、全額控除', () => {
      expect(calculator.calculateIdecoDeduction(816_000)).toBe(816_000);
    });

    it('掛金0円の場合、控除額0円', () => {
      expect(calculator.calculateIdecoDeduction(0)).toBe(0);
    });

    it('負の値を入力するとエラー', () => {
      expect(() => calculator.calculateIdecoDeduction(-1000)).toThrow();
    });
  });

  describe('calculateLifeInsuranceDeduction - 新制度', () => {
    it('一般生命保険料2万円以下の場合、支払額全額', () => {
      expect(
        calculator.calculateLifeInsuranceDeduction({ generalLifeInsurance: 20_000 }, true)
      ).toBe(20_000);
    });

    it('一般生命保険料4万円の場合、控除額3万円', () => {
      // 40,000 × 0.5 + 10,000 = 30,000
      expect(
        calculator.calculateLifeInsuranceDeduction({ generalLifeInsurance: 40_000 }, true)
      ).toBe(30_000);
    });

    it('一般生命保険料8万円の場合、控除額4万円（上限）', () => {
      // 80,000 × 0.25 + 20,000 = 40,000
      expect(
        calculator.calculateLifeInsuranceDeduction({ generalLifeInsurance: 80_000 }, true)
      ).toBe(40_000);
    });

    it('一般生命保険料10万円の場合、控除額4万円（上限）', () => {
      expect(
        calculator.calculateLifeInsuranceDeduction({ generalLifeInsurance: 100_000 }, true)
      ).toBe(40_000);
    });

    it('3種類の保険料を合計した場合、最大12万円', () => {
      expect(
        calculator.calculateLifeInsuranceDeduction(
          {
            generalLifeInsurance: 100_000, // 4万円
            personalPensionInsurance: 100_000, // 4万円
            medicalCareInsurance: 100_000, // 4万円
          },
          true
        )
      ).toBe(120_000); // 合計12万円
    });
  });

  describe('calculateLifeInsuranceDeduction - 旧制度', () => {
    it('一般生命保険料2.5万円以下の場合、支払額全額', () => {
      expect(
        calculator.calculateLifeInsuranceDeduction({ generalLifeInsurance: 25_000 }, false)
      ).toBe(25_000);
    });

    it('一般生命保険料5万円の場合、控除額3.75万円', () => {
      // 50,000 × 0.5 + 12,500 = 37,500
      expect(
        calculator.calculateLifeInsuranceDeduction({ generalLifeInsurance: 50_000 }, false)
      ).toBe(37_500);
    });

    it('一般生命保険料10万円の場合、控除額5万円（上限）', () => {
      // 100,000 × 0.25 + 25,000 = 50,000
      expect(
        calculator.calculateLifeInsuranceDeduction({ generalLifeInsurance: 100_000 }, false)
      ).toBe(50_000);
    });

    it('2種類の保険料を合計した場合、最大10万円', () => {
      expect(
        calculator.calculateLifeInsuranceDeduction(
          {
            generalLifeInsurance: 100_000, // 5万円
            personalPensionInsurance: 100_000, // 5万円
          },
          false
        )
      ).toBe(100_000); // 合計10万円
    });

    it('新制度で介護医療保険料を指定した場合、無視される', () => {
      expect(
        calculator.calculateLifeInsuranceDeduction(
          {
            generalLifeInsurance: 100_000, // 5万円
            medicalCareInsurance: 100_000, // 旧制度では無視
          },
          false
        )
      ).toBe(50_000);
    });
  });

  describe('calculateEarthquakeInsuranceDeduction', () => {
    it('支払額3万円の場合、全額控除', () => {
      expect(calculator.calculateEarthquakeInsuranceDeduction(30_000)).toBe(30_000);
    });

    it('支払額5万円の場合、上限5万円', () => {
      expect(calculator.calculateEarthquakeInsuranceDeduction(50_000)).toBe(50_000);
    });

    it('支払額10万円の場合、上限5万円', () => {
      expect(calculator.calculateEarthquakeInsuranceDeduction(100_000)).toBe(50_000);
    });

    it('負の値を入力するとエラー', () => {
      expect(() => calculator.calculateEarthquakeInsuranceDeduction(-1000)).toThrow();
    });
  });

  describe('calculateMedicalExpenseDeduction', () => {
    it('医療費15万円、所得300万円の場合、控除額5万円', () => {
      // 150,000 - 100,000 = 50,000
      expect(calculator.calculateMedicalExpenseDeduction(150_000, 3_000_000)).toBe(50_000);
    });

    it('医療費30万円、所得500万円の場合、控除額20万円', () => {
      // 300,000 - 100,000 = 200,000
      expect(calculator.calculateMedicalExpenseDeduction(300_000, 5_000_000)).toBe(200_000);
    });

    it('医療費10万円以下の場合、控除額0円', () => {
      expect(calculator.calculateMedicalExpenseDeduction(80_000, 3_000_000)).toBe(0);
    });

    it('所得が200万円未満の場合、所得の5%を足切り額とする', () => {
      // 所得150万円の5% = 75,000円
      // 100,000 - 75,000 = 25,000
      expect(calculator.calculateMedicalExpenseDeduction(100_000, 1_500_000)).toBe(25_000);
    });

    it('医療費が200万円を超える場合、上限200万円', () => {
      expect(calculator.calculateMedicalExpenseDeduction(3_000_000, 5_000_000)).toBe(2_000_000);
    });
  });

  describe('calculateDonationDeduction', () => {
    it('寄附額5万円、所得300万円の場合、控除額4.8万円', () => {
      // 50,000 - 2,000 = 48,000
      expect(calculator.calculateDonationDeduction(50_000, 3_000_000)).toBe(48_000);
    });

    it('寄附額2,000円以下の場合、控除額0円', () => {
      expect(calculator.calculateDonationDeduction(2_000, 3_000_000)).toBe(0);
      expect(calculator.calculateDonationDeduction(1_000, 3_000_000)).toBe(0);
    });

    it('寄附額が所得の40%を超える場合、40%が上限', () => {
      // 所得300万円の40% = 1,200,000円
      expect(calculator.calculateDonationDeduction(2_000_000, 3_000_000)).toBe(1_200_000);
    });

    it('負の値を入力するとエラー', () => {
      expect(() => calculator.calculateDonationDeduction(-1000, 3_000_000)).toThrow();
    });
  });

  describe('calculateSpecialExpenseDeduction', () => {
    it('特定支出が給与所得控除の1/2以下の場合、控除額0円', () => {
      // 給与所得控除100万円の1/2 = 50万円
      expect(calculator.calculateSpecialExpenseDeduction(300_000, 1_000_000)).toBe(0);
      expect(calculator.calculateSpecialExpenseDeduction(500_000, 1_000_000)).toBe(0);
    });

    it('特定支出が給与所得控除の1/2を超える場合、超過分が控除', () => {
      // 給与所得控除100万円の1/2 = 50万円
      // 70万円 - 50万円 = 20万円
      expect(calculator.calculateSpecialExpenseDeduction(700_000, 1_000_000)).toBe(200_000);
    });

    it('負の値を入力するとエラー', () => {
      expect(() => calculator.calculateSpecialExpenseDeduction(-1000, 1_000_000)).toThrow();
    });
  });

  describe('calculateHousingLoanTaxCredit - 2022年以降（現行制度）', () => {
    it('2024年、新築認定住宅、借入残高3000万円の場合、控除額21万円', () => {
      // 30,000,000 × 0.7% = 210,000
      expect(calculator.calculateHousingLoanTaxCredit(30_000_000, 2024, 'new-certified')).toBe(
        210_000
      );
    });

    it('2024年、新築ZEH、借入残高5000万円の場合、控除額24.5万円（限度額3500万円）', () => {
      // 35,000,000（限度額） × 0.7% = 245,000
      expect(calculator.calculateHousingLoanTaxCredit(50_000_000, 2024, 'new-zeh')).toBe(245_000);
    });

    it('2024年、新築その他、借入残高3000万円の場合、控除額0円（対象外）', () => {
      expect(calculator.calculateHousingLoanTaxCredit(30_000_000, 2024, 'new-other')).toBe(0);
    });

    it('2024年、中古、借入残高2000万円の場合、控除額14万円', () => {
      // 20,000,000 × 0.7% = 140,000
      expect(calculator.calculateHousingLoanTaxCredit(20_000_000, 2024, 'used')).toBe(140_000);
    });

    it('借入残高0円の場合、控除額0円', () => {
      expect(calculator.calculateHousingLoanTaxCredit(0, 2024, 'new-certified')).toBe(0);
    });
  });

  describe('calculateHousingLoanTaxCredit - 2021年以前（旧制度）', () => {
    it('2021年入居、一般住宅（new-other）、年末残高4,000万円 → 40万円控除', () => {
      // 40,000,000 × 1% = 400,000
      expect(calculator.calculateHousingLoanTaxCredit(40_000_000, 2021, 'new-other')).toBe(400_000);
    });

    it('2021年入居、認定住宅（new-certified）、年末残高5,000万円 → 50万円控除', () => {
      // 50,000,000 × 1% = 500,000
      expect(calculator.calculateHousingLoanTaxCredit(50_000_000, 2021, 'new-certified')).toBe(
        500_000
      );
    });

    it('2021年入居、一般住宅、年末残高が上限超過（6,000万円） → 40万円控除', () => {
      // 上限4,000万円 × 1% = 400,000
      expect(calculator.calculateHousingLoanTaxCredit(60_000_000, 2021, 'new-other')).toBe(400_000);
    });

    it('2015年入居、一般住宅（used）、年末残高3,000万円 → 30万円控除', () => {
      // 30,000,000 × 1% = 300,000
      expect(calculator.calculateHousingLoanTaxCredit(30_000_000, 2015, 'used')).toBe(300_000);
    });

    it('2021年入居、ZEH住宅（new-zeh）は一般住宅扱い → 上限40万円', () => {
      // 一般住宅扱いで上限4,000万円 × 1% = 400,000
      expect(calculator.calculateHousingLoanTaxCredit(50_000_000, 2021, 'new-zeh')).toBe(400_000);
    });
  });

  describe('calculateHousingLoanTaxCredit - エラーケース', () => {
    it('存在しない居住開始年（2026年）を指定するとエラー', () => {
      expect(() =>
        calculator.calculateHousingLoanTaxCredit(30_000_000, 2026, 'new-certified')
      ).toThrow();
    });
  });
});
