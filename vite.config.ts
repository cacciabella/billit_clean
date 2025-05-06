import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config({ path: './frontend.env' })

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
    allowedHosts: ['billit-clean.onrender.com'],
    proxy: {
      '/invoices': {
        target: 'https://billit-clean.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
