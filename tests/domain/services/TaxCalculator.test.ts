import { describe, expect, it } from 'vitest';
import { TaxCalculator } from '../../../src/domain/services/TaxCalculator';

describe('TaxCalculator', () => {
  const calculator = new TaxCalculator();

  describe('calculateSalaryIncome', () => {
    it('年収162.5万円以下の場合、給与所得控除は55万円', () => {
      expect(calculator.calculateSalaryIncome(1_000_000)).toBe(450_000);
      expect(calculator.calculateSalaryIncome(1_625_000)).toBe(1_075_000);
    });

    it('年収300万円の場合、給与所得は202万円', () => {
      // 給与所得控除 = 3,000,000 × 0.3 - (-80,000) = 900,000 + 80,000 = 980,000
      // 給与所得 = 3,000,000 - 980,000 = 2,020,000
      expect(calculator.calculateSalaryIncome(3_000_000)).toBe(2_020_000);
    });

    it('年収500万円の場合、給与所得は356万円', () => {
      // 給与所得控除 = 5,000,000 × 0.2 + 440,000 = 1,000,000 + 440,000 = 1,440,000
      // 給与所得 = 5,000,000 - 1,440,000 = 3,560,000
      expect(calculator.calculateSalaryIncome(5_000_000)).toBe(3_560_000);
    });

    it('年収800万円の場合、給与所得は610万円', () => {
      // 給与所得控除 = 8,000,000 × 0.1 + 1,100,000 = 800,000 + 1,100,000 = 1,900,000
      // 給与所得 = 8,000,000 - 1,900,000 = 6,100,000
      expect(calculator.calculateSalaryIncome(8_000_000)).toBe(6_100_000);
    });

    it('年収1000万円の場合、給与所得は805万円（上限195万円）', () => {
      // 給与所得控除 = 1,950,000（上限）
      // 給与所得 = 10,000,000 - 1,950,000 = 8,050,000
      expect(calculator.calculateSalaryIncome(10_000_000)).toBe(8_050_000);
    });

    it('負の値を入力するとエラー', () => {
      expect(() => calculator.calculateSalaryIncome(-1000)).toThrow();
    });
  });

  describe('calculateTaxableIncome', () => {
    it('給与所得356万円、控除100万円の場合、課税所得は256万円', () => {
      expect(calculator.calculateTaxableIncome(3_560_000, 1_000_000)).toBe(2_560_000);
    });

    it('控除が給与所得を上回る場合、課税所得は0円', () => {
      expect(calculator.calculateTaxableIncome(1_000_000, 2_000_000)).toBe(0);
    });

    it('負の値を入力するとエラー', () => {
      expect(() => calculator.calculateTaxableIncome(-1000, 500_000)).toThrow();
      expect(() => calculator.calculateTaxableIncome(1_000_000, -500)).toThrow();
    });
  });

  describe('calculateIncomeTax', () => {
    it('課税所得0円の場合、所得税は0円', () => {
      expect(calculator.calculateIncomeTax(0)).toBe(0);
    });

    it('課税所得194.9万円以下の場合、税率5%', () => {
      // 課税所得100万円 × 5% = 50,000円
      expect(calculator.calculateIncomeTax(1_000_000)).toBe(50_000);
    });

    it('課税所得200万円の場合、税率10%、控除97,500円', () => {
      // 2,000,000 × 0.10 - 97,500 = 200,000 - 97,500 = 102,500
      expect(calculator.calculateIncomeTax(2_000_000)).toBe(102_500);
    });

    it('課税所得500万円の場合、税率20%、控除427,500円', () => {
      // 5,000,000 × 0.20 - 427,500 = 1,000,000 - 427,500 = 572,500
      expect(calculator.calculateIncomeTax(5_000_000)).toBe(572_500);
    });

    it('課税所得800万円の場合、税率23%、控除636,000円', () => {
      // 8,000,000 × 0.23 - 636,000 = 1,840,000 - 636,000 = 1,204,000
      expect(calculator.calculateIncomeTax(8_000_000)).toBe(1_204_000);
    });

    it('課税所得1500万円の場合、税率33%、控除1,536,000円', () => {
      // 15,000,000 × 0.33 - 1,536,000 = 4,950,000 - 1,536,000 = 3,414,000
      expect(calculator.calculateIncomeTax(15_000_000)).toBe(3_414_000);
    });

    it('負の値を入力するとエラー', () => {
      expect(() => calculator.calculateIncomeTax(-1000)).toThrow();
    });
  });

  describe('calculateResidentTax', () => {
    it('課税所得0円の場合、住民税は0円', () => {
      expect(calculator.calculateResidentTax(0)).toBe(0);
    });

    it('課税所得200万円の場合、住民税は20万円（一律10%）', () => {
      expect(calculator.calculateResidentTax(2_000_000)).toBe(200_000);
    });

    it('課税所得500万円の場合、住民税は50万円', () => {
      expect(calculator.calculateResidentTax(5_000_000)).toBe(500_000);
    });

    it('負の値を入力するとエラー', () => {
      expect(() => calculator.calculateResidentTax(-1000)).toThrow();
    });
  });

  describe('calculateSocialInsurance', () => {
    it('年収500万円の場合、社会保険料は約75万円（15%）', () => {
      expect(calculator.calculateSocialInsurance(5_000_000)).toBe(750_000);
    });

    it('年収800万円の場合、社会保険料は120万円', () => {
      expect(calculator.calculateSocialInsurance(8_000_000)).toBe(1_200_000);
    });

    it('負の値を入力するとエラー', () => {
      expect(() => calculator.calculateSocialInsurance(-1000)).toThrow();
    });
  });

  describe('getApplicableTaxRate', () => {
    it('課税所得0円の場合、税率0%', () => {
      expect(calculator.getApplicableTaxRate(0)).toBe(0);
    });

    it('課税所得194.9万円以下の場合、税率5%', () => {
      expect(calculator.getApplicableTaxRate(1_000_000)).toBe(0.05);
    });

    it('課税所得200万円の場合、税率10%', () => {
      expect(calculator.getApplicableTaxRate(2_000_000)).toBe(0.1);
    });

    it('課税所得500万円の場合、税率20%', () => {
      expect(calculator.getApplicableTaxRate(5_000_000)).toBe(0.2);
    });

    it('課税所得800万円の場合、税率23%', () => {
      expect(calculator.getApplicableTaxRate(8_000_000)).toBe(0.23);
    });
  });
});
