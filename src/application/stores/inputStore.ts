import { createStore } from 'solid-js/store';
import type { DeductionInput, HousingType } from '../../domain/types';
import { InputDataStorage } from '../../infrastructure/localStorage/InputDataStorage';

/**
 * 入力状態管理ストア
 *
 * ユーザー入力を管理し、localStorageへの自動保存を行う
 */

/** 初期状態 */
const initialState: DeductionInput = {
  salary: 5000000, // デフォルト500万円
};

/** グローバル入力ストア */
export const [inputStore, setInputStore] = createStore<DeductionInput>(initialState);

/** localStorage保存用のストレージインスタンス */
const storage = new InputDataStorage();

/**
 * 入力値をリセット
 */
export function resetInput() {
  setInputStore({
    salary: 5000000,
    ideco: undefined,
    lifeInsurance: undefined,
    earthquakeInsurance: undefined,
    medicalExpense: undefined,
    housingLoan: undefined,
    specialExpense: undefined,
    donation: undefined,
  });
}

/**
 * 年収を更新
 */
export function setSalary(salary: number) {
  setInputStore('salary', salary);
}

/**
 * iDeCo入力を更新
 */
export function setIdeco(annualPayment: number | undefined) {
  if (annualPayment === undefined || annualPayment === 0) {
    setInputStore('ideco', undefined);
  } else {
    setInputStore('ideco', { annualPayment });
  }
}

/**
 * 生命保険料入力を更新
 */
export function setLifeInsurance(
  isNewSystem: boolean,
  generalLifeInsurance?: number,
  personalPensionInsurance?: number,
  medicalCareInsurance?: number
) {
  if (!generalLifeInsurance && !personalPensionInsurance && !medicalCareInsurance) {
    setInputStore('lifeInsurance', undefined);
  } else {
    setInputStore('lifeInsurance', {
      isNewSystem,
      generalLifeInsurance,
      personalPensionInsurance,
      medicalCareInsurance,
    });
  }
}

/**
 * 地震保険料入力を更新
 */
export function setEarthquakeInsurance(annualPayment: number | undefined) {
  if (annualPayment === undefined || annualPayment === 0) {
    setInputStore('earthquakeInsurance', undefined);
  } else {
    setInputStore('earthquakeInsurance', { annualPayment });
  }
}

/**
 * 医療費入力を更新
 */
export function setMedicalExpense(totalExpense: number | undefined) {
  if (totalExpense === undefined || totalExpense === 0) {
    setInputStore('medicalExpense', undefined);
  } else {
    setInputStore('medicalExpense', { totalExpense });
  }
}

/**
 * 寄附金入力を更新
 */
export function setDonation(furusato: number | undefined, other: number | undefined) {
  if ((furusato === undefined || furusato === 0) && (other === undefined || other === 0)) {
    setInputStore('donation', undefined);
  } else {
    setInputStore('donation', { furusato: furusato ?? 0, other: other ?? 0 });
  }
}

/**
 * 特定支出入力を更新
 */
export function setSpecialExpense(commuteExpense: number | undefined) {
  if (commuteExpense === undefined || commuteExpense === 0) {
    setInputStore('specialExpense', undefined);
  } else {
    setInputStore('specialExpense', { commuteExpense });
  }
}

/**
 * 住宅ローン入力を更新
 */
export function setHousingLoan(
  yearEndBalance: number | undefined,
  residenceYear: number,
  housingType: HousingType
) {
  if (yearEndBalance === undefined || yearEndBalance === 0) {
    setInputStore('housingLoan', undefined);
  } else {
    setInputStore('housingLoan', {
      yearEndBalance,
      residenceYear,
      housingType,
    });
  }
}

/**
 * 入力データを即座にlocalStorageに保存
 *
 * フォーカスアウト時など、デバウンスを待たずに
 * 確実に保存したい場合に使用する。
 */
export function saveInputNow() {
  storage.save(inputStore);
}
