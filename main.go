package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv" // 1. ⬇️ 파일 크기 변환을 위해 'strconv' import
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// --- Post 구조체 (DB용) ---
type Post struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

// --- 글로벌 DB 커넥션 풀 ---
var dbpool *pgxpool.Pool

// --- 1. DB 초기화 함수 (기존과 동일) ---
func initDB() {
	databaseUrl := os.Getenv("POSTGRES_URL")
	if databaseUrl == "" {
		log.Println("WARNING: POSTGRES_URL is not set, using default for local dev")
		databaseUrl = "postgres://gopra_user:gopra_pass@db:5432/gopra_db?sslmode=disable"
	}

	var err error
	for i := 0; i < 5; i++ {
		dbpool, err = pgxpool.New(context.Background(), databaseUrl)
		if err == nil {
			_, err = dbpool.Exec(context.Background(), `
				CREATE TABLE IF NOT EXISTS posts (
					id SERIAL PRIMARY KEY,
					title TEXT NOT NULL,
					content TEXT
				);
			`)
			if err == nil {
				log.Println("Database pool initialized and table checked.")
				return
			}
		}
		log.Printf("Failed to connect to DB (attempt %d/5): %v. Retrying in 2s...\n", i+1, err)
		time.Sleep(2 * time.Second)
	}
	log.Fatalf("Unable to create connection pool after multiple attempts: %v\n", err)
}

// --- 2. Post API 핸들러 (기존과 동일) ---
// ( ... getPostID, postsHandler, listPosts, createPost 등 모든 함수는 이전과 동일합니다 ... )
func getPostID(path string) (int, bool) {
	parts := strings.Split(path, "/")
	// /api/posts/{id} 형태를 기대
	if len(parts) >= 4 && parts[3] != "" {
		id, err := strconv.Atoi(parts[3])
		if err == nil {
			return id, true
		}
	}
	return 0, false
}

func postsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	conn, err := dbpool.Acquire(r.Context())
	if err != nil {
		http.Error(w, "Failed to acquire db connection: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	id, hasID := getPostID(r.URL.Path)

	switch r.Method {
	case http.MethodGet:
		if hasID { // GET /api/posts/{id}
			var p Post
			err := conn.QueryRow(r.Context(), "SELECT id, title, content FROM posts WHERE id = $1", id).Scan(&p.ID, &p.Title, &p.Content)
			if err != nil {
				http.Error(w, fmt.Sprintf("Post with ID %d not found: %v", id, err), http.StatusNotFound)
				return
			}
			json.NewEncoder(w).Encode(p)
		} else { // GET /api/posts
			rows, err := conn.Query(r.Context(), "SELECT id, title, content FROM posts ORDER BY id DESC")
			if err != nil {
				http.Error(w, "Failed to query posts: "+err.Error(), http.StatusInternalServerError)
				return
			}
			defer rows.Close()
			postList := []Post{}
			for rows.Next() {
				var p Post
				if err := rows.Scan(&p.ID, &p.Title, &p.Content); err != nil {
					http.Error(w, "Failed to scan post: "+err.Error(), http.StatusInternalServerError)
					return
				}
				postList = append(postList, p)
			}
			json.NewEncoder(w).Encode(postList)
		}

	case http.MethodPost: // POST /api/posts
		if hasID {
			http.Error(w, "Cannot POST to a specific post ID", http.StatusMethodNotAllowed)
			return
		}
		var newPost Post
		if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
			http.Error(w, "Invalid JSON format: "+err.Error(), http.StatusBadRequest)
			return
		}
		err = conn.QueryRow(r.Context(), "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id", newPost.Title, newPost.Content).Scan(&newPost.ID)
		if err != nil {
			http.Error(w, "Failed to create post: "+err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(newPost)

	case http.MethodPut: // PUT /api/posts/{id}
		if !hasID {
			http.Error(w, "PUT requires a post ID", http.StatusMethodNotAllowed)
			return
		}
		var updatedPost Post
		if err := json.NewDecoder(r.Body).Decode(&updatedPost); err != nil {
			http.Error(w, "Invalid JSON format: "+err.Error(), http.StatusBadRequest)
			return
		}
		cmdTag, err := conn.Exec(r.Context(), "UPDATE posts SET title = $1, content = $2 WHERE id = $3", updatedPost.Title, updatedPost.Content, id)
		if err != nil {
			http.Error(w, "Failed to update post: "+err.Error(), http.StatusInternalServerError)
			return
		}
		if cmdTag.RowsAffected() == 0 {
			http.Error(w, fmt.Sprintf("Post with ID %d not found", id), http.StatusNotFound)
			return
		}
		updatedPost.ID = id
		json.NewEncoder(w).Encode(updatedPost)

	case http.MethodDelete: // DELETE /api/posts/{id}
		if !hasID {
			http.Error(w, "DELETE requires a post ID", http.StatusMethodNotAllowed)
			return
		}
		cmdTag, err := conn.Exec(r.Context(), "DELETE FROM posts WHERE id = $1", id)
		if err != nil {
			http.Error(w, "Failed to delete post: "+err.Error(), http.StatusInternalServerError)
			return
		}
		if cmdTag.RowsAffected() == 0 {
			http.Error(w, fmt.Sprintf("Post with ID %d not found", id), http.StatusNotFound)
			return
		}
		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

// --- 3. Upload API 핸들러 (수정됨) ---
type UploadRequest struct {
	Filename    string `json:"filename"`
	ContentType string `json:"contentType"`
	Size        int64  `json:"size"` // 2. ⬇️ React에서 파일 크기를 받기 위한 필드 추가
}
type VercelBlobResponse struct {
	UploadURL string `json:"uploadUrl"`
	URL       string `json:"url"`
}

func uploadRequestHandler(w http.ResponseWriter, r *http.Request) {
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
	// 3. ⬇️ Size가 0인지도 함께 체크
	if req.Filename == "" || req.ContentType == "" || req.Size == 0 {
		http.Error(w, "Filename, ContentType, and Size are required", http.StatusBadRequest)
		return
	}

	token := os.Getenv("BLOB_READ_WRITE_TOKEN")
	if token == "" {
		log.Println("ERROR: BLOB_READ_WRITE_TOKEN is not set")
		http.Error(w, "BLOB_READ_WRITE_TOKEN is not set", http.StatusInternalServerError)
		return
	}

	apiUrl := fmt.Sprintf("https://blob.vercel-storage.com/%s?public=true", req.Filename)
	httpReq, err := http.NewRequestWithContext(r.Context(), "PUT", apiUrl, nil)
	if err != nil {
		log.Println("ERROR: Failed to create HTTP request:", err)
		http.Error(w, "Failed to create HTTP request: "+err.Error(), http.StatusInternalServerError)
		return
	}

	httpReq.Header.Set("Authorization", "Bearer "+token)
	httpReq.Header.Set("x-ms-blob-content-type", req.ContentType)
	// 4. ⬇️ Vercel Blob API에 파일 크기(int64)를 문자열로 변환하여 헤더에 추가
	httpReq.Header.Set("x-ms-blob-content-length", strconv.FormatInt(req.Size, 10))

	client := &http.Client{}
	httpRes, err := client.Do(httpReq)
	if err != nil {
		log.Println("ERROR: Failed to call Vercel Blob API:", err)
		http.Error(w, "Failed to call Vercel Blob API: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer httpRes.Body.Close()

	body, err := io.ReadAll(httpRes.Body)
	if err != nil {
		log.Println("ERROR: Failed to read Blob API response:", err)
		http.Error(w, "Failed to read Blob API response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if httpRes.StatusCode != http.StatusOK {
		log.Printf("ERROR: Vercel Blob API Error (%d): %s\n", httpRes.StatusCode, string(body))
		http.Error(w, fmt.Sprintf("Vercel Blob API Error (%d): %s", httpRes.StatusCode, string(body)), http.StatusInternalServerError)
		return
	}

	var blobRes VercelBlobResponse
	if err := json.Unmarshal(body, &blobRes); err != nil {
		log.Println("ERROR: Failed to parse Blob API response:", err)
		http.Error(w, "Failed to parse Blob API response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"uploadUrl": blobRes.UploadURL,
		"finalUrl":  blobRes.URL,
	})
}

// --- 4. 메인 함수 (라우터 설정) ---
func main() {
	initDB()
	mux := http.NewServeMux()

	mux.HandleFunc("/api/posts", postsHandler)  // POST (create), GET (list)
	mux.HandleFunc("/api/posts/", postsHandler) // GET (one), PUT, DELETE
	mux.HandleFunc("/api/upload-request", uploadRequestHandler)

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// '/' 경로가 '/api/posts'를 포함한 모든 것을 잡지 않도록 수정
		if r.URL.Path == "/" {
			fmt.Fprintf(w, "Go-pra backend server is running!")
		} else {
			http.NotFound(w, r)
		}
	})

	log.Println("Go backend server running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
