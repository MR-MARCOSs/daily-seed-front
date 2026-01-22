import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },

    server: {
      proxy: {
        '/api-backend': {
          
          target: env.BACKEND_URL,
          changeOrigin: true,
          secure: false, 
          rewrite: (path) => path.replace(/^\/api-backend/, ''),
        },
      },
    },
  };
});