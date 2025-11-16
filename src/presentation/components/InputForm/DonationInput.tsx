import { type Component, createSignal } from 'solid-js';
import { inputStore, saveInputNow, setDonation } from '../../../application/stores/inputStore';
import { HelpTooltip } from '../common/HelpTooltip';
import { Input } from '../common/Input';

/**
 * 寄附金控除入力コンポーネント
 */
export const DonationInput: Component = () => {
  // 編集中の値を保持（文字列として）
  const [editingFurusato, setEditingFurusato] = createSignal<string | number>(
    inputStore.donation?.furusato ?? ''
  );
  const [editingOther, setEditingOther] = createSignal<string | number>(
    inputStore.donation?.other ?? ''
  );

  const handleFurusatoChange = (value: number | string) => {
    // 編集中は文字列をそのまま保持（"000000"などの途中入力でもカーソル位置が維持される）
    setEditingFurusato(value);
  };

  const handleFurusatoBlur = () => {
    // フォーカスアウト時に数値変換してstoreに保存
    const value = editingFurusato();

    // 空文字列・null・undefinedの明示的な処理
    if (value === '' || value === null || value === undefined) {
      setDonation(undefined, inputStore.donation?.other);
      saveInputNow();
      return;
    }

    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

    // NaNチェック - 無効な入力は無視
    if (!Number.isNaN(numValue)) {
      setDonation(numValue, inputStore.donation?.other);
    }

    saveInputNow();
  };

  const handleOtherChange = (value: number | string) => {
    // 編集中は文字列をそのまま保持（"000000"などの途中入力でもカーソル位置が維持される）
    setEditingOther(value);
  };

  const handleOtherBlur = () => {
    // フォーカスアウト時に数値変換してstoreに保存
    const value = editingOther();

    // 空文字列・null・undefinedの明示的な処理
    if (value === '' || value === null || value === undefined) {
      setDonation(inputStore.donation?.furusato, undefined);
      saveInputNow();
      return;
    }

    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

    // NaNチェック - 無効な入力は無視
    if (!Number.isNaN(numValue)) {
      setDonation(inputStore.donation?.furusato, numValue);
    }

    saveInputNow();
  };

  return (
    <div class="space-y-4">
      {/* ふるさと納税 */}
      <div class="flex items-start">
        <div class="flex-1">
          <Input
            label="ふるさと納税"
            type="number"
            value={editingFurusato()}
            onChange={handleFurusatoChange}
            onBlur={handleFurusatoBlur}
            placeholder="50000"
            min={0}
            step={1000}
            unit="円/年"
            helpText="年間のふるさと納税額合計"
          />
        </div>
        <HelpTooltip content="ふるさと納税額のうち、自己負担2,000円を超える部分が控除されます。控除上限額は所得によって異なります。" />
      </div>

      {/* その他寄附金 */}
      <div class="flex items-start">
        <div class="flex-1">
          <Input
            label="その他寄附金"
            type="number"
            value={editingOther()}
            onChange={handleOtherChange}
            onBlur={handleOtherBlur}
            placeholder="10000"
            min={0}
            step={1000}
            unit="円/年"
            helpText="認定NPO法人等への寄附金"
          />
        </div>
        <HelpTooltip content="認定NPO法人、公益社団法人、学校法人などへの寄附金です。（寄附額 - 2,000円）が控除されます。" />
      </div>
    </div>
  );
};
