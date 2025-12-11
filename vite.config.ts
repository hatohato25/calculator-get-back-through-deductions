import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

// https://vite.dev/config/
export default defineConfig({
  // Vercel環境ではルートパス、GitHub Pagesではサブパスを使用
  base: process.env.VERCEL ? '/' :
        process.env.NODE_ENV === 'production' ? '/calculator-get-back-through-deductions/' : '/',
  plugins: [solid()],
  build: {
    target: 'esnext',
    // コード分割の最適化
    rollupOptions: {
      output: {
        manualChunks: {
          solid: ['solid-js'],
          dexie: ['dexie'],
        },
      },
    },
  },
});
