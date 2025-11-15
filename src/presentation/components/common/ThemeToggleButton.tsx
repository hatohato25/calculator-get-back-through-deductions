import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import type { Theme } from '../../../application/stores/themeStore';

type ThemeToggleButtonProps = {
  /** 現在のテーマ */
  theme: Theme;
  /** 実際に適用されているテーマ */
  resolvedTheme: 'light' | 'dark';
  /** テーマ変更ハンドラ */
  onThemeChange: (theme: Theme) => void;
};

/**
 * テーマ切り替えボタン
 *
 * ライト/ダークモードを切り替える
 */
export const ThemeToggleButton: Component<ThemeToggleButtonProps> = (props) => {
  /**
   * テーマを循環的に切り替え
   * light → dark → system → light
   */
  const toggleTheme = () => {
    const nextTheme: Theme =
      props.theme === 'light' ? 'dark' : props.theme === 'dark' ? 'system' : 'light';
    props.onThemeChange(nextTheme);
  };

  /**
   * 表示するアイコンを決定
   * systemの場合は実際に適用されているテーマに応じたアイコンを表示
   */
  const getIcon = () => {
    const isSystem = props.theme === 'system';
    const isDark = props.resolvedTheme === 'dark';

    if (isSystem) {
      // systemモードの場合は、現在の適用テーマに応じたアイコン + 小さいPCアイコン
      return isDark ? 'moon-system' : 'sun-system';
    }

    return isDark ? 'moon' : 'sun';
  };

  const getAriaLabel = () => {
    const themeLabels = {
      light: 'ライトモード',
      dark: 'ダークモード',
      system: 'システム設定',
    };
    return `テーマ切り替え（現在: ${themeLabels[props.theme]}）`;
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      aria-label={getAriaLabel()}
      title={getAriaLabel()}
    >
      <Show when={getIcon() === 'sun'}>
        {/* 太陽アイコン（ライトモード） */}
        <svg
          class="w-5 h-5 text-gray-900 dark:text-gray-100 transition-transform hover:rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </Show>

      <Show when={getIcon() === 'moon'}>
        {/* 月アイコン（ダークモード） */}
        <svg
          class="w-5 h-5 text-gray-900 dark:text-gray-100 transition-transform hover:rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </Show>

      <Show when={getIcon() === 'sun-system' || getIcon() === 'moon-system'}>
        {/* モニターアイコン（システム設定） */}
        <svg
          class="w-5 h-5 text-gray-900 dark:text-gray-100 transition-transform hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </Show>
    </button>
  );
};
