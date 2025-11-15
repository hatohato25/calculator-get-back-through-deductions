import type { HousingType } from './HousingType';
import type {
  HousingLoanLimit,
  LifeInsuranceDeductionEntry,
  SalaryDeductionEntry,
  TaxRateEntry,
} from './TaxRate';

/**
 * IndexedDBに保存する税制データ
 */
export type TaxData = {
  /** データのバージョン（例: '2025'） */
  version: string;

  /** 最終更新日時（ISO8601形式） */
  lastUpdated: string;

  /** 給与所得控除表 */
  salaryDeduction: SalaryDeductionEntry[];

  /** 所得税率表 */
  incomeTaxRates: TaxRateEntry[];

  /** 生命保険料控除の計算表 */
  lifeInsuranceDeduction: {
    /** 新制度（2012年1月1日以後契約） */
    new: LifeInsuranceDeductionEntry[];
    /** 旧制度（2011年12月31日以前契約） */
    old: LifeInsuranceDeductionEntry[];
  };

  /** 住宅ローン控除限度額表（居住開始年をキーとする） */
  housingLoanLimits: Record<number, Record<HousingType, HousingLoanLimit>>;
};
