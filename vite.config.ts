import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/green/',
    plugins: [react()],
    server: {
        proxy: {
            '/green-api': {
                target: 'https://4100.api.green-api.com',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/green-api/, ''),
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq) => {
                        console.log('[proxy] →', proxyReq.getHeader('host') + proxyReq.path)
                    })
                    proxy.on('proxyRes', (proxyRes, req) => {
                        console.log('[proxy] ←', proxyRes.statusCode, req.url)
                    })
                },
            },
        },
    },
})