import type { HousingType } from './HousingType';

/**
 * ユーザーが入力する全データ
 */
export type DeductionInput = {
  /** 基本情報: 年収（給与収入） */
  salary: number;

  /** 小規模企業共済等掛金控除（iDeCo） */
  ideco?: {
    /** 年間掛金合計額 */
    annualPayment: number;
  };

  /** 生命保険料控除 */
  lifeInsurance?: {
    /** true: 新制度（2012年1月1日以後契約）, false: 旧制度（2011年12月31日以前契約） */
    isNewSystem: boolean;
    /** 一般生命保険料（年間支払額） */
    generalLifeInsurance?: number;
    /** 個人年金保険料（年間支払額） */
    personalPensionInsurance?: number;
    /** 介護医療保険料（年間支払額、新制度のみ） */
    medicalCareInsurance?: number;
  };

  /** 地震保険料控除 */
  earthquakeInsurance?: {
    /** 年間支払額 */
    annualPayment: number;
  };

  /** 医療費控除 */
  medicalExpense?: {
    /** 年間医療費合計 */
    totalExpense: number;
  };

  /** 寄附金控除 */
  donation?: {
    /** ふるさと納税額 */
    furusato: number;
    /** その他寄附金（認定NPO法人等） */
    other: number;
  };

  /** 特定支出控除（通勤費） */
  specialExpense?: {
    /** 年間通勤費支出額（会社が負担しない部分） */
    commuteExpense: number;
  };

  /** 住宅ローン控除 */
  housingLoan?: {
    /** 年末時点の借入残高 */
    yearEndBalance: number;
    /** 居住開始年（例: 2024） */
    residenceYear: number;
    /** 住宅の種類 */
    housingType: HousingType;
  };
};

/**
 * 生命保険料の支払額
 */
export type LifeInsurancePayments = {
  /** 一般生命保険料 */
  generalLifeInsurance?: number;
  /** 個人年金保険料 */
  personalPensionInsurance?: number;
  /** 介護医療保険料（新制度のみ） */
  medicalCareInsurance?: number;
};

/**
 * 各種控除額のサマリー
 */
export type DeductionSummary = {
  /** 小規模企業共済等掛金控除（iDeCo） */
  ideco: number;
  /** 生命保険料控除 */
  lifeInsurance: number;
  /** 地震保険料控除 */
  earthquakeInsurance: number;
  /** 医療費控除 */
  medicalExpense: number;
  /** 寄附金控除 */
  donation: number;
  /** 特定支出控除 */
  specialExpense: number;
  /** 基礎控除（一律48万円） */
  basicDeduction: number;
  /** 社会保険料控除（概算） */
  socialInsurance: number;
};
