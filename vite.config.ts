import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';


dotenv.config({ path: './frontend.env' });
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Rende la porta accessibile dall'esterno
    port: Number(process.env.PORT) || 3000,
    // Usa la porta fornita da Render, altrimenti 3000
    proxy: {
      '/invoices': 'http://localhost:8080',
    },
  },
});
