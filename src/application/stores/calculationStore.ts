import { createStore } from 'solid-js/store';
import type { RefundResult } from '../../domain/types';

/**
 * 計算結果状態管理ストア
 *
 * 還付金計算結果とローディング・エラー状態を管理
 */

type CalculationState = {
  /** 計算結果（未計算の場合はnull） */
  result: RefundResult | null;
  /** 計算中フラグ */
  isLoading: boolean;
  /** エラーメッセージ（エラーがない場合はnull） */
  error: string | null;
};

/** 初期状態 */
const initialState: CalculationState = {
  result: null,
  isLoading: false,
  error: null,
};

/** グローバル計算結果ストア */
export const [calculationStore, setCalculationStore] = createStore<CalculationState>(initialState);

/**
 * 計算開始（ローディング状態に設定）
 */
export function startCalculation() {
  setCalculationStore({
    isLoading: true,
    error: null,
  });
}

/**
 * 計算成功（結果を設定）
 */
export function setCalculationResult(result: RefundResult) {
  setCalculationStore({
    result,
    isLoading: false,
    error: null,
  });
}

/**
 * 計算エラー（エラーメッセージを設定）
 */
export function setCalculationError(error: string) {
  setCalculationStore({
    result: null,
    isLoading: false,
    error,
  });
}

/**
 * 計算結果をクリア
 */
export function clearCalculationResult() {
  setCalculationStore(initialState);
}
