/**
 * 住宅ローン控除における住宅の種類
 *
 * 参照: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1213.htm
 */
export type HousingType =
  | 'new-certified' // 新築・認定住宅（認定長期優良住宅・認定低炭素住宅）
  | 'new-zeh' // 新築・ZEH水準省エネ住宅
  | 'new-energy-saving' // 新築・省エネ基準適合住宅
  | 'new-other' // 新築・その他の住宅
  | 'used'; // 中古住宅
