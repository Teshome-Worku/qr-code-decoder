import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [
                    ['babel-plugin-react-compiler']
                ],
            },
        }),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: "QR Code Decoder App",
                short_name: "QRDecoder",
                description: "Scan QR codes using camera or image files",
                start_url: "/",
                display: "standalone",
                background_color: "#f0f4f8",
                theme_color: "#4f46e5",
                icons: [{
                        src: "/icons/icon-192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "/icons/icon-512.png",
                        sizes: "512x512",
                        type: "image/png"
                    }
                ]
            },
            workbox: {
                // Cache all built assets
                globPatterns: ['**/*.{js,css,html,png,svg}'],
            }
        })
    ]
})