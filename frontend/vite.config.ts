import { defineConfig, loadEnv } from 'vite' // loadEnv import
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({ ... }) 를 아래와 같이 수정
export default defineConfig(({ mode }) => {
  // 현재 모드(development/production)에 맞는 환경 변수를 로드합니다.
  // Docker Compose에서 VITE_API_URL=http://backend:8080 를 주입합니다.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Docker에서 실행 시 env.VITE_API_URL을 사용, 아니면 기존 localhost를 사용
  const proxyTarget = env.VITE_API_URL || 'http://localhost:8080';
  
  console.log(`[Vite Config] Proxy Target: ${proxyTarget}`);

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      host: '0.0.0.0', // ⬅️ 중요: 컨테이너 외부에서 접속 가능하게 함
      port: 5173,
      proxy: {
        '/api': {
          target: proxyTarget, // ⬅️ 환경 변수로 설정된 타겟 사용
          changeOrigin: true,
        }
      }
    }
  }
})
