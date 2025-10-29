import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // ⬅️ Tailwind v4 플러그인

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ⬅️ Tailwind v4 플러그인
  ],
  server: {
    proxy: {
      // '/api'로 시작하는 요청을 Go 백엔드(localhost:8080)로 보냅니다.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // '/api/posts' -> '/api/posts' (경로 수정 없음)
        // rewrite: (path) => path.replace(/^\/api/, ''), // ⬅️ main.go 경로를 /api/posts로 바꿨으므로 이 줄은 필요 없습니다!
      }
    }
  }
})