import { type Component, createSignal } from 'solid-js';

type HelpTooltipProps = {
  /** ツールチップの内容 */
  content: string;
};

/**
 * ヘルプツールチップコンポーネント
 *
 * 「?」アイコンにホバー/タップで説明を表示
 */
export const HelpTooltip: Component<HelpTooltipProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);

  return (
    <div class="relative inline-block ml-2">
      {/* ヘルプアイコン */}
      <button
        type="button"
        class="inline-flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-full transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-label="ヘルプ"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      {/* ツールチップ */}
      {isVisible() && (
        <div
          class="absolute z-10 w-64 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg -top-2 left-full ml-2 transform -translate-y-1/2"
          role="tooltip"
        >
          {props.content}
          {/* 矢印 */}
          <div class="absolute top-1/2 right-full -translate-y-1/2 border-8 border-transparent border-r-gray-900 dark:border-r-gray-700" />
        </div>
      )}
    </div>
  );
};
