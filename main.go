package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

// ==============================================================================
// 💾 데이터 모델 및 저장소 (전역 변수)
// ==============================================================================

var (
	members = make(map[int]Member) // 임시 회원 저장소 (해시맵)
	nextID  = 1                    // 다음 회원 ID 할당을 위한 카운터
)

type Member struct {
	ID    int    `json:"member_id"`
	Name  string `json:"member_name"`
	Email string `json:"member_email"`
}

// ==============================================================================
// 🛠️ 헬퍼 함수
// ==============================================================================

// URL 경로에서 회원 ID를 추출하는 헬퍼 함수 (예: /members/123 -> 123)
func getMemberID(path string) (int, bool) {
	// 경로를 "/" 기준으로 나눕니다.
	parts := strings.Split(path, "/")

	// 예상 경로: ["", "members", "123", ...]
	// parts[2]에 ID 문자열이 있어야 합니다.
	if len(parts) < 3 || parts[2] == "" {
		return 0, false // ID 부분이 없음
	}

	// ID 문자열을 정수로 변환합니다.
	id, err := strconv.Atoi(parts[2])
	if err != nil {
		return 0, false // 정수로 변환 실패
	}

	return id, true
}

// ==============================================================================
// 🚦 핸들러 (Handler Functions)
// ==============================================================================

// R (Read All): GET /members
func listMembers(w http.ResponseWriter, r *http.Request) {
	// 맵의 값들(회원 목록)을 slice로 변환합니다.
	memberList := []Member{}
	for _, member := range members {
		memberList = append(memberList, member)
	}

	// JSON 인코딩 및 응답
	if err := json.NewEncoder(w).Encode(memberList); err != nil {
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
	}
}

// C (Create): POST /members
func createMember(w http.ResponseWriter, r *http.Request) {
	var newMember Member

	// JSON 디코딩: 요청 본문을 Go 구조체에 담기
	if err := json.NewDecoder(r.Body).Decode(&newMember); err != nil {
		http.Error(w, "Invalid JSON format: "+err.Error(), http.StatusBadRequest)
		return
	}

	// ID 할당 및 저장
	newMember.ID = nextID
	members[nextID] = newMember
	nextID++

	// 응답 설정: 201 Created
	w.WriteHeader(http.StatusCreated)

	// 생성된 회원 정보를 JSON으로 인코딩하여 응답
	json.NewEncoder(w).Encode(newMember)
}

// R (Read One): GET /members/{id}
func getMember(w http.ResponseWriter, r *http.Request, id int) {
	member, exists := members[id]
	if !exists {
		http.Error(w, fmt.Sprintf("Member with ID %d not found", id), http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(member)
}

// U (Update): PUT /members/{id}
func updateMember(w http.ResponseWriter, r *http.Request, id int) {
	// 1. 해당 ID의 회원이 있는지 확인
	_, exists := members[id]
	if !exists {
		http.Error(w, fmt.Sprintf("Member with ID %d not found", id), http.StatusNotFound)
		return
	}

	// 2. 요청 본문(JSON)을 새 회원 정보 구조체에 디코딩
	var updatedMember Member
	if err := json.NewDecoder(r.Body).Decode(&updatedMember); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	// 3. ID는 URL에서 받은 값으로 고정하고 맵에 저장 (덮어쓰기)
	updatedMember.ID = id
	members[id] = updatedMember

	// 4. 수정된 정보 반환
	json.NewEncoder(w).Encode(updatedMember)
}

// D (Delete): DELETE /members/{id}
func deleteMember(w http.ResponseWriter, r *http.Request, id int) {
	// 1. 해당 ID의 회원이 있는지 확인
	_, exists := members[id]
	if !exists {
		http.Error(w, fmt.Sprintf("Member with ID %d not found", id), http.StatusNotFound)
		return
	}

	// 2. 맵에서 해당 키-값 쌍 삭제
	delete(members, id)

	// 3. 204 No Content 상태 코드로 응답 (성공적인 삭제)
	w.WriteHeader(http.StatusNoContent)
}

// 🌐 통합 라우팅 및 메서드 분기 핸들러
func membersHandler(w http.ResponseWriter, r *http.Request) {
	// 모든 응답은 JSON 형식으로 설정
	w.Header().Set("Content-Type", "application/json")

	// 경로에 ID가 있는지 확인
	id, hasID := getMemberID(r.URL.Path)

	switch r.Method {
	case http.MethodGet:
		if hasID {
			getMember(w, r, id)
		} else {
			listMembers(w, r)
		}

	case http.MethodPost:
		if hasID {
			http.Error(w, "Cannot POST to a specific member ID", http.StatusMethodNotAllowed)
			return
		}
		createMember(w, r)

	case http.MethodPut:
		if !hasID {
			http.Error(w, "PUT requires a member ID", http.StatusMethodNotAllowed)
			return
		}
		updateMember(w, r, id)

	case http.MethodDelete:
		if !hasID {
			http.Error(w, "DELETE requires a member ID", http.StatusMethodNotAllowed)
			return
		}
		deleteMember(w, r, id)

	default:
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

// ==============================================================================
// 🏁 메인 함수
// ==============================================================================

func main() {
	// 초기 데이터 설정
	members[1] = Member{ID: 1, Name: "홍길동", Email: "hong@test.com"}
	members[2] = Member{ID: 2, Name: "김철수", Email: "kim@test.com"}
	nextID = 3

	// 커스텀 ServeMux 생성
	mux := http.NewServeMux()

	// /members/ 경로에 통합 핸들러 연결 (꼬리 슬래시 포함하여 /members와 /members/{id} 모두 처리)
	mux.HandleFunc("/members/", membersHandler)

	// 루트 경로 핸들러
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Root path: hello my server %q", r.URL.Path)
	})

	fmt.Println("Server running on http://localhost:8080")
	// nil 대신 우리가 만든 mux를 사용하여 서버 실행
	http.ListenAndServe(":8080", mux)
}
