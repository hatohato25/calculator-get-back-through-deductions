import type { Component } from 'solid-js';
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
  const handleChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (Number.isNaN(numValue) || numValue === 0) {
      setEarthquakeInsurance(undefined);
    } else {
      setEarthquakeInsurance(numValue);
    }
  };

  return (
    <div class="flex items-start">
      <div class="flex-1">
        <Input
          label="年間地震保険料"
          type="number"
          value={inputStore.earthquakeInsurance?.annualPayment ?? ''}
          onChange={handleChange}
          onBlur={saveInputNow}
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
