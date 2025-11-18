import type { DeductionInput } from '../../domain/types';

/**
 * localStorageを使った入力データの保存・読み込み
 */
export class InputDataStorage {
  private readonly STORAGE_KEY = 'deduction-calculator-input';

  /**
   * 入力データを保存
   * @param input 入力データ
   */
  save(input: DeductionInput): void {
    try {
      const json = JSON.stringify(input);
      localStorage.setItem(this.STORAGE_KEY, json);
    } catch (error) {
      console.error('Failed to save input data to localStorage:', error);
      // localStorageの保存失敗は致命的エラーではないため、エラーをスローしない
    }
  }

  /**
   * 入力データを読み込み
   * @returns 入力データ（存在しない場合や読み込みに失敗した場合はnull）
   */
  load(): DeductionInput | null {
    try {
      const json = localStorage.getItem(this.STORAGE_KEY);
      if (!json) {
        return null;
      }

      const data = JSON.parse(json);
      // 最低限のバリデーション（salaryフィールドが存在するか）
      if (typeof data === 'object' && data !== null && 'salary' in data) {
        return data as DeductionInput;
      }

      return null;
    } catch (error) {
      console.error('Failed to load input data from localStorage:', error);
      return null;
    }
  }

  /**
   * 入力データをクリア
   */
  clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear input data from localStorage:', error);
    }
  }

  /**
   * 保存されているデータが存在するかチェック
   * @returns データが存在する場合はtrue
   */
  hasData(): boolean {
    try {
      return localStorage.getItem(this.STORAGE_KEY) !== null;
    } catch (error) {
      console.error('Failed to check if input data exists:', error);
      return false;
    }
  }
}
