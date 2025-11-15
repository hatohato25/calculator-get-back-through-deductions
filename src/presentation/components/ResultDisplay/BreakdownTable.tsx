import { type Component, Show, createSignal } from 'solid-js';
import type { RefundResult } from '../../../domain/types';

type BreakdownTableProps = {
  /** 計算結果 */
  result: RefundResult | null;
};

/**
 * 計算内訳テーブル表示コンポーネント
 *
 * 控除前後の比較と各控除の効果を表示
 */
export const BreakdownTable: Component<BreakdownTableProps> = (props) => {
  const [isExpanded, setIsExpanded] = createSignal(false);

  /**
   * 金額を3桁カンマ区切りでフォーマット
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ja-JP').format(Math.round(amount));
  };

  /**
   * パーセント表示
   */
  const formatPercent = (rate: number): string => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  return (
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {/* ヘッダー */}
      <button
        type="button"
        class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded())}
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">📊 計算の詳細</h3>
        <svg
          class={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isExpanded() ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <title>展開アイコン</title>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* 詳細内容 */}
      <Show when={isExpanded() && props.result}>
        {(result) => (
          <div class="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
            {/* 控除前後の比較テーブル */}
            <div class="overflow-x-auto mt-4">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b-2 border-gray-300 dark:border-gray-600">
                    <th class="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">
                      項目
                    </th>
                    <th class="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">
                      控除前
                    </th>
                    <th class="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">
                      控除後
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td class="py-2 px-2 text-gray-700 dark:text-gray-300">給与所得</td>
                    <td class="text-right py-2 px-2 text-gray-900 dark:text-gray-100">
                      ¥{formatCurrency(result().breakdown.beforeDeduction.salaryIncome)}
                    </td>
                    <td class="text-right py-2 px-2 text-gray-900 dark:text-gray-100">
                      ¥{formatCurrency(result().breakdown.afterDeduction.salaryIncome)}
                    </td>
                  </tr>
                  <tr>
                    <td class="py-2 px-2 text-gray-700 dark:text-gray-300">所得控除合計</td>
                    <td class="text-right py-2 px-2 text-gray-900 dark:text-gray-100">
                      ¥{formatCurrency(result().breakdown.beforeDeduction.totalDeduction)}
                    </td>
                    <td class="text-right py-2 px-2 font-semibold text-blue-600 dark:text-blue-400">
                      ¥{formatCurrency(result().breakdown.afterDeduction.totalDeduction)}
                    </td>
                  </tr>
                  <tr>
                    <td class="py-2 px-2 text-gray-700 dark:text-gray-300">課税所得</td>
                    <td class="text-right py-2 px-2 text-gray-900 dark:text-gray-100">
                      ¥{formatCurrency(result().breakdown.beforeDeduction.taxableIncome)}
                    </td>
                    <td class="text-right py-2 px-2 font-semibold text-blue-600 dark:text-blue-400">
                      ¥{formatCurrency(result().breakdown.afterDeduction.taxableIncome)}
                    </td>
                  </tr>
                  <tr class="bg-green-50 dark:bg-green-900/20">
                    <td class="py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">
                      所得税額
                    </td>
                    <td class="text-right py-2 px-2 text-gray-900 dark:text-gray-100">
                      ¥{formatCurrency(result().breakdown.beforeDeduction.incomeTax)}
                    </td>
                    <td class="text-right py-2 px-2 font-bold text-green-600 dark:text-green-400">
                      ¥{formatCurrency(result().breakdown.afterDeduction.incomeTax)}
                    </td>
                  </tr>
                  <tr class="bg-purple-50 dark:bg-purple-900/20">
                    <td class="py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">
                      住民税額
                    </td>
                    <td class="text-right py-2 px-2 text-gray-900 dark:text-gray-100">
                      ¥{formatCurrency(result().breakdown.beforeDeduction.residentTax)}
                    </td>
                    <td class="text-right py-2 px-2 font-bold text-purple-600 dark:text-purple-400">
                      ¥{formatCurrency(result().breakdown.afterDeduction.residentTax)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 適用税率 */}
            <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p class="text-sm text-gray-700 dark:text-gray-300">
                <span class="font-semibold">適用税率（所得税）:</span>{' '}
                {formatPercent(result().breakdown.applicableTaxRate)}
              </p>
            </div>

            {/* 各控除の内訳 */}
            <div class="mt-6">
              <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3">各控除の内訳</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Show when={result().breakdown.deductions.ideco > 0}>
                  <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                    <p class="text-xs text-gray-600 dark:text-gray-400">iDeCo</p>
                    <p class="text-lg font-semibold text-blue-700 dark:text-blue-400">
                      ¥{formatCurrency(result().breakdown.deductions.ideco)}
                    </p>
                  </div>
                </Show>
                <Show when={result().breakdown.deductions.lifeInsurance > 0}>
                  <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-700">
                    <p class="text-xs text-gray-600 dark:text-gray-400">生命保険料控除</p>
                    <p class="text-lg font-semibold text-green-700 dark:text-green-400">
                      ¥{formatCurrency(result().breakdown.deductions.lifeInsurance)}
                    </p>
                  </div>
                </Show>
                <Show when={result().breakdown.deductions.earthquakeInsurance > 0}>
                  <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
                    <p class="text-xs text-gray-600 dark:text-gray-400">地震保険料控除</p>
                    <p class="text-lg font-semibold text-yellow-700 dark:text-yellow-400">
                      ¥{formatCurrency(result().breakdown.deductions.earthquakeInsurance)}
                    </p>
                  </div>
                </Show>
                <Show when={result().breakdown.deductions.medicalExpense > 0}>
                  <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-700">
                    <p class="text-xs text-gray-600 dark:text-gray-400">医療費控除</p>
                    <p class="text-lg font-semibold text-red-700 dark:text-red-400">
                      ¥{formatCurrency(result().breakdown.deductions.medicalExpense)}
                    </p>
                  </div>
                </Show>
                <Show when={result().breakdown.deductions.donation > 0}>
                  <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-700">
                    <p class="text-xs text-gray-600 dark:text-gray-400">寄附金控除</p>
                    <p class="text-lg font-semibold text-purple-700 dark:text-purple-400">
                      ¥{formatCurrency(result().breakdown.deductions.donation)}
                    </p>
                  </div>
                </Show>
                <Show when={result().breakdown.deductions.housingLoanTaxCredit > 0}>
                  <div class="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-200 dark:border-indigo-700">
                    <p class="text-xs text-gray-600 dark:text-gray-400">住宅ローン控除</p>
                    <p class="text-lg font-semibold text-indigo-700 dark:text-indigo-400">
                      ¥{formatCurrency(result().breakdown.deductions.housingLoanTaxCredit)}
                    </p>
                  </div>
                </Show>
                <Show when={result().breakdown.deductions.basicDeduction > 0}>
                  <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <p class="text-xs text-gray-600 dark:text-gray-400">基礎控除</p>
                    <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      ¥{formatCurrency(result().breakdown.deductions.basicDeduction)}
                    </p>
                  </div>
                </Show>
                <Show when={result().breakdown.deductions.socialInsurance > 0}>
                  <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <p class="text-xs text-gray-600 dark:text-gray-400">社会保険料控除（概算）</p>
                    <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      ¥{formatCurrency(result().breakdown.deductions.socialInsurance)}
                    </p>
                  </div>
                </Show>
              </div>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
};
