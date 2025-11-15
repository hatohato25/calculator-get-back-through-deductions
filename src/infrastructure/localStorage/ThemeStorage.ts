import type { Theme } from '../../application/stores/themeStore';

/**
 * localStorageを使ったテーマ設定の保存・読み込み
 */
export class ThemeStorage {
  private readonly STORAGE_KEY = 'deduction-calculator-theme';

  /**
   * テーマ設定を保存
   * @param theme テーマ設定
   */
  save(theme: Theme): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
      // localStorageの保存失敗は致命的エラーではないため、エラーをスローしない
    }
  }

  /**
   * テーマ設定を読み込み
   * @returns テーマ設定（存在しない場合や読み込みに失敗した場合はnull）
   */
  load(): Theme | null {
    try {
      const theme = localStorage.getItem(this.STORAGE_KEY);
      if (!theme) {
        return null;
      }

      // バリデーション: 有効なテーマ値かチェック
      if (theme === 'light' || theme === 'dark' || theme === 'system') {
        return theme as Theme;
      }

      return null;
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error);
      return null;
    }
  }

  /**
   * テーマ設定をクリア
   */
  clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear theme from localStorage:', error);
    }
  }
}
