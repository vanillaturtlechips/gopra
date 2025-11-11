# 1단계: 빌드 스테이지 (node 20 사용)
FROM node:20-alpine AS builder

WORKDIR /app

# ⬇️ 1. 빌드 시 사용할 인자(ARG) 선언
ARG POSTGRES_URL
ARG GIT_REPO_OWNER
ARG GIT_REPO_SLUG
ARG CONTENT_ROOT_PATH

# ⬇️ 2. ARG를 환경변수(ENV)로 설정 (RUN 스크립트가 읽을 수 있도록)
ENV POSTGRES_URL=${POSTGRES_URL}
ENV GIT_REPO_OWNER=${GIT_REPO_OWNER}
ENV GIT_REPO_SLUG=${GIT_REPO_SLUG}
ENV CONTENT_ROOT_PATH=${CONTENT_ROOT_PATH}

# 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 프로덕션 빌드 실행 (npm run build)
# 이제 이 스크립트가 위 ENV 변수들을 정상적으로 읽습니다.
RUN npm run build

# 2단계: 서빙 스테이지 (가벼운 Nginx 사용)
FROM nginx:alpine

# 빌드 결과물(dist)을 Nginx의 기본 html 폴더로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# ⬇️ Nginx 설정 파일 복사 (로컬 저장소 /uploads 경로 서빙 포함)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx의 기본 포트 80 노출
EXPOSE 80
