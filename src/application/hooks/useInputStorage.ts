import { createEffect, on, onMount } from 'solid-js';
import { InputDataStorage } from '../../infrastructure/localStorage/InputDataStorage';
import { inputStore, resetInput, setInputStore } from '../stores/inputStore';

/**
 * 入力データ永続化フック
 *
 * - ページ読み込み時にlocalStorageから入力データを復元
 * - 入力値変更時に自動保存（デバウンス1000ms）
 * - データクリア機能を提供
 */
export function useInputStorage() {
  const storage = new InputDataStorage();

  /**
   * ページ読み込み時にデータ復元
   */
  onMount(() => {
    const savedData = storage.load();
    if (savedData) {
      setInputStore(savedData);
    }
  });

  /**
   * 入力値変更時に自動保存（デバウンス1000ms）
   *
   * デバウンス時間を1000msに設定している理由：
   * ユーザーが入力後すぐにリロードする場合でも、
   * 1秒待てば確実に保存が完了するようにするため。
   * 300msでは体感的に「ちょっと待った」つもりでも保存が完了していないケースが多かった。
   */
  let saveTimeout: number | undefined;
  createEffect(
    on(
      () => ({ ...inputStore }),
      (currentInput) => {
        // 既存のタイマーをクリア
        if (saveTimeout !== undefined) {
          clearTimeout(saveTimeout);
        }

        // 1000ms後に保存（ユーザーが入力後少し待てば確実に保存されるように）
        saveTimeout = window.setTimeout(() => {
          storage.save(currentInput);
        }, 1000);
      },
      { defer: true }
    )
  );

  /**
   * データを即座に保存
   *
   * フォーカスアウト時など、デバウンスを待たずに
   * 確実に保存したい場合に使用する。
   */
  function saveNow() {
    // 既存のデバウンスタイマーをクリア（重複保存を防ぐ）
    if (saveTimeout !== undefined) {
      clearTimeout(saveTimeout);
      saveTimeout = undefined;
    }

    // 即座に保存
    storage.save(inputStore);
  }

  /**
   * データをクリア（localStorageと状態の両方）
   */
  function clearData() {
    storage.clear();
    resetInput();
  }

  return {
    saveNow,
    clearData,
  };
}
