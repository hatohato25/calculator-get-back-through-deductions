import { type Component, Show } from 'solid-js';
import type { RefundResult } from '../../../domain/types';

type RefundSummaryProps = {
  /** 計算結果 */
  result: RefundResult | null;
  /** ローディング状態 */
  isLoading: boolean;
};

/**
 * 還付金サマリー表示コンポーネント
 *
 * 合計還付金額を大きく表示し、内訳を表示
 */
export const RefundSummary: Component<RefundSummaryProps> = (props) => {
  /**
   * 金額を3桁カンマ区切りでフォーマット
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ja-JP').format(Math.round(amount));
  };

  return (
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
      <Show
        when={!props.isLoading}
        fallback={
          <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400" />
          </div>
        }
      >
        <Show
          when={props.result}
          fallback={
            <div class="text-center py-12">
              <p class="text-gray-500 dark:text-gray-400">
                年収と控除項目を入力すると、還付金額が計算されます
              </p>
            </div>
          }
        >
          {(result) => (
            <div>
              {/* タイトル */}
              <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                💰 還付・軽減見込み額
              </h3>

              {/* 合計還付金額 */}
              <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">合計</p>
                <p class="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">
                  ¥{formatCurrency(result().totalRefund)}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">（年間）</p>
              </div>

              {/* 内訳 */}
              <div class="grid grid-cols-2 gap-4">
                {/* 所得税還付額 */}
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">所得税還付額</p>
                  <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                    ¥{formatCurrency(result().incomeTaxRefund)}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">今年度</p>
                </div>

                {/* 住民税軽減額 */}
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">住民税軽減額</p>
                  <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    ¥{formatCurrency(result().residentTaxReduction)}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">翌年度</p>
                </div>
              </div>

              {/* 注意書き */}
              <div class="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                <p>
                  ※
                  所得税還付は年末調整または確定申告後に還付されます。住民税軽減は翌年度の住民税が減額されます。
                </p>
              </div>
            </div>
          )}
        </Show>
      </Show>
    </div>
  );
};
