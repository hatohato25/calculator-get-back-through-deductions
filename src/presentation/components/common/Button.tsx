import type { Component, JSX } from 'solid-js';

type ButtonProps = {
  /** ボタンのスタイルバリエーション */
  variant?: 'primary' | 'secondary' | 'danger';
  /** ボタンのサイズ */
  size?: 'sm' | 'md' | 'lg';
  /** 無効化フラグ */
  disabled?: boolean;
  /** クリックハンドラ */
  onClick?: () => void;
  /** ボタンのタイプ */
  type?: 'button' | 'submit' | 'reset';
  /** 子要素 */
  children: JSX.Element;
  /** 追加のCSSクラス */
  class?: string;
};

/**
 * 汎用ボタンコンポーネント
 */
export const Button: Component<ButtonProps> = (props) => {
  const baseClass =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 active:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:active:bg-gray-500',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600 dark:active:bg-red-700',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variant = props.variant || 'primary';
  const size = props.size || 'md';

  const buttonClass = `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${props.class || ''}`;

  return (
    <button
      type={props.type || 'button'}
      class={buttonClass}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
