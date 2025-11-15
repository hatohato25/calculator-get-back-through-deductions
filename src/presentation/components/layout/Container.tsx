import type { Component, JSX } from 'solid-js';

type ContainerProps = {
  /** 子要素 */
  children: JSX.Element;
  /** 追加のCSSクラス */
  class?: string;
};

/**
 * メインコンテナコンポーネント
 *
 * レスポンシブな最大幅とパディングを提供
 */
export const Container: Component<ContainerProps> = (props) => {
  return <div class={`container mx-auto px-4 py-8 ${props.class || ''}`}>{props.children}</div>;
};
