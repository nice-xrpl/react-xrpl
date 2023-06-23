import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tsconfigPaths(),
        nodePolyfills(),
        dts({
            include: ['src/'],
        }),
        react(),
    ],
    define: {
        'process.env': {},
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis',
            },
            plugins: [],
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/react-xrpl/index.ts'),
            name: 'ReactXRPL',
            formats: ['es', 'umd'],
            fileName: 'index',
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                },
            },
            plugins: [],
        },
    },
    resolve: {
        alias: {
            events: 'events',
            crypto: 'crypto-browserify',
            stream: 'stream-browserify',
            http: 'stream-http',
            https: 'https-browserify',
            ws: 'xrpl/dist/npm/client/WSWrapper',
        },
    },
});
