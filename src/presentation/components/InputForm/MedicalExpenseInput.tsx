import { type Component, createMemo, createSignal } from 'solid-js';
import {
  inputStore,
  saveInputNow,
  setMedicalExpense,
} from '../../../application/stores/inputStore';
import { HelpTooltip } from '../common/HelpTooltip';
import { Input } from '../common/Input';

/**
 * 医療費控除入力コンポーネント
 */
export const MedicalExpenseInput: Component = () => {
  // 編集中かどうかを追跡
  const [isEditing, setIsEditing] = createSignal(false);
  // 編集中の値を保持（文字列として）
  const [editingValue, setEditingValue] = createSignal<string | number>('');

  // 表示値: 編集中は編集値、そうでなければstoreの値
  // localStorageから復元された値もここで自動的に反映される
  const displayValue = createMemo(() => {
    if (isEditing()) {
      return editingValue();
    }
    return inputStore.medicalExpense?.totalExpense ?? '';
  });

  const handleFocus = () => {
    // フォーカス時に現在のstoreの値を編集値にコピー
    setEditingValue(inputStore.medicalExpense?.totalExpense ?? '');
    setIsEditing(true);
  };

  const handleChange = (value: number | string) => {
    // 編集中は文字列をそのまま保持（"000000"などの途中入力でもカーソル位置が維持される）
    setEditingValue(value);
  };

  const handleBlur = () => {
    setIsEditing(false);

    // フォーカスアウト時に数値変換してstoreに保存
    const value = editingValue();

    // 空文字列・null・undefinedの明示的な処理
    if (value === '' || value === null || value === undefined) {
      setMedicalExpense(undefined);
      saveInputNow();
      return;
    }

    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

    // NaNチェック - 無効な入力は無視
    if (!Number.isNaN(numValue)) {
      setMedicalExpense(numValue);
    }

    saveInputNow();
  };

  return (
    <div class="flex items-start">
      <div class="flex-1">
        <Input
          label="医療費控除"
          type="number"
          value={displayValue()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="200000"
          min={0}
          step={10000}
          unit="円/年"
          helpText="年間の医療費合計（保険金等で補填された金額は除く）"
        />
      </div>
      <HelpTooltip content="1年間に支払った医療費の合計額です。（医療費 - 10万円）または（医療費 - 所得の5%）のいずれか少ない方が控除されます。家族分も含めることができます。" />
    </div>
  );
};
