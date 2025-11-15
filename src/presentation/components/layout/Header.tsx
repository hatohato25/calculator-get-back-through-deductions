import type { Component } from 'solid-js';
import type { Theme } from '../../../application/stores/themeStore';
import { ThemeToggleButton } from '../common/ThemeToggleButton';

type HeaderProps = {
  /** データクリアハンドラ */
  onClearData?: () => void;
  /** 現在のテーマ */
  theme?: Theme;
  /** 実際に適用されているテーマ */
  resolvedTheme?: 'light' | 'dark';
  /** テーマ変更ハンドラ */
  onThemeChange?: (theme: Theme) => void;
};

/**
 * ヘッダーコンポーネント
 *
 * ロゴ、タイトル、テーマ切り替えボタン、データクリアボタンを表示
 */
export const Header: Component<HeaderProps> = (props) => {
  return (
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          {/* ロゴとタイトル */}
          <div class="flex items-center">
            <div class="flex items-center justify-center w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg mr-3">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                控除還付金計算サイト
              </h1>
              <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                サラリーマン向け税金シミュレーター
              </p>
            </div>
          </div>

          {/* 右側のボタン群 */}
          <div class="flex items-center gap-4">
            {/* テーマ切り替えボタン */}
            {props.theme && props.resolvedTheme && props.onThemeChange && (
              <ThemeToggleButton
                theme={props.theme}
                resolvedTheme={props.resolvedTheme}
                onThemeChange={props.onThemeChange}
              />
            )}

            {/* データクリアボタン */}
            {props.onClearData && (
              <button
                type="button"
                onClick={props.onClearData}
                class="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="データクリア"
                title="データクリア"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span class="hidden sm:inline text-sm font-medium">データクリア</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
