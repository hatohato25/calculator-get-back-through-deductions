import type { Component } from 'solid-js';
import { inputStore, saveInputNow, setIdeco } from '../../../application/stores/inputStore';
import { HelpTooltip } from '../common/HelpTooltip';
import { Input } from '../common/Input';

/**
 * iDeCo入力コンポーネント
 */
export const IdecoInput: Component = () => {
  const handleChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (Number.isNaN(numValue) || numValue === 0) {
      setIdeco(undefined);
    } else {
      setIdeco(numValue);
    }
  };

  return (
    <div class="flex items-start">
      <div class="flex-1">
        <Input
          label="iDeCo（小規模企業共済等掛金）"
          type="number"
          value={inputStore.ideco?.annualPayment ?? ''}
          onChange={handleChange}
          onBlur={saveInputNow}
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
