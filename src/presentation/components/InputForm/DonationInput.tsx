import type { Component } from 'solid-js';
import { inputStore, saveInputNow, setDonation } from '../../../application/stores/inputStore';
import { HelpTooltip } from '../common/HelpTooltip';
import { Input } from '../common/Input';

/**
 * 寄附金控除入力コンポーネント
 */
export const DonationInput: Component = () => {
  const handleFurusatoChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
    const furusato = Number.isNaN(numValue) ? 0 : numValue;
    const other = inputStore.donation?.other ?? 0;
    setDonation(furusato, other);
  };

  const handleOtherChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
    const other = Number.isNaN(numValue) ? 0 : numValue;
    const furusato = inputStore.donation?.furusato ?? 0;
    setDonation(furusato, other);
  };

  return (
    <div class="space-y-4">
      {/* ふるさと納税 */}
      <div class="flex items-start">
        <div class="flex-1">
          <Input
            label="ふるさと納税"
            type="number"
            value={inputStore.donation?.furusato ?? ''}
            onChange={handleFurusatoChange}
            onBlur={saveInputNow}
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
            value={inputStore.donation?.other ?? ''}
            onChange={handleOtherChange}
            onBlur={saveInputNow}
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
