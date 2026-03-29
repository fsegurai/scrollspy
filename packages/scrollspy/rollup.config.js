import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  // ESM - generates type declarations
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist/types',
      }),
    ],
  },

  // CommonJS - no declarations
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
      }),
    ],
  },

  // UMD - no declarations
  {
    input: 'src/index.ts',
    output: {
      name: 'Scrollspy',
      file: 'dist/index.umd.js',
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
      }),
    ],
  },
];
