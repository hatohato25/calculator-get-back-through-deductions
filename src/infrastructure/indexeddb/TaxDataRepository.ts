import type { TaxData } from '../../domain/types';
import { type TaxDataRecord, db } from './schema';

/**
 * IndexedDBを使った税制データの永続化
 */
export class TaxDataRepository {
  /**
   * 税制データを保存
   * @param data 税制データ
   */
  async save(data: TaxData): Promise<void> {
    try {
      await db.taxData.put({
        version: data.version,
        lastUpdated: new Date(data.lastUpdated),
        data,
      });
    } catch (error) {
      console.error('Failed to save tax data to IndexedDB:', error);
      throw new Error('税制データの保存に失敗しました');
    }
  }

  /**
   * 税制データを取得
   * @param version バージョン（省略時は最新のデータを取得）
   * @returns 税制データ（存在しない場合はnull）
   */
  async get(version?: string): Promise<TaxData | null> {
    try {
      if (version) {
        const record = await db.taxData.get(version);
        return record?.data ?? null;
      }

      // バージョン指定がない場合は最新のデータを取得
      const records = await db.taxData.orderBy('lastUpdated').reverse().toArray();
      return records[0]?.data ?? null;
    } catch (error) {
      console.error('Failed to get tax data from IndexedDB:', error);
      return null;
    }
  }

  /**
   * データが1年以上古いかチェック
   * @param version バージョン（省略時は最新のデータをチェック）
   * @returns 1年以上古い場合はtrue
   */
  async isStale(version?: string): Promise<boolean> {
    try {
      let record: TaxDataRecord | undefined;
      if (version) {
        record = await db.taxData.get(version);
      } else {
        const records = await db.taxData.orderBy('lastUpdated').reverse().toArray();
        record = records[0];
      }

      if (!record) {
        return true; // データが存在しない場合は古いとみなす
      }

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      // IndexedDBから取得したDate型は数値として扱われる可能性があるため、明示的にDate型に変換
      const lastUpdated = new Date(record.lastUpdated);
      return lastUpdated.getTime() < oneYearAgo.getTime();
    } catch (error) {
      console.error('Failed to check if tax data is stale:', error);
      return true; // エラー時は古いとみなす
    }
  }

  /**
   * 全ての税制データを削除
   */
  async clear(): Promise<void> {
    try {
      await db.taxData.clear();
    } catch (error) {
      console.error('Failed to clear tax data:', error);
      throw new Error('税制データのクリアに失敗しました');
    }
  }

  /**
   * 特定バージョンの税制データを削除
   * @param version バージョン
   */
  async delete(version: string): Promise<void> {
    try {
      await db.taxData.delete(version);
    } catch (error) {
      console.error(`Failed to delete tax data (version: ${version}):`, error);
      throw new Error('税制データの削除に失敗しました');
    }
  }
}
