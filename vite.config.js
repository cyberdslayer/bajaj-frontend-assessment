import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";


// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     '/bfhl': {
  //       target: 'https://bajaj-backend-c2r3.vercel.app',
  //       changeOrigin: true,
  //       secure: false, // Disable if the target server has self-signed certificates
  //     },
  //   },
  // },
  plugins: [react()],
  css:{
    postcss:{
      plugins:[tailwindcss()],
    }
  }
})
