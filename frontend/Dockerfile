FROM node:20-alpine

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# Vite 개발 서버 포트 노출
EXPOSE 5173

# Vite 개발 서버 실행
# --host 0.0.0.0 옵션이 있어야 컨테이너 외부에서 접속 가능
CMD ["npm", "run", "dev"]