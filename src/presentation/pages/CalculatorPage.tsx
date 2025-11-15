import type { Component } from 'solid-js';
import { useCalculation } from '../../application/hooks/useCalculation';
import { DonationInput } from '../components/InputForm/DonationInput';
import { EarthquakeInsuranceInput } from '../components/InputForm/EarthquakeInsuranceInput';
import { HousingLoanInput } from '../components/InputForm/HousingLoanInput';
import { IdecoInput } from '../components/InputForm/IdecoInput';
import { LifeInsuranceInput } from '../components/InputForm/LifeInsuranceInput';
import { MedicalExpenseInput } from '../components/InputForm/MedicalExpenseInput';
import { SalaryInput } from '../components/InputForm/SalaryInput';
import { SpecialExpenseInput } from '../components/InputForm/SpecialExpenseInput';
import { BreakdownTable } from '../components/ResultDisplay/BreakdownTable';
import { RefundSummary } from '../components/ResultDisplay/RefundSummary';
import { Card } from '../components/common/Card';

/**
 * メインページコンポーネント
 *
 * 入力フォームと結果表示を統合
 * レスポンシブレイアウト（デスクトップ: 2カラム、モバイル: 1カラム）
 */
export const CalculatorPage: Component = () => {
  const calculation = useCalculation();

  // リアクティブに自動計算を実行
  calculation.calculate();

  return (
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 左カラム: 入力フォーム */}
      <div class="space-y-6">
        {/* 基本情報 */}
        <Card title="基本情報">
          <SalaryInput />
        </Card>

        {/* iDeCo */}
        <Card title="iDeCo（小規模企業共済等掛金控除）">
          <IdecoInput />
        </Card>

        {/* 生命保険料控除 */}
        <Card title="生命保険料控除">
          <LifeInsuranceInput />
        </Card>

        {/* 地震保険料控除 */}
        <Card title="地震保険料控除">
          <EarthquakeInsuranceInput />
        </Card>

        {/* 医療費控除 */}
        <Card title="医療費控除">
          <MedicalExpenseInput />
        </Card>

        {/* 寄附金控除 */}
        <Card title="寄附金控除">
          <DonationInput />
        </Card>

        {/* 特定支出控除 */}
        <Card title="特定支出控除">
          <SpecialExpenseInput />
        </Card>

        {/* 住宅ローン控除 */}
        <Card title="住宅ローン控除">
          <HousingLoanInput />
        </Card>
      </div>

      {/* 右カラム: 結果表示 */}
      <div class="space-y-6 lg:sticky lg:top-6 lg:self-start">
        {/* 還付金サマリー */}
        <RefundSummary result={calculation.result()} isLoading={calculation.isLoading()} />

        {/* 計算内訳 */}
        <BreakdownTable result={calculation.result()} />

        {/* エラー表示 */}
        {calculation.error() && (
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start">
              <svg
                class="w-5 h-5 text-red-500 mt-0.5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <title>エラーアイコン</title>
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <div>
                <h4 class="text-sm font-semibold text-red-800 mb-1">エラーが発生しました</h4>
                <p class="text-sm text-red-700">{calculation.error()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
