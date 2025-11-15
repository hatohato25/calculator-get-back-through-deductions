import { createEffect, onCleanup, onMount } from 'solid-js';
import { ThemeStorage } from '../../infrastructure/localStorage/ThemeStorage';
import {
  type Theme,
  setResolvedTheme,
  setTheme as setThemeStore,
  themeStore,
} from '../stores/themeStore';

/**
 * テーマ管理フック
 *
 * テーマの初期化、切り替え、永続化を管理する
 */
export function useTheme() {
  const storage = new ThemeStorage();

  /**
   * システムテーマ（prefers-color-scheme）を取得
   */
  function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * テーマを実際に適用（html要素のclassを更新）
   */
  function applyTheme(theme: 'light' | 'dark') {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    setResolvedTheme(theme);
  }

  /**
   * テーマを解決して適用
   * systemの場合はOSの設定を反映
   */
  function resolveAndApplyTheme(theme: Theme) {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    applyTheme(resolved);
  }

  /**
   * テーマを変更
   */
  function setTheme(theme: Theme) {
    setThemeStore(theme);
    storage.save(theme);
    resolveAndApplyTheme(theme);
  }

  /**
   * テーマを初期化
   * localStorageから読み込み、なければシステムテーマを使用
   */
  onMount(() => {
    const savedTheme = storage.load();
    const initialTheme: Theme = savedTheme || 'system';

    setThemeStore(initialTheme);
    resolveAndApplyTheme(initialTheme);

    // システムテーマの変更を監視（theme='system'の場合のみ反映）
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeStore.theme === 'system') {
        resolveAndApplyTheme('system');
      }
    };

    // モダンブラウザ向け
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      onCleanup(() => {
        mediaQuery.removeEventListener('change', handleChange);
      });
    } else {
      // レガシーブラウザ対応
      mediaQuery.addListener(handleChange);
      onCleanup(() => {
        mediaQuery.removeListener(handleChange);
      });
    }
  });

  // themeが変更されたら適用（ストアの変更を監視）
  createEffect(() => {
    resolveAndApplyTheme(themeStore.theme);
  });

  return {
    theme: () => themeStore.theme,
    resolvedTheme: () => themeStore.resolvedTheme,
    setTheme,
  };
}
