package handler

import (
	// 1. bytes 패키지 추가 (JSON 본문용)
	"encoding/json"
	"fmt" // 2. fmt 패키지 추가 (Vercel API URL 생성용)
	"io"  // 3. io 패키지 추가 (응답 읽기용)
	"net/http"
	"os"
	"strings" // 4. strings 패키지 추가 (컨텐츠 타입용)
	// "github.com/vercel/blob/sdk/go/blob" // ⬅️ SDK를 사용하지 않으므로 삭제!
)

// React가 보낼 요청 JSON 구조체 (동일)
type UploadRequest struct {
	Filename string `json:"filename"` // "image.png"
}

// React에게 반환할 응답 JSON 구조체 (동..."/blob" Vercel API가 반환하는 실제 구조체)
type VercelBlobResponse struct {
	UploadURL string `json:"uploadUrl"` // 1회용 업로드 URL
	URL       string `json:"url"`       // 업로드 완료 후 최종 주소
}

// 메인 핸들러
func Handler(w http.ResponseWriter, r *http.Request) {
	// 1. POST 요청만 허용 (동일)
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	// 2. React가 보낸 JSON 파싱 (동일)
	var req UploadRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON format: "+err.Error(), http.StatusBadRequest)
		return
	}
	if req.Filename == "" {
		http.Error(w, "Filename is required", http.StatusBadRequest)
		return
	}

	// 3. Vercel 환경 변수에서 Blob 토큰 읽기 (동일)
	token := os.Getenv("BLOB_READ_WRITE_TOKEN")
	if token == "" {
		http.Error(w, "BLOB_READ_WRITE_TOKEN is not set", http.StatusInternalServerError)
		return
	}

	// 4. ⬇️ SDK 대신 Go의 'net/http' 클라이언트로 직접 API 호출

	// Vercel Blob API 엔드포인트
	// (파일 경로에 /를 포함할 수 있으므로, 경로를 포함하여 요청)
	apiUrl := fmt.Sprintf("https://blob.vercel-storage.com/%s?public=true", req.Filename)

	// Vercel API에 보낼 요청(Request) 생성
	// (Vercel 문서는 public=true 옵션을 쿼리 파라미터로,
	//  이미지 타입은 헤더로 보낼 것을 요구합니다.)
	httpReq, err := http.NewRequestWithContext(r.Context(), "PUT", apiUrl, nil) // 본문(body)은 없음
	if err != nil {
		http.Error(w, "Failed to create HTTP request: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 5. Vercel API가 요구하는 필수 헤더 추가
	httpReq.Header.Set("Authorization", "Bearer "+token)
	// (옵션) 업로드할 파일의 Content-Type을 미리 지정 (React에서 보낸 파일 타입 사용 권장)
	// 여기서는 파일 확장자로 간단히 유추합니다.
	if strings.HasSuffix(req.Filename, ".png") {
		httpReq.Header.Set("x-ms-blob-content-type", "image/png")
	} else if strings.HasSuffix(req.Filename, ".jpg") || strings.HasSuffix(req.Filename, ".jpeg") {
		httpReq.Header.Set("x-ms-blob-content-type", "image/jpeg")
	} // ... (다른 타입 추가 가능) ...

	// (옵션) 10분 제한. Vercel Blob 기본값은 5분입니다.
	// httpReq.Header.Set("x-ms-timeout", "600")

	// 6. Go HTTP 클라이언트로 Vercel API에 요청 전송
	client := &http.Client{}
	httpRes, err := client.Do(httpReq)
	if err != nil {
		http.Error(w, "Failed to call Vercel Blob API: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer httpRes.Body.Close()

	// 7. Vercel API의 응답을 읽음
	body, err := io.ReadAll(httpRes.Body)
	if err != nil {
		http.Error(w, "Failed to read Blob API response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 8. Vercel API가 에러를 반환한 경우
	if httpRes.StatusCode != http.StatusOK {
		http.Error(w, fmt.Sprintf("Vercel Blob API Error (%d): %s", httpRes.StatusCode, string(body)), http.StatusInternalServerError)
		return
	}

	// 9. Vercel API의 JSON 응답을 파싱
	var blobRes VercelBlobResponse
	if err := json.Unmarshal(body, &blobRes); err != nil {
		http.Error(w, "Failed to parse Blob API response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 10. React에게 최종 응답 반환 (PostEditor.tsx가 원하는 형식으로)
	w.Header().Set("Content-Type", "application/json")
	// PostEditor.tsx는 'finalUrl' 필드를 기대하므로, 'url'을 'finalUrl'로 매핑
	json.NewEncoder(w).Encode(map[string]string{
		"uploadUrl": blobRes.UploadURL,
		"finalUrl":  blobRes.URL,
	})
}
