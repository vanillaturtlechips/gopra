package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
)

type UploadRequest struct {
	Filename    string `json:"filename"`
	ContentType string `json:"contentType"`
	Size        int64  `json:"size"`
}

type VercelBlobResponse struct {
	UploadURL string `json:"uploadUrl"`
	URL       string `json:"url"`
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

	var req UploadRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON format: "+err.Error(), http.StatusBadRequest)
		return
	}
	if req.Filename == "" || req.ContentType == "" || req.Size == 0 {
		http.Error(w, "Filename, ContentType, and Size are required", http.StatusBadRequest)
		return
	}

	token := os.Getenv("BLOB_READ_WRITE_TOKEN")
	if token == "" {
		http.Error(w, "BLOB_READ_WRITE_TOKEN is not set", http.StatusInternalServerError)
		return
	}

	escapedFilename := url.PathEscape(req.Filename)
	apiUrl := fmt.Sprintf("https://blob.vercel-storage.com/%s?public=true", escapedFilename)

	httpReq, err := http.NewRequestWithContext(r.Context(), "PUT", apiUrl, nil)
	if err != nil {
		http.Error(w, "Failed to create HTTP request: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// apiUrl := fmt.Sprintf("https://blob.vercel-storage.com/%s?public=true", req.Filename)
	// httpReq, err := http.NewRequestWithContext(r.Context(), "PUT", apiUrl, nil)
	// if err != nil {
	// 	http.Error(w, "Failed to create HTTP request: "+err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	httpReq.Header.Set("Authorization", "Bearer "+token)
	httpReq.Header.Set("x-content-type", req.ContentType)
	// httpReq.Header.Set("x-content-length", strconv.FormatInt(req.Size, 10))

	httpReq.Header.Set("x-ms-blob-type", "BlockBlob")

	client := &http.Client{}
	httpRes, err := client.Do(httpReq)
	if err != nil {
		http.Error(w, "Failed to call Vercel Blob API: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer httpRes.Body.Close()

	body, err := io.ReadAll(httpRes.Body)
	if err != nil {
		http.Error(w, "Failed to read Blob API response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if httpRes.StatusCode != http.StatusOK {
		http.Error(w, fmt.Sprintf("Vercel Blob API Error (%d): %s", httpRes.StatusCode, string(body)), http.StatusInternalServerError)
		return
	}

	var blobRes VercelBlobResponse
	if err := json.Unmarshal(body, &blobRes); err != nil {
		http.Error(w, "Failed to parse Blob API response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"uploadUrl": blobRes.UploadURL,
		"finalUrl":  blobRes.URL,
	})
}
