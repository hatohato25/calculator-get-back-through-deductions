import type { Component } from 'solid-js';
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
  const handleChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (Number.isNaN(numValue) || numValue === 0) {
      setSpecialExpense(undefined);
    } else {
      setSpecialExpense(numValue);
    }
  };

  return (
    <div>
      <div class="flex items-start">
        <div class="flex-1">
          <Input
            label="特定支出控除（通勤費）"
            type="number"
            value={inputStore.specialExpense?.commuteExpense ?? ''}
            onChange={handleChange}
            onBlur={saveInputNow}
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
