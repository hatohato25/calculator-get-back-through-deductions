import { type Component, createSignal } from 'solid-js';
import {
  inputStore,
  saveInputNow,
  setEarthquakeInsurance,
} from '../../../application/stores/inputStore';
import { HelpTooltip } from '../common/HelpTooltip';
import { Input } from '../common/Input';

/**
 * 地震保険料控除入力コンポーネント
 */
export const EarthquakeInsuranceInput: Component = () => {
  // 編集中の値を保持（文字列として）
  const [editingValue, setEditingValue] = createSignal<string | number>(
    inputStore.earthquakeInsurance?.annualPayment ?? ''
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
      setEarthquakeInsurance(undefined);
      saveInputNow();
      return;
    }

    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

    // NaNチェック - 無効な入力は無視
    if (!Number.isNaN(numValue)) {
      setEarthquakeInsurance(numValue);
    }

    saveInputNow();
  };

  return (
    <div class="flex items-start">
      <div class="flex-1">
        <Input
          label="年間地震保険料"
          type="number"
          value={editingValue()}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="30000"
          min={0}
          max={100000}
          unit="円/年"
          helpText="年間保険料を入力（5年契約の場合は支払総額÷5）"
        />
      </div>
      <HelpTooltip content="地震保険の年間保険料を入力してください。5年一括払いの場合は、支払総額を5で割った年間換算額を入力します。控除額の上限は年間5万円です。" />
    </div>
  );
};
