import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config({ path: './frontend.env' });

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000, // Assicurati che questa porta non sia occupata
    proxy: {
      '/invoices': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    }
   
  },
});
