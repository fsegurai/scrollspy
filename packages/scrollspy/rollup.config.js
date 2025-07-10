import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'scrollspy',
      file: 'dist/index.umd.js',
      format: 'umd',
    },
    plugins: [nodeResolve()],
    external: (id) => id.includes('spec/') || id.includes('.test'),
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    plugins: [nodeResolve()],
    external: (id) => id.includes('spec/') || id.includes('.test'),
  },
];
