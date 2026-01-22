import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      proxy: {
        '/api-backend': {
          
          target: env.BACKEND_URL || 'http://140.238.187.4:8000',
          changeOrigin: true,
          secure: false, 
          rewrite: (path) => path.replace(/^\/api-backend/, ''),
        },
      },
    },
  };
});