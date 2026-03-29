import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    injectStyle: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    minify: true,
    treeshake: true,
    external: ['react', 'react-dom'],
    esbuildOptions(options) {
        options.loader = {
            ...options.loader,
            '.css': 'local-css',
        }
    }
});
