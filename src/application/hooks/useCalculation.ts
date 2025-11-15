import { createMemo } from 'solid-js';
import { RefundCalculator } from '../../domain/services/RefundCalculator';
import {
  calculationStore,
  setCalculationError,
  setCalculationResult,
  startCalculation,
} from '../stores/calculationStore';
import { inputStore } from '../stores/inputStore';
import { validateDeductionInput } from '../validators/inputValidator';

/**
 * 計算ロジック統合フック
 *
 * 入力値のバリデーションと還付金計算を実行し、結果を状態管理する
 */
export function useCalculation() {
  const calculator = new RefundCalculator();

  /**
   * 計算実行（リアクティブに自動実行）
   * inputStoreが更新されるたびに自動的に再計算
   */
  const calculate = createMemo(() => {
    startCalculation();

    try {
      // バリデーション
      const validationResult = validateDeductionInput(inputStore);

      if (!validationResult.success) {
        // バリデーションエラー
        const errorMessages = validationResult.error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        setCalculationError(`入力値エラー: ${errorMessages}`);
        return null;
      }

      // 計算実行
      const result = calculator.calculate(validationResult.data);
      setCalculationResult(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '計算中にエラーが発生しました';
      setCalculationError(errorMessage);
      return null;
    }
  });

  return {
    /** 計算結果 */
    result: () => calculationStore.result,
    /** ローディング状態 */
    isLoading: () => calculationStore.isLoading,
    /** エラーメッセージ */
    error: () => calculationStore.error,
    /** 計算を再実行（リアクティブなのでinputStoreの更新で自動実行される） */
    calculate,
  };
}
