import { type Component, createMemo, createSignal } from 'solid-js';
import { inputStore, saveInputNow, setHousingLoan } from '../../../application/stores/inputStore';
import type { HousingType } from '../../../domain/types';
import { HelpTooltip } from '../common/HelpTooltip';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

/**
 * 住宅ローン控除入力コンポーネント
 */
export const HousingLoanInput: Component = () => {
  // 現在の年から13年前までの年リストを動的生成
  const yearOptions = createMemo(() => {
    const currentYear = new Date().getFullYear();
    const years: Array<{ value: string; label: string }> = [];

    // 現在の年から13年前まで（14年分）を降順で生成
    for (let year = currentYear; year >= currentYear - 13; year--) {
      years.push({
        value: year.toString(),
        label: `${year}年`,
      });
    }

    return years;
  });

  // inputStoreから直接値を取得するメモ化された値
  // localStorageから復元された後も正しく反映される
  const residenceYear = createMemo(() => {
    return inputStore.housingLoan?.residenceYear ?? new Date().getFullYear();
  });

  const housingType = createMemo<HousingType>(() => {
    return inputStore.housingLoan?.housingType ?? 'new-certified';
  });

  // 編集中の値を保持（文字列として）
  const [editingBalance, setEditingBalance] = createSignal<string | number>(
    inputStore.housingLoan?.yearEndBalance ?? ''
  );

  const handleBalanceChange = (value: number | string) => {
    // 編集中は文字列をそのまま保持（"000000"などの途中入力でもカーソル位置が維持される）
    setEditingBalance(value);
  };

  const handleBalanceBlur = () => {
    // フォーカスアウト時に数値変換してstoreに保存
    const value = editingBalance();

    // 空文字列・null・undefinedの明示的な処理
    if (value === '' || value === null || value === undefined) {
      setHousingLoan(undefined, residenceYear(), housingType());
      saveInputNow();
      return;
    }

    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

    // NaNチェック - 無効な入力は無視
    if (!Number.isNaN(numValue)) {
      setHousingLoan(numValue, residenceYear(), housingType());
    }

    saveInputNow();
  };

  const handleYearChange = (value: string | number) => {
    const year = typeof value === 'string' ? Number.parseInt(value, 10) : value;
    if (inputStore.housingLoan?.yearEndBalance) {
      setHousingLoan(inputStore.housingLoan.yearEndBalance, year, housingType());
    } else {
      // 残高が未入力でも年と種類を保存
      setHousingLoan(undefined, year, housingType());
    }
  };

  const handleTypeChange = (value: string | number) => {
    const type = value as HousingType;
    if (inputStore.housingLoan?.yearEndBalance) {
      setHousingLoan(inputStore.housingLoan.yearEndBalance, residenceYear(), type);
    } else {
      // 残高が未入力でも年と種類を保存
      setHousingLoan(undefined, residenceYear(), type);
    }
  };

  const housingTypeOptions = [
    { value: 'new-certified', label: '新築・認定住宅（長期優良住宅等）' },
    { value: 'new-zeh', label: '新築・ZEH水準省エネ住宅' },
    { value: 'new-energy-saving', label: '新築・省エネ基準適合住宅' },
    { value: 'new-other', label: '新築・その他' },
    { value: 'used', label: '中古住宅' },
  ];

  return (
    <div class="space-y-4">
      {/* ローン残高 */}
      <div class="flex items-start">
        <div class="flex-1">
          <Input
            label="年末時点のローン残高"
            type="number"
            value={editingBalance()}
            onChange={handleBalanceChange}
            onBlur={handleBalanceBlur}
            placeholder="30000000"
            min={0}
            max={100000000}
            step={100000}
            unit="円"
            helpText="12月31日時点の住宅ローン残高"
          />
        </div>
        <HelpTooltip content="年末時点（12月31日）の住宅ローン残高です。金融機関から送られてくる「住宅ローン年末残高証明書」に記載されています。" />
      </div>

      {/* 居住開始年 */}
      <div class="flex items-start">
        <div class="flex-1">
          <Select
            label="居住開始年"
            options={yearOptions()}
            value={residenceYear().toString()}
            onChange={handleYearChange}
            onBlur={saveInputNow}
            helpText="住宅に入居を開始した年"
          />
        </div>
        <HelpTooltip content="新居に入居を開始した年です。控除率や控除期間は居住開始年により異なります。" />
      </div>

      {/* 住宅の種類 */}
      <div class="flex items-start">
        <div class="flex-1">
          <Select
            label="住宅の種類"
            options={housingTypeOptions}
            value={housingType()}
            onChange={handleTypeChange}
            onBlur={saveInputNow}
            helpText="住宅の性能区分により控除限度額が異なります"
          />
        </div>
        <HelpTooltip content="住宅の性能区分によって借入限度額が変わります。認定住宅は長期優良住宅や低炭素住宅などが該当します。詳細は住宅販売会社にご確認ください。" />
      </div>

      {/* 情報表示 */}
      <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-xs text-blue-800">
          ℹ️ 住宅ローン控除は「税額控除」のため、計算された所得税額から直接差し引かれます。
          <br />
          <br />
          【制度変更】
          <br />
          2021年以前: 控除率1%、控除期間は最長10年
          <br />
          2022年以降: 控除率0.7%、控除期間は最長13年（住宅の種類により借入限度額が異なります）
        </p>
      </div>
    </div>
  );
};
