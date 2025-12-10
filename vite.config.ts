import path from 'path';
import {defineConfig} from 'vite';
import pluginChecker from 'vite-plugin-checker';

export default defineConfig({
    base: process.env.VITE_BASE_URL || '/',
    plugins: [
        pluginChecker({
            typescript: {
                buildMode: true
            }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    optimizeDeps: {
        exclude: ['lucide-react'],
    },
});