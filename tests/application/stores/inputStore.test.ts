/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it } from 'vitest';
import {
  inputStore,
  resetInput,
  saveInputNow,
  setInputStore,
  setSalary,
} from '../../../src/application/stores/inputStore';

describe('inputStore', () => {
  // localStorageのモック
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    // 各テスト前にlocalStorageをクリア
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    localStorageMock.clear();
    resetInput();
  });

  describe('saveInputNow', () => {
    it('現在の入力状態を即座にlocalStorageに保存する', () => {
      // Arrange
      const testSalary = 6000000;
      setSalary(testSalary);

      // Act
      saveInputNow();

      // Assert
      const saved = localStorage.getItem('deduction-calculator-input');
      expect(saved).not.toBeNull();

      if (!saved) throw new Error('localStorage保存失敗');
      const parsed = JSON.parse(saved);
      expect(parsed.salary).toBe(testSalary);
    });

    it('複数の入力値を保存できる', () => {
      // Arrange
      setSalary(7000000);
      setInputStore('ideco', { annualPayment: 276000 });

      // Act
      saveInputNow();

      // Assert
      const saved = localStorage.getItem('deduction-calculator-input');
      expect(saved).not.toBeNull();

      if (!saved) throw new Error('localStorage保存失敗');
      const parsed = JSON.parse(saved);
      expect(parsed.salary).toBe(7000000);
      expect(parsed.ideco?.annualPayment).toBe(276000);
    });

    it('保存時にエラーが発生してもクラッシュしない', () => {
      // Arrange
      // localStorageが使用できない状況をシミュレート
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        throw new Error('localStorage is not available');
      };

      // Act & Assert
      expect(() => saveInputNow()).not.toThrow();

      // Cleanup
      localStorage.setItem = originalSetItem;
    });
  });

  describe('resetInput', () => {
    it('入力状態を初期状態にリセットする', () => {
      // Arrange
      setSalary(8000000);
      setInputStore('ideco', { annualPayment: 276000 });

      // Act
      resetInput();

      // Assert
      expect(inputStore.salary).toBe(5000000); // デフォルト値
      expect(inputStore.ideco).toBeUndefined();
    });
  });
});
