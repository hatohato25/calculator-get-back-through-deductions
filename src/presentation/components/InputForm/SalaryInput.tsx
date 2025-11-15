import type { Component } from 'solid-js';
import { inputStore, saveInputNow, setSalary } from '../../../application/stores/inputStore';
import { HelpTooltip } from '../common/HelpTooltip';
import { Input } from '../common/Input';

/**
 * 年収入力コンポーネント
 */
export const SalaryInput: Component = () => {
  const handleChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (!Number.isNaN(numValue)) {
      setSalary(numValue);
    }
  };

  return (
    <div class="flex items-start">
      <div class="flex-1">
        <Input
          label="年収（給与収入）"
          type="number"
          value={inputStore.salary}
          onChange={handleChange}
          onBlur={saveInputNow}
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
