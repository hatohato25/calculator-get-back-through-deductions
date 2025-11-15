import { z } from 'zod';

/**
 * DeductionInput型のZodバリデーションスキーマ
 *
 * 入力値の妥当性を検証し、不正な値が計算ロジックに到達しないようにする
 */

/** 小規模企業共済等掛金控除（iDeCo）のスキーマ */
const idecoSchema = z.object({
  annualPayment: z
    .number()
    .min(0, '掛金は0円以上を入力してください')
    .max(816000, 'iDeCoの年間上限額は816,000円です'),
});

/** 生命保険料控除のスキーマ */
const lifeInsuranceSchema = z.object({
  isNewSystem: z.boolean(),
  generalLifeInsurance: z.number().min(0, '生命保険料は0円以上を入力してください').optional(),
  personalPensionInsurance: z
    .number()
    .min(0, '個人年金保険料は0円以上を入力してください')
    .optional(),
  medicalCareInsurance: z.number().min(0, '介護医療保険料は0円以上を入力してください').optional(),
});

/**
 * 地震保険料控除のスキーマ
 *
 * 注意:
 * - 入力値は「年間保険料」を想定（控除額ではなく実際の保険料）
 * - 5年契約の場合、ユーザーは支払総額を5で割った年間換算額を入力する
 * - max値100,000円は実態の最高額（約80,000円）に余裕を持たせた値
 * - 控除額の上限（50,000円）とは異なることに注意
 */
const earthquakeInsuranceSchema = z.object({
  annualPayment: z
    .number()
    .min(0, '年間地震保険料は0円以上を入力してください')
    .max(
      100000,
      '年間地震保険料が高額すぎます。5年契約の場合は年間換算額（支払総額÷5）を入力してください'
    ),
});

/** 医療費控除のスキーマ */
const medicalExpenseSchema = z.object({
  totalExpense: z
    .number()
    .min(0, '医療費は0円以上を入力してください')
    .max(10000000, '医療費が高額すぎます。金額を確認してください'),
});

/** 寄附金控除のスキーマ */
const donationSchema = z.object({
  furusato: z.number().min(0, 'ふるさと納税額は0円以上を入力してください'),
  other: z.number().min(0, 'その他寄附金額は0円以上を入力してください'),
});

/** 特定支出控除のスキーマ */
const specialExpenseSchema = z.object({
  commuteExpense: z
    .number()
    .min(0, '通勤費は0円以上を入力してください')
    .max(10000000, '通勤費が高額すぎます。金額を確認してください'),
});

/**
 * 住宅ローン控除のスキーマ
 *
 * 注意:
 * - residenceYearの範囲は動的に計算（現在の年から10年前まで）
 * - min値は過去のデータも考慮して固定（2015年）
 */
const housingLoanSchema = z.object({
  yearEndBalance: z
    .number()
    .min(0, 'ローン残高は0円以上を入力してください')
    .max(100000000, 'ローン残高が高額すぎます。金額を確認してください'),
  residenceYear: z
    .number()
    .int('居住開始年は整数で入力してください')
    .min(2015, '2015年以降の居住開始年を入力してください')
    .max(
      new Date().getFullYear(),
      `${new Date().getFullYear()}年以前の居住開始年を入力してください`
    ),
  housingType: z.enum(['new-certified', 'new-zeh', 'new-energy-saving', 'new-other', 'used']),
});

/** DeductionInput全体のスキーマ */
export const deductionInputSchema = z.object({
  salary: z
    .number()
    .min(1000000, '年収は100万円以上を入力してください')
    .max(99990000, '年収は9,999万円以下を入力してください'),
  ideco: idecoSchema.optional(),
  lifeInsurance: lifeInsuranceSchema.optional(),
  earthquakeInsurance: earthquakeInsuranceSchema.optional(),
  medicalExpense: medicalExpenseSchema.optional(),
  donation: donationSchema.optional(),
  specialExpense: specialExpenseSchema.optional(),
  housingLoan: housingLoanSchema.optional(),
});

/** バリデーション済みの型 */
export type ValidatedDeductionInput = z.infer<typeof deductionInputSchema>;

/**
 * 入力値をバリデーションする
 * @param input バリデーション対象の入力データ
 * @returns バリデーション結果
 */
export function validateDeductionInput(input: unknown) {
  return deductionInputSchema.safeParse(input);
}
