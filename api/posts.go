package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

type Post struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

var (
	posts  = make(map[int]Post)
	nextID = 1
)

func init() {
	posts[1] = Post{ID: 1, Title: "Serverless Go 필기 1", Content: "Go로 API를 만드는 방법입니다."}
	posts[2] = Post{ID: 2, Title: "쿠버네티스 학습 노트", Content: "컨테이너 오케스트레이션 기초."}
	nextID = 3
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
	postList := []Post{}
	for _, post := range posts {
		postList = append(postList, post)
	}

	if err := json.NewEncoder(w).Encode(postList); err != nil {
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
	}
}

func createPost(w http.ResponseWriter, r *http.Request) {
	var newPost Post

	if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
		http.Error(w, "Invalid JSON format: "+err.Error(), http.StatusBadRequest)
		return
	}

	newPost.ID = nextID
	posts[nextID] = newPost
	nextID++

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newPost)
}

func getPost(w http.ResponseWriter, r *http.Request, id int) {
	post, exists := posts[id]
	if !exists {
		http.Error(w, fmt.Sprintf("Post with ID %d not found", id), http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(post)
}

func updatePost(w http.ResponseWriter, r *http.Request, id int) {
	_, exists := posts[id]
	if !exists {
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

func deletePost(w http.ResponseWriter, r *http.Request, id int) {
	_, exists := posts[id]
	if !exists {
		http.Error(w, fmt.Sprintf("Post with ID %d not found", id), http.StatusNotFound)
		return
	}

	delete(posts, id)

	w.WriteHeader(http.StatusNoContent)
}

func Handler(w http.ResponseWriter, r *http.Request) {
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
