import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
    esbuild: {
        jsxFactory: 'jsx',
        jsxInject: "import { jsx } from '@emotion/react'",
    },
    plugins: [
        reactRefresh(),
    ],
    resolve: {
        alias: [
            { find: '@common', replacement: '/src/common' },
            { find: '@lib', replacement: '/src/lib' },
            { find: '@components', replacement: '/src/components' },
            { find: '@models', replacement: '/src/models' },
        ],
    },
    server: {
        port: Number(process.env.PORT || 4000),
    },
    build: {
        manifest: true,
        emptyOutDir: true,
    },
})
