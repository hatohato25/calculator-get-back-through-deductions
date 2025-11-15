import { createSignal, onMount } from 'solid-js';
import {
  HOUSING_LOAN_LIMITS,
  INCOME_TAX_RATES,
  LIFE_INSURANCE_NEW_SYSTEM,
  LIFE_INSURANCE_OLD_SYSTEM,
  SALARY_DEDUCTION_TABLE,
} from '../../constants';
import type { TaxData } from '../../domain/types';
import { TaxDataRepository } from '../../infrastructure/indexeddb/TaxDataRepository';

/**
 * 税制データ取得フック
 *
 * - IndexedDBから税制データを取得
 * - データが存在しない、または1年以上古い場合は静的データで初期化
 * - 税制データの最新性を管理
 */
export function useTaxData() {
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const repository = new TaxDataRepository();

  /**
   * 静的データから税制データを構築
   */
  function createStaticTaxData(): TaxData {
    return {
      version: '2025',
      lastUpdated: new Date().toISOString(),
      salaryDeduction: SALARY_DEDUCTION_TABLE,
      incomeTaxRates: INCOME_TAX_RATES,
      lifeInsuranceDeduction: {
        new: LIFE_INSURANCE_NEW_SYSTEM,
        old: LIFE_INSURANCE_OLD_SYSTEM,
      },
      housingLoanLimits: HOUSING_LOAN_LIMITS,
    };
  }

  /**
   * 税制データを初期化
   */
  async function initializeTaxData() {
    try {
      setIsLoading(true);
      setError(null);

      // IndexedDBからデータ取得
      const existingData = await repository.get();
      const isStale = await repository.isStale();

      // データが存在しない、または古い場合は静的データで初期化
      if (!existingData || isStale) {
        const staticData = createStaticTaxData();
        await repository.save(staticData);
      }

      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '税制データの初期化に失敗しました';
      setError(errorMessage);
      setIsLoading(false);
    }
  }

  /**
   * 税制データを手動で更新
   */
  async function updateTaxData() {
    try {
      setIsLoading(true);
      setError(null);

      const staticData = createStaticTaxData();
      await repository.save(staticData);

      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '税制データの更新に失敗しました';
      setError(errorMessage);
      setIsLoading(false);
    }
  }

  /**
   * マウント時に初期化
   */
  onMount(() => {
    initializeTaxData();
  });

  return {
    isLoading,
    error,
    updateTaxData,
  };
}
