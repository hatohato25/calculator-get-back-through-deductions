import { type Component, createMemo } from 'solid-js';
import { inputStore, saveInputNow, setLifeInsurance } from '../../../application/stores/inputStore';
import { HelpTooltip } from '../common/HelpTooltip';
import { Input } from '../common/Input';

/**
 * 生命保険料控除入力コンポーネント
 */
export const LifeInsuranceInput: Component = () => {
  // inputStoreから直接値を取得するメモ化された値
  // localStorageから復元された後も正しく反映される
  const isNewSystem = createMemo(() => {
    return inputStore.lifeInsurance?.isNewSystem ?? true;
  });

  const handleSystemChange = (newSystem: boolean) => {
    // 新しい制度値で保険料を更新
    const general = inputStore.lifeInsurance?.generalLifeInsurance ?? 0;
    const pension = inputStore.lifeInsurance?.personalPensionInsurance ?? 0;
    const medical = inputStore.lifeInsurance?.medicalCareInsurance ?? 0;

    if (general === 0 && pension === 0 && medical === 0) {
      setLifeInsurance(newSystem, undefined, undefined, undefined);
    } else {
      setLifeInsurance(newSystem, general || undefined, pension || undefined, medical || undefined);
    }
  };

  const handleGeneralChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
    setLifeInsurance(
      isNewSystem(),
      numValue || undefined,
      inputStore.lifeInsurance?.personalPensionInsurance,
      inputStore.lifeInsurance?.medicalCareInsurance
    );
  };

  const handlePensionChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
    setLifeInsurance(
      isNewSystem(),
      inputStore.lifeInsurance?.generalLifeInsurance,
      numValue || undefined,
      inputStore.lifeInsurance?.medicalCareInsurance
    );
  };

  const handleMedicalChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
    setLifeInsurance(
      isNewSystem(),
      inputStore.lifeInsurance?.generalLifeInsurance,
      inputStore.lifeInsurance?.personalPensionInsurance,
      numValue || undefined
    );
  };

  return (
    <div class="space-y-4">
      {/* 新旧制度選択 */}
      <div>
        <div class="flex items-center mb-2">
          <span class="block text-sm font-medium text-gray-700">適用制度</span>
          <HelpTooltip content="2012年1月1日以降に契約した保険は新制度、それ以前は旧制度となります。複数ある場合は、主な保険の契約日で判断してください。" />
        </div>
        <div class="flex space-x-4">
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="lifeInsuranceSystem"
              checked={isNewSystem()}
              onChange={() => handleSystemChange(true)}
              class="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">新制度（2012年以降）</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              name="lifeInsuranceSystem"
              checked={!isNewSystem()}
              onChange={() => handleSystemChange(false)}
              class="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">旧制度（2011年以前）</span>
          </label>
        </div>
      </div>

      {/* 一般生命保険料 */}
      <div class="flex items-start">
        <div class="flex-1">
          <Input
            label="一般生命保険料"
            type="number"
            value={inputStore.lifeInsurance?.generalLifeInsurance ?? ''}
            onChange={handleGeneralChange}
            onBlur={saveInputNow}
            placeholder="80000"
            min={0}
            step={1000}
            unit="円/年"
            helpText={
              isNewSystem()
                ? '年間支払額（最大控除額: 40,000円）'
                : '年間支払額（最大控除額: 50,000円）'
            }
          />
        </div>
        <HelpTooltip content="死亡保険や養老保険などの保険料です。年間の支払額を入力してください。" />
      </div>

      {/* 個人年金保険料 */}
      <div class="flex items-start">
        <div class="flex-1">
          <Input
            label="個人年金保険料"
            type="number"
            value={inputStore.lifeInsurance?.personalPensionInsurance ?? ''}
            onChange={handlePensionChange}
            onBlur={saveInputNow}
            placeholder="80000"
            min={0}
            step={1000}
            unit="円/年"
            helpText={
              isNewSystem()
                ? '年間支払額（最大控除額: 40,000円）'
                : '年間支払額（最大控除額: 50,000円）'
            }
          />
        </div>
        <HelpTooltip content="個人年金保険料税制適格特約が付加された保険の保険料です。" />
      </div>

      {/* 介護医療保険料（新制度のみ） */}
      {isNewSystem() && (
        <div class="flex items-start">
          <div class="flex-1">
            <Input
              label="介護医療保険料"
              type="number"
              value={inputStore.lifeInsurance?.medicalCareInsurance ?? ''}
              onChange={handleMedicalChange}
              onBlur={saveInputNow}
              placeholder="80000"
              min={0}
              step={1000}
              unit="円/年"
              helpText="年間支払額（最大控除額: 40,000円）"
            />
          </div>
          <HelpTooltip content="医療保険や介護保険などの保険料です。新制度のみの控除項目です。" />
        </div>
      )}
    </div>
  );
};
