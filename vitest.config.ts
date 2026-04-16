import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.')
    }
  },
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.ts']
  }
});
