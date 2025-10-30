package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Post struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

var dbpool *pgxpool.Pool

func initDB() {

	databaseUrl := os.Getenv("POSTGRES_URL")
	if databaseUrl == "" {
		log.Fatal("POSTGRES_URL is not set")
	}

	var err error
	// pgxpool.New를 사용해 커넥션 풀을 생성합니다.
	dbpool, err = pgxpool.New(context.Background(), databaseUrl)
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v\n", err)
	}

	_, err = dbpool.Exec(context.Background(), `
		CREATE TABLE IF NOT EXISTS posts (
			id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			content TEXT
		);
	`)
	if err != nil {
		log.Fatalf("Failed to create 'posts' table: %v\n", err)
	}
}

func getPostID(path string) (int, bool) {
	parts := strings.Split(path, "/")
	idStr := ""
	for i := len(parts) - 1; i >= 0; i-- {
		if parts[i] != "" && parts[i] != "api" && parts[i] != "posts" {
			idStr = parts[i]
			break
		}
	}
	if idStr == "" {
		return 0, false
	}
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return 0, false
	}
	return id, true
}

func listPosts(w http.ResponseWriter, r *http.Request) {
	// 1. 풀에서 커넥션 빌려오기
	conn, err := dbpool.Acquire(r.Context())
	if err != nil {
		http.Error(w, "Failed to acquire connection", http.StatusInternalServerError)
		return
	}
	// 2. 함수 종료 시 반드시 커넥션 반납
	defer conn.Release()

	// 3. 쿼리 실행
	rows, err := conn.Query(r.Context(), "SELECT id, title, content FROM posts ORDER BY id DESC")
	if err != nil {
		http.Error(w, "Failed to query posts: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close() // rows도 닫아주기

	postList := []Post{}
	for rows.Next() {
		var p Post
		if err := rows.Scan(&p.ID, &p.Title, &p.Content); err != nil {
			http.Error(w, "Failed to scan post: "+err.Error(), http.StatusInternalServerError)
			return
		}
		postList = append(postList, p)
	}

	if err := json.NewEncoder(w).Encode(postList); err != nil {
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
	}
}

func createPost(w http.ResponseWriter, r *http.Request) {
	var newPost Post // id는 제외 (DB가 SERIAL로 생성)
	if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
		http.Error(w, "Invalid JSON format: "+err.Error(), http.StatusBadRequest)
		return
	}

	conn, err := dbpool.Acquire(r.Context())
	if err != nil {
		http.Error(w, "Failed to acquire connection", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// DB에 INSERT하고, 생성된 id를 반환받음
	err = conn.QueryRow(r.Context(),
		"INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id",
		newPost.Title, newPost.Content).Scan(&newPost.ID)

	if err != nil {
		http.Error(w, "Failed to create post: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newPost)
}

func getPost(w http.ResponseWriter, r *http.Request, id int) {
	conn, err := dbpool.Acquire(r.Context())
	if err != nil {
		http.Error(w, "Failed to acquire connection", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	var p Post
	err = conn.QueryRow(r.Context(),
		"SELECT id, title, content FROM posts WHERE id = $1", id).Scan(&p.ID, &p.Title, &p.Content)

	if err != nil {
		// (중요) 에러가 pgx.ErrNoRows이면 404 Not Found를 반환해야 합니다.
		// 여기서는 간단하게 처리합니다.
		http.Error(w, fmt.Sprintf("Post with ID %d not found or query failed: %v", id, err), http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(p)
}

func updatePost(w http.ResponseWriter, r *http.Request, id int) {
	var updatedPost Post
	if err := json.NewDecoder(r.Body).Decode(&updatedPost); err != nil {
		http.Error(w, "Invalid JSON format: "+err.Error(), http.StatusBadRequest)
		return
	}

	conn, err := dbpool.Acquire(r.Context())
	if err != nil {
		http.Error(w, "Failed to acquire connection", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// 1. UPDATE 쿼리 실행
	cmdTag, err := conn.Exec(r.Context(),
		"UPDATE posts SET title = $1, content = $2 WHERE id = $3",
		updatedPost.Title, updatedPost.Content, id)

	if err != nil {
		http.Error(w, "Failed to update post: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 2. 실제로 행이 업데이트되었는지 확인
	if cmdTag.RowsAffected() == 0 {
		http.Error(w, fmt.Sprintf("Post with ID %d not found", id), http.StatusNotFound)
		return
	}

	// 3. 업데이트된 객체 반환 (ID 설정)
	updatedPost.ID = id
	json.NewEncoder(w).Encode(updatedPost)
}

func deletePost(w http.ResponseWriter, r *http.Request, id int) {
	conn, err := dbpool.Acquire(r.Context())
	if err != nil {
		http.Error(w, "Failed to acquire connection", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// 1. DELETE 쿼리 실행
	cmdTag, err := conn.Exec(r.Context(), "DELETE FROM posts WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Failed to delete post: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 2. 실제로 행이 삭제되었는지 확인
	if cmdTag.RowsAffected() == 0 {
		http.Error(w, fmt.Sprintf("Post with ID %d not found", id), http.StatusNotFound)
		return
	}

	// 3. 성공 시 204 No Content 반환
	w.WriteHeader(http.StatusNoContent)
}

func Handler(w http.ResponseWriter, r *http.Request) {

	if dbpool == nil {
		initDB()
	}

	w.Header().Set("Content-Type", "application/json")

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	id, hasID := getPostID(r.URL.Path)

	switch r.Method {
	case http.MethodGet:
		if hasID {
			getPost(w, r, id)
		} else {
			listPosts(w, r)
		}

	case http.MethodPost:
		if hasID {
			http.Error(w, "Cannot POST to a specific post ID", http.StatusMethodNotAllowed)
			return
		}
		createPost(w, r)

	case http.MethodPut:
		if !hasID {
			http.Error(w, "PUT requires a post ID", http.StatusMethodNotAllowed)
			return
		}
		updatePost(w, r, id)

	case http.MethodDelete:
		if !hasID {
			http.Error(w, "DELETE requires a post ID", http.StatusMethodNotAllowed)
			return
		}
		deletePost(w, r, id)

	default:
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}
