import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    root: 'src',
    plugins: [react()],
    base: '/demos-and-deviations/',
    build: {
        outDir: '../dist'
    }
});
