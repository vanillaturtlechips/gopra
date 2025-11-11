// frontend/src/App.tsx
// "글쓰기" UI (PostEditor)와 관련 로직(handlePostCreated, API_TOKEN)이
// 모두 제거된 "읽기 전용" UI입니다.

import { useState, useEffect, useRef /* ⬅️ FormEvent, ChangeEvent 제거 */ } from 'react'

//--- Post 구조체 (변경 없음) ---
interface Post {
  id: number;
  title: string;
  content: string; // 요약글
  category: string; 
  linkUrl: string;
}

//=================================================================
// 1. Header 컴포넌트 ("글쓰기" 링크 제거)
//=================================================================
const navLinks = [
  { to: 'about', label: '자기소개' },
  { to: 'study', label: '공부 및 실습' },
  { to: 'project', label: '프로젝트' },
  // { to: 'write', label: '글쓰기' }, // ⬅️ "글쓰기" 링크 삭제
  { to: 'contact', label: '연락처' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 스크롤 이동 핸들러 (변경 없음)
  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 80; 
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 w-full h-20 bg-gray-900 bg-opacity-80 backdrop-blur-sm shadow-lg z-50">
      <nav className="max-w-4xl mx-auto h-full flex items-center justify-between px-8">
        <a
          href="#about"
          onClick={(e) => handleScrollClick(e, 'about')}
          className="text-2xl font-bold text-indigo-400 cursor-pointer hover:text-indigo-300"
        >
          myong12.site
        </a>

        {/* 데스크탑 네비게이션 링크 */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={`#${link.to}`}
              onClick={(e) => handleScrollClick(e, link.to)}
              className="text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        
        {/* 모바일 메뉴 버튼 (변경 없음) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </nav>
      
      {/* 모바일 드롭다운 메뉴 (변경 없음) */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-gray-800 shadow-lg py-2">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={`#${link.to}`}
              onClick={(e) => handleScrollClick(e, link.to)}
              className="block text-center text-gray-300 hover:text-indigo-400 px-4 py-3 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}


//=================================================================
// 2. PostEditor 컴포넌트 ⬅️ 전체 삭제
//=================================================================
// (PostEditorProps, PostEditor 함수가 모두 제거되었습니다.)


//=================================================================
// 3. 메인 App 컴포넌트
//=================================================================

// 대소문자 정규화 함수 (변경 없음)
function normalizeCategory(category: string): string {
  return category.toLowerCase().replace(/[\s-]/g, '');
}

// 카테고리 목록 (변경 없음)
const categories = [
  'All', 
  'devops',
  'GOlang',
  'DataBase',
  'Network',
  'Operating System',
  'Data Structure and Algorithm'
];

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // API 서버에서 포스트 목록을 가져오는 함수 (변경 없음)
  const fetchPosts = () => {
    setIsLoading(true); 
    fetch('/api/posts') // main.go의 GET 핸들러 호출
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data: Post[]) => {
        console.log('📥 Fetched posts:', data); 
        setPosts(data);
        setIsLoading(false); 
      })
      .catch(err => {
        console.error("Failed to fetch posts:", err);
        setIsLoading(false);
      });
  };

  // 컴포넌트 마운트 시 포스트 목록 가져오기 (변경 없음)
  useEffect(() => {
    fetchPosts();
  }, []); 

  // ⬅️ PostEditor가 사라졌으므로 handlePostCreated 함수도 제거
  /*
  const handlePostCreated = () => {
    // ...
  };
  */

  // 카테고리 필터링 로직 (변경 없음)
  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(post => 
        normalizeCategory(post.category) === normalizeCategory(selectedCategory)
      );

  // console.log('🔍 Selected:', selectedCategory);
  // console.log('🔍 Filtered posts:', filteredPosts);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white font-sans">
      
      <Header />

      <main className="max-w-4xl mx-auto p-8">
        
        <section id="about" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold border-b-4 border-indigo-500 pb-4">
            자기소개 (About)
          </h2>
          <p className="mt-8 text-lg text-gray-300">
            안녕하세요! 새로운 기술을 만나면 설레는 개발자입니다.
            <br />
            이 포트폴리오는 Vercel에서 벗어나 Go (백엔드)와 React/Tailwind (프론트엔드)를
            <br />
            직접 VPS에 배포하기 위해 만들어졌습니다. (GitOps 방식)
          </p>
        </section>

        <section id="study" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold border-b-4 border-indigo-500 pb-4">
            공부 및 실습 (Study)
          </h2>
          
          {/* 카테고리 탭 버튼 (변경 없음) */}
          <div className="flex flex-wrap gap-4 my-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-semibold transition-all
                  ${selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg'
                    * 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 현재 카테고리 표시 (변경 없음) */}
          <p className="text-sm text-gray-500 mb-4">
            '{selectedCategory}' 카테고리 ({filteredPosts.length}개 게시글)
          </p>

          {/* 포스트 카드 목록 (변경 없음) */}
          <div className="mt-8 grid gap-6">
            {isLoading ? (
              <p className="text-gray-500">포스트를 불러오는 중...</p>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.linkUrl} // GitHub 링크로 이동
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-800 p-6 rounded-lg shadow-xl transition-all hover:-translate-y-1 hover:shadow-indigo-500/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-semibold text-indigo-400">{post.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-900 text-indigo-300">
                      {post.category}
                    </span>
                  </div>
                  {post.content && (
                    // sync.mjs가 넣어준 요약글을 렌더링
                    <p className="mt-2 text-gray-300 whitespace-pre-wrap">{post.content}</p>
                  )}
                </a>
              ))
            ) : (
              <p className="text-gray-500">
                {selectedCategory === 'All' 
                  ? "아직 작성된 게시글이 없습니다."
                  : `'${selectedCategory}' 카테고리에 게시글이 없습니다.`
                }
              </p>
            )}
          </div>
        </section>

        <section id="project" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold border-b-4 border-indigo-500 pb-4">
            프로젝트 (Project)
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 h-64 rounded-lg shadow-xl flex items-center justify-center p-6 hover:shadow-indigo-500/30">
              <p className="text-gray-500">(WorkRoot 프로젝트 카드 예시)</p>
            </div>
            <div className="bg-gray-800 h-64 rounded-lg shadow-xl flex items-center justify-center p-6 hover:shadow-indigo-500/30">
              <p className="text-gray-500">(다른 프로젝트 카드 예시)</p>
            </div>
          </div>
        </section>

        {/* ⬅️ "새 글 작성하기 (관리자용)" 섹션(<section id="write">)이
          모두 제거되었습니다.
        */}

        <section id="contact" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold border-b-4 border-indigo-500 pb-4">
            연락처 (Contact)
          </h2>
          <div className="mt-8 bg-gray-800 p-10 rounded-lg shadow-xl">
            <p className="text-lg text-gray-300">
              여기에 연락처 및 블로그 링크 카드를 넣습니다.
            </p>
          </div>
        </section>
      </main>

      <footer className="text-center p-8 border-t border-gray-700">
        <p className="text-gray-500">© 2025 myong12.site All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
