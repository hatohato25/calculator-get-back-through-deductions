import { type Component, createMemo, createSignal } from 'solid-js';
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
    // 制度切り替え時は、現在の保険料入力値を保持したまま制度だけ変更
    setLifeInsurance(
      newSystem,
      inputStore.lifeInsurance?.generalLifeInsurance,
      inputStore.lifeInsurance?.personalPensionInsurance,
      inputStore.lifeInsurance?.medicalCareInsurance
    );
    // 制度切り替えは明示的なユーザー操作なので即座に保存
    saveInputNow();
  };

  // 編集中の値を保持（文字列として）
  const [editingGeneral, setEditingGeneral] = createSignal<string | number>(
    inputStore.lifeInsurance?.generalLifeInsurance ?? ''
  );
  const [editingPension, setEditingPension] = createSignal<string | number>(
    inputStore.lifeInsurance?.personalPensionInsurance ?? ''
  );
  const [editingMedical, setEditingMedical] = createSignal<string | number>(
    inputStore.lifeInsurance?.medicalCareInsurance ?? ''
  );

  const handleGeneralChange = (value: number | string) => {
    // 編集中は文字列をそのまま保持（"000000"などの途中入力でもカーソル位置が維持される）
    setEditingGeneral(value);
  };

  const handleGeneralBlur = () => {
    // フォーカスアウト時に数値変換してstoreに保存
    const value = editingGeneral();

    // 空文字列・null・undefinedの明示的な処理
    if (value === '' || value === null || value === undefined) {
      setLifeInsurance(
        isNewSystem(),
        undefined,
        inputStore.lifeInsurance?.personalPensionInsurance,
        inputStore.lifeInsurance?.medicalCareInsurance
      );
      saveInputNow();
      return;
    }

    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

    // NaNチェック - 無効な入力は無視
    if (!Number.isNaN(numValue)) {
      setLifeInsurance(
        isNewSystem(),
        numValue,
        inputStore.lifeInsurance?.personalPensionInsurance,
        inputStore.lifeInsurance?.medicalCareInsurance
      );
    }

    saveInputNow();
  };

  const handlePensionChange = (value: number | string) => {
    // 編集中は文字列をそのまま保持（"000000"などの途中入力でもカーソル位置が維持される）
    setEditingPension(value);
  };

  const handlePensionBlur = () => {
    // フォーカスアウト時に数値変換してstoreに保存
    const value = editingPension();

    // 空文字列・null・undefinedの明示的な処理
    if (value === '' || value === null || value === undefined) {
      setLifeInsurance(
        isNewSystem(),
        inputStore.lifeInsurance?.generalLifeInsurance,
        undefined,
        inputStore.lifeInsurance?.medicalCareInsurance
      );
      saveInputNow();
      return;
    }

    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

    // NaNチェック - 無効な入力は無視
    if (!Number.isNaN(numValue)) {
      setLifeInsurance(
        isNewSystem(),
        inputStore.lifeInsurance?.generalLifeInsurance,
        numValue,
        inputStore.lifeInsurance?.medicalCareInsurance
      );
    }

    saveInputNow();
  };

  const handleMedicalChange = (value: number | string) => {
    // 編集中は文字列をそのまま保持（"000000"などの途中入力でもカーソル位置が維持される）
    setEditingMedical(value);
  };

  const handleMedicalBlur = () => {
    // フォーカスアウト時に数値変換してstoreに保存
    const value = editingMedical();

    // 空文字列・null・undefinedの明示的な処理
    if (value === '' || value === null || value === undefined) {
      setLifeInsurance(
        isNewSystem(),
        inputStore.lifeInsurance?.generalLifeInsurance,
        inputStore.lifeInsurance?.personalPensionInsurance,
        undefined
      );
      saveInputNow();
      return;
    }

    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

    // NaNチェック - 無効な入力は無視
    if (!Number.isNaN(numValue)) {
      setLifeInsurance(
        isNewSystem(),
        inputStore.lifeInsurance?.generalLifeInsurance,
        inputStore.lifeInsurance?.personalPensionInsurance,
        numValue
      );
    }

    saveInputNow();
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
            value={editingGeneral()}
            onChange={handleGeneralChange}
            onBlur={handleGeneralBlur}
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
            value={editingPension()}
            onChange={handlePensionChange}
            onBlur={handlePensionBlur}
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
              value={editingMedical()}
              onChange={handleMedicalChange}
              onBlur={handleMedicalBlur}
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
