import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
      include: [
        'src/lib/p2p-crypto.ts',
        'src/lib/web3-transaction-simulator.ts',
        'src/components/tutorials/tutorialConfig.tsx',
        'src/components/tutorials/TutorialWalkthrough.tsx',
        'src/contexts/TutorialContext.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
