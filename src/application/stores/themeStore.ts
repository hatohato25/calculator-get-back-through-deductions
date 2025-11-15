import { createStore } from 'solid-js/store';

/**
 * テーマの種類
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * テーマ状態
 */
type ThemeState = {
  /** ユーザーが選択したテーマ設定 */
  theme: Theme;
  /** 実際に適用されているテーマ（systemの場合はOSの設定を反映） */
  resolvedTheme: 'light' | 'dark';
};

/**
 * テーマストアの初期状態
 */
const initialState: ThemeState = {
  theme: 'system',
  resolvedTheme: 'light',
};

/**
 * グローバルテーマストア
 */
export const [themeStore, setThemeStore] = createStore<ThemeState>(initialState);

/**
 * テーマを設定
 * @param theme 設定するテーマ
 */
export function setTheme(theme: Theme) {
  setThemeStore('theme', theme);
}

/**
 * 実際に適用されるテーマを設定
 * @param resolvedTheme 適用するテーマ
 */
export function setResolvedTheme(resolvedTheme: 'light' | 'dark') {
  setThemeStore('resolvedTheme', resolvedTheme);
}
