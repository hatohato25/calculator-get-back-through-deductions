import type { Component, JSX } from 'solid-js';

type CardProps = {
  /** タイトル */
  title?: string;
  /** 子要素 */
  children: JSX.Element;
  /** 追加のCSSクラス */
  class?: string;
};

/**
 * カードコンテナコンポーネント
 *
 * セクションをグループ化し、視覚的な境界を提供
 */
export const Card: Component<CardProps> = (props) => {
  return (
    <div
      class={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${props.class || ''}`}
    >
      {props.title && (
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{props.title}</h2>
        </div>
      )}
      <div class="px-6 py-4">{props.children}</div>
    </div>
  );
};
