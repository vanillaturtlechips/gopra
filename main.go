package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

// ==============================================================================
// 💾 데이터 모델 및 저장소 (api/posts.go와 동일하게)
// ==============================================================================

type Post struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

var (
	posts  = make(map[int]Post) // 포스트 저장소
	nextID = 1
)

// ==============================================================================
// 🛠️ 헬퍼 함수
// ==============================================================================

// URL 경로에서 포스트 ID를 추출하는 헬퍼 함수 (예: /api/posts/1 -> 1)
func getPostID(path string) (int, bool) {
	parts := strings.Split(path, "/")

	// /api/posts/{id} 형태를 기대
	if len(parts) < 4 || parts[3] == "" {
		return 0, false // ID 부분이 없음
	}

	id, err := strconv.Atoi(parts[3])
	if err != nil {
		return 0, false // 정수로 변환 실패
	}
	return id, true
}

// ==============================================================================
// 🚦 핸들러 (Handler Functions) - Post 기준
// ==============================================================================

// R (Read All): GET /api/posts
func listPosts(w http.ResponseWriter, r *http.Request) {
	postList := []Post{}
	for _, post := range posts {
		postList = append(postList, post)
	}
	json.NewEncoder(w).Encode(postList)
}

// C (Create): POST /api/posts
func createPost(w http.ResponseWriter, r *http.Request) {
	var newPost Post
	if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}
	newPost.ID = nextID
	posts[nextID] = newPost
	nextID++
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newPost)
}

// R (Read One): GET /api/posts/{id}
func getPost(w http.ResponseWriter, r *http.Request, id int) {
	post, exists := posts[id]
	if !exists {
		http.Error(w, fmt.Sprintf("Post with ID %d not found", id), http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(post)
}

// U (Update): PUT /api/posts/{id}
func updatePost(w http.ResponseWriter, r *http.Request, id int) {
	if _, exists := posts[id]; !exists {
		http.Error(w, fmt.Sprintf("Post with ID %d not found", id), http.StatusNotFound)
		return
	}
	var updatedPost Post
	if err := json.NewDecoder(r.Body).Decode(&updatedPost); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}
	updatedPost.ID = id
	posts[id] = updatedPost
	json.NewEncoder(w).Encode(updatedPost)
}

// D (Delete): DELETE /api/posts/{id}
func deletePost(w http.ResponseWriter, r *http.Request, id int) {
	if _, exists := posts[id]; !exists {
		http.Error(w, fmt.Sprintf("Post with ID %d not found", id), http.StatusNotFound)
		return
	}
	delete(posts, id)
	w.WriteHeader(http.StatusNoContent)
}

// 🌐 통합 라우팅 핸들러
func postsHandler(w http.ResponseWriter, r *http.Request) {
	// --- CORS 헤더 추가 ---
	// (Vite 개발 서버(5173)에서 Go 서버(8080)로 요청하려면 CORS가 필요합니다)
	// (vite.config.ts 프록시를 사용하면 사실 필요없지만, 안전하게 추가)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	// --- CORS 끝 ---

	w.Header().Set("Content-Type", "application/json")

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

// ==============================================================================
// 🏁 메인 함수
// ==============================================================================

func main() {
	// 초기 데이터 (api/posts.go와 동일하게)
	posts[1] = Post{ID: 1, Title: "Serverless Go 필기 1", Content: "Go로 API를 만드는 방법입니다."}
	posts[2] = Post{ID: 2, Title: "쿠버네티스 학습 노트", Content: "컨테이너 오케스트레이션 기초."}
	nextID = 3

	mux := http.NewServeMux()

	// /api/posts/ 경로에 통합 핸들러 연결 (Vercel의 /api/posts와 일치)
	mux.HandleFunc("/api/posts/", postsHandler)

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Root path: hello my server %q", r.URL.Path)
	})

	fmt.Println("Server running on http://localhost:8080 (for local API testing)")
	http.ListenAndServe(":8080", mux)
}
