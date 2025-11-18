import { type Component, createMemo, createSignal } from 'solid-js';
import { inputStore, saveInputNow, setIdeco } from '../../../application/stores/inputStore';
import { HelpTooltip } from '../common/HelpTooltip';
import { Input } from '../common/Input';

/**
 * iDeCo入力コンポーネント
 */
export const IdecoInput: Component = () => {
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
    return inputStore.ideco?.annualPayment ?? '';
  });

  const handleFocus = () => {
    // フォーカス時に現在のstoreの値を編集値にコピー
    setEditingValue(inputStore.ideco?.annualPayment ?? '');
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
      setIdeco(undefined);
      saveInputNow();
      return;
    }

    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

    // NaNチェック - 無効な入力は無視
    if (!Number.isNaN(numValue)) {
      setIdeco(numValue);
    }

    saveInputNow();
  };

  return (
    <div class="flex items-start">
      <div class="flex-1">
        <Input
          label="iDeCo（小規模企業共済等掛金）"
          type="number"
          value={displayValue()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="276000"
          min={0}
          max={816000}
          step={1000}
          unit="円/年"
          helpText="年間の掛金合計額を入力してください（上限: 816,000円）"
        />
      </div>
      <HelpTooltip content="iDeCoは全額が所得控除の対象となります。企業年金がない場合の上限は月額23,000円（年間276,000円）です。掛金は全額控除されるため節税効果が高いです。" />
    </div>
  );
};
