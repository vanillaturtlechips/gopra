package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type UploadResponse struct {
	URL string `json:"url"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	// CORS 헤더
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	// 1. 파일 파싱
	err := r.ParseMultipartForm(10 << 20) // 10MB 최대
	if err != nil {
		http.Error(w, "Failed to parse multipart form: "+err.Error(), http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Failed to get file: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// 2. 파일 내용 읽기
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Failed to read file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 3. Vercel Blob API 토큰 확인
	token := os.Getenv("BLOB_READ_WRITE_TOKEN")
	if token == "" {
		http.Error(w, "BLOB_READ_WRITE_TOKEN is not set", http.StatusInternalServerError)
		return
	}

	// 4. Vercel Blob API에 업로드
	apiUrl := fmt.Sprintf("https://blob.vercel-storage.com/%s", header.Filename)

	httpReq, err := http.NewRequestWithContext(r.Context(), "PUT", apiUrl, bytes.NewReader(fileBytes))
	if err != nil {
		http.Error(w, "Failed to create request: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 헤더 설정
	httpReq.Header.Set("Authorization", "Bearer "+token)
	httpReq.Header.Set("X-Content-Type", header.Header.Get("Content-Type"))
	httpReq.Header.Set("Content-Type", header.Header.Get("Content-Type"))
	httpReq.Header.Set("X-Add-Random-Suffix", "1") // 파일명 중복 방지

	// 5. 요청 실행
	client := &http.Client{}
	httpRes, err := client.Do(httpReq)
	if err != nil {
		http.Error(w, "Failed to upload to Vercel Blob: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer httpRes.Body.Close()

	// 6. 응답 처리
	body, err := io.ReadAll(httpRes.Body)
	if err != nil {
		http.Error(w, "Failed to read response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if httpRes.StatusCode != http.StatusOK {
		http.Error(w, fmt.Sprintf("Vercel Blob API Error (%d): %s", httpRes.StatusCode, string(body)), httpRes.StatusCode)
		return
	}

	// 7. 응답 파싱 및 반환
	var blobRes struct {
		URL string `json:"url"`
	}
	if err := json.Unmarshal(body, &blobRes); err != nil {
		http.Error(w, "Failed to parse response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(UploadResponse{
		URL: blobRes.URL,
	})
}
