import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';


dotenv.config({ path: './frontend.env' });
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/invoices': 'http://localhost:8080',
    },
   
  },
})
