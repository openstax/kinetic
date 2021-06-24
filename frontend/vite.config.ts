import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
    esbuild: {
        jsxFactory: "jsx",
        jsxInject: "import { jsx } from '@emotion/react'",
    },
    plugins: [reactRefresh()],
    server: {
        port: Number(process.env.PORT || 4000),
    },
    build: {
        manifest: true,
        emptyOutDir: true,
        rollupOptions: {
            input: [
                'src/main.tsx',
            ],
        }
    }
})
