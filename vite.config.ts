import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: 'demo',
    base: './',
    envDir: '..',
    server: {
      port: 5173,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      target: 'es2022',
      sourcemap: env['NODE_ENV'] !== 'production',
      minify: 'terser',
      rollupOptions: {
        input: {
          main: 'demo/index.html',
          playground: 'demo/playground.html',
          changelog: 'demo/changelog.html',
        },
        output: {
          // Isolate the local extension styles into their own chunk so Vite emits a
          // dedicated, predictable stylesheet (assets/extensions-<hash>.css) instead
          // of merging them into the shared markdown chunk.
          manualChunks(id) {
            if (id.includes('/demo/scripts/utils/extension-styles')) return 'extensions';
            return undefined;
          },
        },
      },
    },
  };
});
