import Dexie, { type Table } from 'dexie';
import type { TaxData } from '../../domain/types';

/**
 * IndexedDBに保存する税制データのレコード
 */
export type TaxDataRecord = {
  /** バージョン（プライマリキー） */
  version: string;
  /** 最終更新日時 */
  lastUpdated: Date;
  /** 税制データ */
  data: TaxData;
};

/**
 * 税制データを保存するIndexedDB
 */
export class TaxDataDB extends Dexie {
  taxData!: Table<TaxDataRecord, string>;

  constructor() {
    super('TaxDataDB');

    // バージョン1: 初期スキーマ
    this.version(1).stores({
      taxData: 'version, lastUpdated',
    });
  }
}

/**
 * データベースのシングルトンインスタンス
 */
export const db = new TaxDataDB();
