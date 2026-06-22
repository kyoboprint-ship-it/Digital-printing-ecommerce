// 표준 TanStack Router SPA 설정 (서버 기동용)
// @lovable.dev/vite-tanstack-config 대체 — SSR 제거, SPA 모드
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    port: 5175,
    strictPort: false,
    proxy: { '/api': 'http://localhost:7100' },
  },
});
