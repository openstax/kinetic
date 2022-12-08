import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { resolve } from 'path'
import visualizer from 'rollup-plugin-visualizer'

const input = {}
const base = process.env.ASSETS_URL || 'https://kinetic-app-assets.s3.amazonaws.com/'

if (process.env.BUILD_PAGE) {
    input[process.env.BUILD_PAGE] = resolve(__dirname, `homepages/${process.env.BUILD_PAGE}/index.html`)
} else {
    input['main'] = resolve(__dirname, 'index.html')
}

// https://vitejs.dev/config/
export default defineConfig({
    esbuild: {
        jsxFactory: 'jsx',
        jsxInject: "import { jsx } from '@emotion/react'",
    },
    base,
    plugins: [
        reactRefresh(),
    ],
    resolve: {
        alias: [
            { find: '@common', replacement: '/src/common' },
            { find: '@lib', replacement: '/src/lib' },
            { find: '@components', replacement: '/src/components' },
            { find: '@models', replacement: '/src/models' },
            { find: '@api', replacement: '/src/api/index' },
        ],
    },
    server: {
        port: Number(process.env.PORT || 4000),
    },
    build: {
        manifest: true,
        rollupOptions: {
            input,
            plugins: [
                    visualizer({
                        filename: resolve(__dirname, 'dist/stats.html'),
                        template: 'treemap', // sunburst|treemap|network
                        sourcemap: false,
                    }),

            ],
        },

    },
})
