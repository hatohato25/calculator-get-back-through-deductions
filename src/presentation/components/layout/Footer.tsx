import type { Component } from 'solid-js';

/**
 * フッターコンポーネント
 *
 * 免責事項、著作権情報を表示
 */
export const Footer: Component = () => {
  return (
    <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div class="container mx-auto px-4 py-6">
        {/* 免責事項 */}
        <div class="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <h3 class="text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
            ⚠️ 免責事項
          </h3>
          <p class="text-xs text-yellow-700 dark:text-yellow-300 leading-relaxed">
            本サイトの計算結果はあくまで概算であり、実際の税額や還付金額を保証するものではありません。
            正確な税額は個々の状況により異なるため、詳細は税務署や税理士にご相談ください。
            本サイトの利用により生じたいかなる損害についても、開発者は責任を負いかねます。
          </p>
        </div>

        {/* 著作権とリンク */}
        <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <p class="mb-2 md:mb-0">© 2025 控除還付金計算サイト. All rights reserved.</p>
          <div class="flex space-x-4">
            <a
              href="https://www.nta.go.jp/"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              国税庁ホームページ
            </a>
            <a
              href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/shotoku.htm"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              所得税について
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
