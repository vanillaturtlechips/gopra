FROM golang:1.25-alpine AS builder

WORKDIR /app

# 2. 의존성 설치
COPY go.mod go.sum ./
RUN go mod download

# 3. 소스 코드 복사 및 빌드
# (api/ 폴더는 Vercel 전용이므로, main.go 빌드에는 필요 없습니다)
COPY main.go .
COPY go.mod . 
COPY go.sum .
# main.go 파일만 빌드합니다.
RUN go build -o /gopra-server ./main.go

# 4. 실행 스테이지
FROM alpine:latest

# SSL/TLS 인증서
RUN apk add --no-cache ca-certificates

# 빌드된 서버 바이너리만 복사
COPY --from=builder /gopra-server /gopra-server

# 8080 포트 노출
EXPOSE 8080

# 서버 실행
CMD ["/gopra-server"]
