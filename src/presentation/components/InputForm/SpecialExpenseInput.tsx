import { type Component, createSignal } from 'solid-js';
import {
  inputStore,
  saveInputNow,
  setSpecialExpense,
} from '../../../application/stores/inputStore';
import { HelpTooltip } from '../common/HelpTooltip';
import { Input } from '../common/Input';

/**
 * 特定支出控除入力コンポーネント
 */
export const SpecialExpenseInput: Component = () => {
  // 編集中の値を保持（文字列として）
  const [editingValue, setEditingValue] = createSignal<string | number>(
    inputStore.specialExpense?.commuteExpense ?? ''
  );

  const handleChange = (value: number | string) => {
    // 編集中は文字列をそのまま保持（"000000"などの途中入力でもカーソル位置が維持される）
    setEditingValue(value);
  };

  const handleBlur = () => {
    // フォーカスアウト時に数値変換してstoreに保存
    const value = editingValue();

    // 空文字列・null・undefinedの明示的な処理
    if (value === '' || value === null || value === undefined) {
      setSpecialExpense(undefined);
      saveInputNow();
      return;
    }

    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

    // NaNチェック - 無効な入力は無視
    if (!Number.isNaN(numValue)) {
      setSpecialExpense(numValue);
    }

    saveInputNow();
  };

  return (
    <div>
      <div class="flex items-start">
        <div class="flex-1">
          <Input
            label="特定支出控除（通勤費）"
            type="number"
            value={editingValue()}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="100000"
            min={0}
            step={10000}
            unit="円/年"
            helpText="会社が負担しない通勤費（給与所得控除額の1/2を超える部分が控除）"
          />
        </div>
        <HelpTooltip content="会社が負担しない通勤費用です。給与所得控除額の1/2を超えた部分が控除されます。実務上、利用するケースは稀です。" />
      </div>
      {/* 注意書き */}
      <div class="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p class="text-xs text-amber-800">
          ⚠️
          特定支出控除は給与所得控除額の1/2を超える支出が必要なため、実際に控除を受けられるケースは限られます。
        </p>
      </div>
    </div>
  );
};
