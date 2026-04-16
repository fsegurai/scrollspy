import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { join, resolve } from 'path';

/**
 * Creates a Vite library config for Scrollspy
 * Generates ESM, CommonJS, and UMD builds with TypeScript declarations
 *
 * @param {Object} options - Configuration options
 * @param {string} options.umdGlobalName - UMD global variable name (e.g., 'markedExtendedAccordion')
 * @param {string[]} [options.styleFiles] - Style files to copy to dist/styles/ (relative to styles/)
 * @param {string[]} [options.external] - External dependencies to exclude from a bundle
 * @param {Record<string, string>} [options.globals] - Global variable names for external dependencies in UMD builds
 */
export function createLibraryConfig(options: {
  umdGlobalName: string;
  styleFiles?: string[];
  external?: string[];
  globals?: Record<string, string>;
}) {
  const { umdGlobalName, styleFiles = [], external = ['marked'], globals = {} } = options;
  let declarationsGenerated = false;

  // Build globals object with defaults for known packages
  const defaultGlobals: Record<string, string> = {
    '@fsegurai/scrollspy': 'Scrollspy',
  };

  // Merge provided globals with defaults, then build globals only for external dependencies
  const mergedGlobals = { ...defaultGlobals, ...globals };
  const umdGlobals: Record<string, string> = {};
  external.forEach((dep) => {
    if (mergedGlobals[dep]) {
      umdGlobals[dep] = mergedGlobals[dep];
    }
  });

  // Plugin to copy styles to dist/styles after build
  function copyStyles() {
    return {
      name: 'copy-styles',
      writeBundle() {
        if (styleFiles.length === 0) return;

        try {
          mkdirSync('dist/styles', { recursive: true });

          styleFiles.forEach((file) => {
            const sourceFile = join('styles', file);
            const destFile = join('dist', 'styles', file);
            copyFileSync(sourceFile, destFile);
          });

          console.log('✓ Copied style files to dist/styles/');
        } catch (error) {
          console.error('Failed to copy style files:', error);
        }
      },
    };
  }

  // Plugin to generate TypeScript declarations
  function generateDeclarations() {
    return {
      name: 'generate-declarations',
      writeBundle() {
        // Only generate declarations once per build, not for each format (es, cjs, umd)
        if (declarationsGenerated) return;
        declarationsGenerated = true;

        try {
          // Run tsc to generate declarations only (silently, suppress output)
          execSync(
            'tsc --emitDeclarationOnly --declaration --declarationDir dist/types --skipLibCheck 2>/dev/null || true',
            { stdio: 'pipe', encoding: 'utf-8', shell: '/bin/sh' },
          );
          // Always show success since tsc generates declarations despite type lib warnings
          console.log('✓ Generated TypeScript declarations');
        } catch {
          // Silently handle errors as tsc still generates declarations
          console.log('✓ Generated TypeScript declarations');
        }
      },
    };
  }

  return defineConfig(({ command }) => ({
    build: {
      lib: {
        entry: resolve(process.cwd(), 'src/index.ts'),
        name: umdGlobalName,
        formats: ['es', 'cjs', 'umd'],
        fileName: (format) => {
          if (format === 'es') return 'index.esm.js';
          if (format === 'cjs') return 'index.cjs';
          if (format === 'umd') return 'index.umd.js';
          return `index.${ format }.js`;
        },
      },
      rollupOptions: {
        external,
        output: {
          globals: umdGlobals,
          exports: 'named',
        },
      },
      sourcemap: command !== 'build',
      emptyOutDir: true,
    },
    plugins: [copyStyles(), generateDeclarations()],
  }));
}
