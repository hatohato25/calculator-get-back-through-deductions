import type { Component } from 'solid-js';
import { useInputStorage } from './application/hooks/useInputStorage';
import { useTaxData } from './application/hooks/useTaxData';
import { useTheme } from './application/hooks/useTheme';
import { Container } from './presentation/components/layout/Container';
import { Footer } from './presentation/components/layout/Footer';
import { Header } from './presentation/components/layout/Header';
import { CalculatorPage } from './presentation/pages/CalculatorPage';

const App: Component = () => {
  // 入力データの永続化を初期化
  const storage = useInputStorage();

  // 税制データを初期化
  const taxData = useTaxData();

  // テーマ管理を初期化
  const theme = useTheme();

  const handleClearData = () => {
    if (window.confirm('入力データをすべてクリアしますか？\nこの操作は取り消せません。')) {
      storage.clearData();
    }
  };

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* ヘッダー */}
      <Header
        onClearData={handleClearData}
        theme={theme.theme()}
        resolvedTheme={theme.resolvedTheme()}
        onThemeChange={theme.setTheme}
      />

      {/* メインコンテンツ */}
      <main class="flex-1">
        <Container>
          {/* 税制データロード中の表示 */}
          {taxData.isLoading() && (
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
              <p class="text-sm text-blue-800 dark:text-blue-300">
                税制データを読み込んでいます...
              </p>
            </div>
          )}

          {/* 税制データエラー表示 */}
          {taxData.error() && (
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
              <p class="text-sm text-red-800 dark:text-red-300">エラー: {taxData.error()}</p>
            </div>
          )}

          {/* 計算ページ */}
          <CalculatorPage />
        </Container>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default App;
