import type { Component } from 'solid-js';
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
  const handleChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (Number.isNaN(numValue) || numValue === 0) {
      setMedicalExpense(undefined);
    } else {
      setMedicalExpense(numValue);
    }
  };

  return (
    <div class="flex items-start">
      <div class="flex-1">
        <Input
          label="医療費控除"
          type="number"
          value={inputStore.medicalExpense?.totalExpense ?? ''}
          onChange={handleChange}
          onBlur={saveInputNow}
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
