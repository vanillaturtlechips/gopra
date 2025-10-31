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
	"sync"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Post 구조체에 Category와 LinkURL 필드 추가
type Post struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Content  string `json:"content"`  // 요약글(Summary) 용도
	Category string `json:"category"` // ⬅️ 추가
	LinkURL  string `json:"linkUrl"`  // ⬅️ 추가 (JSON 태그는 linkUrl)
}

var (
	dbpool *pgxpool.Pool
	once   sync.Once
)

func initDB() error {
	var initErr error
	once.Do(func() {
		databaseUrl := os.Getenv("POSTGRES_URL")
		if databaseUrl == "" {
			initErr = fmt.Errorf("POSTGRES_URL is not set")
			return
		}

		config, err := pgxpool.ParseConfig(databaseUrl)
		if err != nil {
			initErr = fmt.Errorf("failed to parse database URL: %w", err)
			return
		}

		config.MaxConns = 1
		config.MinConns = 0
		config.MaxConnIdleTime = 0
		config.MaxConnLifetime = 0

		dbpool, err = pgxpool.NewWithConfig(context.Background(), config)
		if err != nil {
			initErr = fmt.Errorf("unable to create connection pool: %w", err)
			return
		}

		// ⬅️ CREATE TABLE 쿼리에 category와 link_url 컬럼 추가
		_, err = dbpool.Exec(context.Background(), `
			CREATE TABLE IF NOT EXISTS posts (
				id SERIAL PRIMARY KEY,
				title TEXT NOT NULL,
				content TEXT,
				category TEXT,
				link_url TEXT 
			);
		`)
		if err != nil {
			initErr = fmt.Errorf("failed to create posts table: %w", err)
			return
		}

		log.Println("Database pool initialized successfully")
	})
	return initErr
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

// listPosts: ⬅️ SELECT문에 category, link_url 추가
func listPosts(w http.ResponseWriter, r *http.Request) {
	conn, err := dbpool.Acquire(r.Context())
	if err != nil {
		log.Printf("Failed to acquire connection: %v", err)
		http.Error(w, "Failed to acquire connection", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	rows, err := conn.Query(r.Context(), "SELECT id, title, content, category, link_url FROM posts ORDER BY id DESC")
	if err != nil {
		log.Printf("Failed to query posts: %v", err)
		http.Error(w, "Failed to query posts", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	postList := []Post{}
	for rows.Next() {
		var p Post
		// ⬅️ Scan에 &p.Category, &p.LinkURL 추가
		if err := rows.Scan(&p.ID, &p.Title, &p.Content, &p.Category, &p.LinkURL); err != nil {
			log.Printf("Failed to scan post: %v", err)
			http.Error(w, "Failed to scan post", http.StatusInternalServerError)
			return
		}
		postList = append(postList, p)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Row iteration error: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(postList); err != nil {
		log.Printf("Failed to encode JSON: %v", err)
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
	}
}

// createPost: ⬅️ INSERT문에 category, link_url 추가
func createPost(w http.ResponseWriter, r *http.Request) {
	var newPost Post
	if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	// ⬅️ Title, Category, LinkURL을 필수값으로 검증
	if newPost.Title == "" || newPost.Category == "" || newPost.LinkURL == "" {
		http.Error(w, "Title, Category, LinkURL are required", http.StatusBadRequest)
		return
	}

	conn, err := dbpool.Acquire(r.Context())
	if err != nil {
		log.Printf("Failed to acquire connection: %v", err)
		http.Error(w, "Failed to acquire connection", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// ⬅️ INSERT 쿼리 및 파라미터 수정
	err = conn.QueryRow(r.Context(),
		"INSERT INTO posts (title, content, category, link_url) VALUES ($1, $2, $3, $4) RETURNING id",
		newPost.Title, newPost.Content, newPost.Category, newPost.LinkURL).Scan(&newPost.ID)

	if err != nil {
		log.Printf("Failed to create post: %v", err)
		http.Error(w, "Failed to create post", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newPost)
}

// getPost: ⬅️ SELECT문에 category, link_url 추가
func getPost(w http.ResponseWriter, r *http.Request, id int) {
	conn, err := dbpool.Acquire(r.Context())
	if err != nil {
		log.Printf("Failed to acquire connection: %v", err)
		http.Error(w, "Failed to acquire connection", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	var p Post
	// ⬅️ SELECT 쿼리 및 Scan 수정
	err = conn.QueryRow(r.Context(),
		"SELECT id, title, content, category, link_url FROM posts WHERE id = $1", id).Scan(&p.ID, &p.Title, &p.Content, &p.Category, &p.LinkURL)

	if err != nil {
		log.Printf("Post not found (ID: %d): %v", id, err)
		http.Error(w, fmt.Sprintf("Post with ID %d not found", id), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

// updatePost: ⬅️ UPDATE문에 category, link_url 추가
func updatePost(w http.ResponseWriter, r *http.Request, id int) {
	var updatedPost Post
	if err := json.NewDecoder(r.Body).Decode(&updatedPost); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	// ⬅️ Title, Category, LinkURL을 필수값으로 검증
	if updatedPost.Title == "" || updatedPost.Category == "" || updatedPost.LinkURL == "" {
		http.Error(w, "Title, Category, LinkURL are required", http.StatusBadRequest)
		return
	}

	conn, err := dbpool.Acquire(r.Context())
	if err != nil {
		log.Printf("Failed to acquire connection: %v", err)
		http.Error(w, "Failed to acquire connection", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// ⬅️ UPDATE 쿼리 및 파라미터 수정
	cmdTag, err := conn.Exec(r.Context(),
		"UPDATE posts SET title = $1, content = $2, category = $3, link_url = $4 WHERE id = $5",
		updatedPost.Title, updatedPost.Content, updatedPost.Category, updatedPost.LinkURL, id)

	if err != nil {
		log.Printf("Failed to update post: %v", err)
		http.Error(w, "Failed to update post", http.StatusInternalServerError)
		return
	}

	if cmdTag.RowsAffected() == 0 {
		http.Error(w, fmt.Sprintf("Post with ID %d not found", id), http.StatusNotFound)
		return
	}

	updatedPost.ID = id
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedPost)
}

// deletePost: (수정 필요 없음)
func deletePost(w http.ResponseWriter, r *http.Request, id int) {
	conn, err := dbpool.Acquire(r.Context())
	if err != nil {
		log.Printf("Failed to acquire connection: %v", err)
		http.Error(w, "Failed to acquire connection", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	cmdTag, err := conn.Exec(r.Context(), "DELETE FROM posts WHERE id = $1", id)
	if err != nil {
		log.Printf("Failed to delete post: %v", err)
		http.Error(w, "Failed to delete post", http.StatusInternalServerError)
		return
	}

	if cmdTag.RowsAffected() == 0 {
		http.Error(w, fmt.Sprintf("Post with ID %d not found", id), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Handler: (수정 필요 없음)
func Handler(w http.ResponseWriter, r *http.Request) {
	if err := initDB(); err != nil {
		log.Printf("Failed to initialize database: %v", err)
		http.Error(w, "Database initialization failed", http.StatusInternalServerError)
		return
	}

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
