import type { Component } from 'solid-js';
import { For } from 'solid-js';

type SelectOption = {
  value: string | number;
  label: string;
};

type SelectProps = {
  /** ラベル */
  label: string;
  /** 選択肢 */
  options: SelectOption[];
  /** 現在の値 */
  value: string | number | undefined;
  /** 変更ハンドラ */
  onChange: (value: string | number) => void;
  /** フォーカスアウトハンドラ */
  onBlur?: () => void;
  /** エラーメッセージ */
  error?: string;
  /** ヘルプテキスト */
  helpText?: string;
  /** 必須フラグ */
  required?: boolean;
  /** 無効化フラグ */
  disabled?: boolean;
  /** プレースホルダー */
  placeholder?: string;
};

/**
 * 汎用セレクトボックスコンポーネント
 */
export const Select: Component<SelectProps> = (props) => {
  // labelとselectを関連付けるためのID生成
  const selectId = `select-${Math.random().toString(36).slice(2, 11)}`;

  const handleChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    props.onChange(target.value);
  };

  return (
    <div class="mb-4">
      {/* ラベル */}
      <label for={selectId} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {props.label}
        {props.required && <span class="text-red-500 dark:text-red-400 ml-1">*</span>}
      </label>

      {/* セレクトボックス */}
      <select
        id={selectId}
        value={props.value ?? ''}
        onChange={handleChange}
        onBlur={() => props.onBlur?.()}
        disabled={props.disabled}
        class={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
          props.error
            ? 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400'
            : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400'
        } ${props.disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:text-gray-100`}
      >
        {props.placeholder && (
          <option value="" disabled>
            {props.placeholder}
          </option>
        )}
        <For each={props.options}>
          {(option) => <option value={option.value}>{option.label}</option>}
        </For>
      </select>

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
