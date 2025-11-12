#!/bin/bash

set -e

echo "🚀 1/5: 최신 Git 커밋 해시로 IMAGE_TAG 설정..."
NEW_TAG=$(git rev-parse --short HEAD)
sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=${NEW_TAG}/" .env
echo "✅ 새 배포 태그: ${NEW_TAG}"

echo "🐳 2/5: 새 태그로 Docker 이미지 빌드..."
docker-compose build backend frontend

echo "🛰️ 3/5: 새 버전의 컨테이너 실행..."
docker-compose up -d --no-deps backend frontend

echo "🔄 4/5: 데이터베이스 동기화 실행 (sync.mjs)..."
docker-compose run --rm syncer sh -c "npm install && npm run sync"

echo "🧹 5/5: 태그 없는 이전 이미지들 정리..."
docker image prune -f

echo "🎉 배포 완료! (gopra v${NEW_TAG})"
