// main.go
// "쓰기" 기능(POST, PUT, DELETE)과 이미지 업로드 핸들러,
// 인증(isAuthorized) 로직이 모두 제거된 "읽기 전용" 서버입니다.

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Post 구조체 (DB용)
// GitHub 링크와 요약글(Content), 카테고리를 저장합니다.
type Post struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Content  string `json:"content"`
	Category string `json:"category"`
	LinkURL  string `json:"linkUrl"`
}

// 글로벌 DB 커넥션 풀
var dbpool *pgxpool.Pool

// 1. DB 초기화 함수 (변경 없음)
// posts 테이블이 없으면 최신 스키마로 생성합니다.
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
					content TEXT,
					category TEXT,
					link_url TEXT 
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

// 2. Post ID 파싱 함수 (변경 없음)
func getPostID(path string) (int, bool) {
	parts := strings.Split(path, "/")
	if len(parts) >= 4 && parts[3] != "" {
		id, err := strconv.Atoi(parts[3])
		if err == nil {
			return id, true
		}
	}
	return 0, false
}

// 3. Post API 핸들러 (GET 전용으로 수정됨)
func postsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	// "읽기"만 허용하도록 수정
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// GET 요청이 아니면 405 Method Not Allowed 반환
	if r.Method != http.MethodGet {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
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

	// POST, PUT, DELETE 로직이 제거되고 GET 로직만 남음
	if hasID { // GET /api/posts/{id}
		var p Post
		err := conn.QueryRow(r.Context(),
			"SELECT id, title, content, category, link_url FROM posts WHERE id = $1", id).Scan(&p.ID, &p.Title, &p.Content, &p.Category, &p.LinkURL)
		if err != nil {
			http.Error(w, fmt.Sprintf("Post with ID %d not found: %v", id, err), http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(p)
	} else { // GET /api/posts
		rows, err := conn.Query(r.Context(), "SELECT id, title, content, category, link_url FROM posts ORDER BY id DESC")
		if err != nil {
			http.Error(w, "Failed to query posts: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		postList := []Post{}
		for rows.Next() {
			var p Post
			if err := rows.Scan(&p.ID, &p.Title, &p.Content, &p.Category, &p.LinkURL); err != nil {
				http.Error(w, "Failed to scan post: "+err.Error(), http.StatusInternalServerError)
				return
			}
			postList = append(postList, p)
		}
		json.NewEncoder(w).Encode(postList)
	}
}

// 4. 메인 함수 (라우터 정리)
func main() {
	initDB()
	mux := http.NewServeMux()

	// "쓰기" 관련 핸들러(upload)가 모두 제거됨
	mux.HandleFunc("/api/posts", postsHandler)
	mux.HandleFunc("/api/posts/", postsHandler)

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			fmt.Fprintf(w, "Go-pra backend server is running! (Read-Only)")
		} else {
			http.NotFound(w, r)
		}
	})

	log.Println("Go backend server running on http://localhost:8080 (Read-Only)")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
