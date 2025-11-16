import { type Component, createSignal } from 'solid-js';
import { inputStore, saveInputNow, setSalary } from '../../../application/stores/inputStore';
import { HelpTooltip } from '../common/HelpTooltip';
import { Input } from '../common/Input';

/**
 * 年収入力コンポーネント
 */
export const SalaryInput: Component = () => {
  // 編集中の値を保持（文字列として）
  const [editingValue, setEditingValue] = createSignal<string | number>(inputStore.salary);

  const handleChange = (value: number | string) => {
    // 編集中は文字列をそのまま保持（"000000"などの途中入力でもカーソル位置が維持される）
    setEditingValue(value);
  };

  const handleBlur = () => {
    // フォーカスアウト時に数値変換してstoreに保存
    const value = editingValue();
    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

    // NaNチェック - 無効な入力は無視
    if (!Number.isNaN(numValue)) {
      setSalary(numValue);
    }

    saveInputNow();
  };

  return (
    <div class="flex items-start">
      <div class="flex-1">
        <Input
          label="年収（給与収入）"
          type="number"
          value={editingValue()}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="5000000"
          min={1000000}
          max={99990000}
          step={10000}
          unit="円"
          required
          helpText="源泉徴収票の「支払金額」を入力してください"
        />
      </div>
      <HelpTooltip content="税込の年間給与総額（賞与含む）です。源泉徴収票の「支払金額」欄に記載されている金額を入力してください。" />
    </div>
  );
};
