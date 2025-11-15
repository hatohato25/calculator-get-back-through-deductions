import type { Component } from 'solid-js';

type InputProps = {
  /** ラベル */
  label: string;
  /** 入力タイプ */
  type?: 'text' | 'number';
  /** 値 */
  value: number | string | undefined;
  /** 変更ハンドラ */
  onChange: (value: number | string) => void;
  /** フォーカスアウトハンドラ */
  onBlur?: () => void;
  /** プレースホルダー */
  placeholder?: string;
  /** 最小値（type="number"の場合） */
  min?: number;
  /** 最大値（type="number"の場合） */
  max?: number;
  /** ステップ（type="number"の場合） */
  step?: number;
  /** エラーメッセージ */
  error?: string;
  /** ヘルプテキスト */
  helpText?: string;
  /** 必須フラグ */
  required?: boolean;
  /** 無効化フラグ */
  disabled?: boolean;
  /** 単位表示（円、%など） */
  unit?: string;
};

/**
 * 汎用入力フィールドコンポーネント
 *
 * ラベル、バリデーション表示、ヘルプテキストを含む
 */
export const Input: Component<InputProps> = (props) => {
  // labelとinputを関連付けるためのID生成
  const inputId = `input-${Math.random().toString(36).slice(2, 11)}`;

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = props.type === 'number' ? Number.parseFloat(target.value) : target.value;
    props.onChange(value);
  };

  return (
    <div class="mb-4">
      {/* ラベル */}
      <label for={inputId} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {props.label}
        {props.required && <span class="text-red-500 dark:text-red-400 ml-1">*</span>}
      </label>

      {/* 入力フィールド */}
      <div class="relative">
        <input
          id={inputId}
          type={props.type || 'text'}
          value={props.value ?? ''}
          onInput={handleInput}
          onBlur={() => props.onBlur?.()}
          placeholder={props.placeholder}
          min={props.min}
          max={props.max}
          step={props.step}
          disabled={props.disabled}
          class={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            props.error
              ? 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400'
          } ${props.disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} ${props.unit ? 'pr-12' : ''} dark:text-gray-100 dark:placeholder-gray-400`}
        />
        {/* 単位表示 */}
        {props.unit && (
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
            {props.unit}
          </span>
        )}
      </div>

      {/* ヘルプテキスト */}
      {props.helpText && !props.error && (
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{props.helpText}</p>
      )}

      {/* エラーメッセージ */}
      {props.error && (
        <p class="mt-1 text-sm text-red-600 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          {props.error}
        </p>
      )}
    </div>
  );
};
