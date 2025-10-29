import { useState, useEffect } from 'react'
import Header from './components/Header' // 1. Header 컴포넌트 import
import { Element } from 'react-scroll' // 2. react-scroll의 Element import

// Go API (api/posts.go)의 Post 구조체와 일치하는 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]); // 3. Go API에서 받아온 포스트 목록

  // Go API에서 데이터 가져오기 (컴포넌트가 처음 렌더링될 때 한 번 실행)
  useEffect(() => {
    // Vercel 배포 시 /api/posts는 api/posts.go를 자동 라우팅합니다.
    // 로컬 개발 시 Vite 프록시가 이 요청을 Go 서버(main.go)로 전달합니다.
    fetch('/api/posts') 
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data: Post[]) => {
        setPosts(data); // 4. 받아온 데이터를 state에 저장
      })
      .catch(err => console.error("Failed to fetch posts:", err));
  }, []); // [] (빈 배열) = 이 effect는 마운트 시 한 번만 실행됩니다.

  return (
    // Tailwind로 전체 레이아웃을 잡습니다.
    <div className="w-full min-h-screen bg-gray-900 text-white font-sans">
      
      {/* 5. Header 컴포넌트 적용 (sticky로 상단에 고정) */}
      <Header />

      {/* 6. 메인 컨텐츠 영역 */}
      {/* max-w-4xl: 최대 너비 제한 (스케치처럼)
        mx-auto: 좌우 자동 마진 (가운데 정렬)
        p-8: 패딩
      */}
      <main className="max-w-4xl mx-auto p-8">
        
        {/* 7. '자기소개' 섹션 */}
        {/* Element: react-scroll이 감지하는 영역. 'name' 속성이 Header의 'to'와 일치해야 함.
          min-h-screen: 화면 높이만큼의 최소 높이 (섹션이 화면을 채우도록)
          pt-20: 헤더 높이(80px)만큼 패딩을 줘서 제목이 헤더에 가려지지 않게 함
        */}
        <Element name="about" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold border-b-4 border-indigo-500 pb-4">
            자기소개 (About)
          </h2>
          <p className="mt-8 text-lg text-gray-300">
            안녕하세요! 새로운 기술을 만나면 설레는 개발자입니다.
            <br />
            이 포트폴리오는 Vercel에 Go (백엔드)와 React/Tailwind (프론트엔드)를
            <br />
            함께 배포하는 것을 테스트하기 위해 만들어졌습니다.
          </p>
        </Element>

        {/* 8. '공부 및 실습' 섹션 (API 데이터 출력) */}
        <Element name="study" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold border-b-4 border-indigo-500 pb-4">
            공부 및 실습 (Study)
          </h2>
          <div className="mt-8 grid gap-6">
            {/* posts state를 map으로 순회하며 화면에 렌더링합니다.
              Go API (api/posts.go)에 하드코딩된 2개의 포스트가 표시됩니다.
            */}
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="bg-gray-800 p-6 rounded-lg shadow-xl transition-transform hover:-translate-y-1">
                  <h3 className="text-2xl font-semibold text-indigo-400">{post.title}</h3>
                  <p className="mt-2 text-gray-300">{post.content}</p>
                </div>
              ))
            ) : (
              // 로딩 중이거나 API fetch에 실패했을 때
              <p className="text-gray-500">포스트를 불러오는 중...</p>
            )}
          </div>
        </Element>

        {/* 9. '프로젝트' 섹션 (스케치 참고) */}
        <Element name="project" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold border-b-4 border-indigo-500 pb-4">
            프로젝트 (Project)
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 스케치의 네모 박스 예시 */}
            <div className="bg-gray-800 h-64 rounded-lg shadow-xl flex items-center justify-center p-6 hover:shadow-indigo-500/30">
              <p className="text-gray-500">(WorkRoot 프로젝트 카드 예시)</p>
            </div>
            <div className="bg-gray-800 h-64 rounded-lg shadow-xl flex items-center justify-center p-6 hover:shadow-indigo-500/30">
              <p className="text-gray-500">(다른 프로젝트 카드 예시)</p>
            </div>
          </div>
        </Element>

        {/* 10. '연락처' 섹션 (스케치 참고) */}
        <Element name="contact" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold border-b-4 border-indigo-500 pb-4">
            연락처 (Contact)
          </h2>
          <div className="mt-8 bg-gray-800 p-10 rounded-lg shadow-xl">
            <p className="text-lg text-gray-300">
              여기에 연락처 및 블로그 링크 카드를 넣습니다. (스케치 참고)
            </p>
          </div>
        </Element>

      </main>

      {/* 푸터 */}
      <footer className="text-center p-8 border-t border-gray-700">
        <p className="text-gray-500">© 2025 myong21.site. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App