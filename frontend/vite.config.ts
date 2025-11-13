import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_API_URL || 'http://159.223.38.10:8080';
  
  console.log(`[Vite Config] Proxy Target: ${proxyTarget}`);

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    // 1. assetsInclude 추가
    assetsInclude: ['**/*.glb'],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        }
      }
    }
  }
})