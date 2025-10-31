import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react'

//--- Post 구조체 (1단계에서 수정 완료) ---
interface Post {
  id: number;
  title: string;
  content: string; // 요약글
  category: string; 
  linkUrl: string;
}

//=================================================================
// 1. Header 컴포넌트 (수정 없음)
//=================================================================
const navLinks = [
  { to: 'about', label: '자기소개' },
  { to: 'study', label: '공부 및 실습' },
  { to: 'project', label: '프로젝트' },
  { to: 'write', label: '글쓰기' },
  { to: 'contact', label: '연락처' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        
        {/* 모바일 메뉴 버튼 */}
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
      
      {/* 모바일 드롭다운 메뉴 */}
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
// 2. PostEditor 컴포넌트 (1단계에서 수정 완료)
//=================================================================
interface PostEditorProps {
  onPostCreated: () => void;
}

function PostEditor({ onPostCreated }: PostEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !category || !linkUrl) {
      setError('제목, 카테고리, Notion 링크는 필수 항목입니다.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, category, linkUrl }),
      });

      if (!response.ok) {
        throw new Error('게시글 등록에 실패했습니다.');
      }

      setTitle('');
      setContent('');
      setCategory('');
      setLinkUrl('');
      onPostCreated(); 
      
      alert('게시글이 성공적으로 등록되었습니다!');

    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
         const errText = await response.text();
         throw new Error(`이미지 업로드 실패: ${errText}`);
      }
      
      const data = await response.json();
      
      const markdownImage = `\n![${file.name}](${data.url})\n`;
      insertTextAtCursor(markdownImage);

    } catch (err) {
      if (err instanceof Error) {
        setError(`이미지 업로드 실패: ${err.message}`);
      } else {
        setError('이미지 업로드 중 알 수 없는 오류 발생');
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = content.substring(0, start) + text + content.substring(end);
    
    setContent(newText);

    setTimeout(() => {
      textarea.selectionStart = start + text.length;
      textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. 제목 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          제목
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="게시글 제목을 입력하세요"
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-3"
        />
      </div>

      {/* 2. 카테고리 (1단계에서 수정 완료) */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300">
          카테고리
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="예: devops, GOlang, DataBase"
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-3"
        />
      </div>

      {/* 3. GitHub 링크 (1단계에서 수정 완료) */}
       <div>
        <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-300">
          GitHub 링크
        </label>
        <input
          type="text"
          id="linkUrl"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="GitHub 마크다운 파일 URL을 붙여넣으세요"
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-3"
        />
      </div>

      {/* 4. 요약글 (1단계에서 수정 완료) */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-300">
          요약글 (선택 사항)
        </label>
        <textarea
          id="content"
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="게시글 요약을 입력하세요 (링크 카드의 설명글이 됩니다)"
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-3 font-mono"
        />
      </div>

      {/* 5. 이미지 첨부 (요약글용) */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
        >
          {isUploading ? '업로드 중...' : '요약글에 이미지 첨부'}
        </button>
        {isUploading && <span className="ml-4 text-sm text-gray-400">이미지 처리 중...</span>}
      </div>

      {/* 6. 에러 및 제출 버튼 */}
      {error && (
        <div className="rounded-md bg-red-900/50 p-4">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
      <div className="text-right">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
        >
          {isSubmitting ? '등록 중...' : '게시글 등록'}
        </button>
      </div>
    </form>
  );
}


//=================================================================
// 3. 메인 App 컴포넌트 (*** 수정된 부분 ***)
//=================================================================

// ⬅️ 사용자가 요청한 카테고리 목록 (+ 'All' 추가)
const categories = [
  'All', 
  'devops',
  'GOlang',
  'DataBase',
  'Network',
  'Operating System',
  'Data Structure and Algorithm' // 오타 수정
];

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // ⬅️ 1. 선택된 카테고리 state 추가 (기본값 'All')
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchPosts = () => {
    setIsLoading(true); 
    fetch('/api/posts')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data: Post[]) => {
        setPosts(data);
        setIsLoading(false); 
      })
      .catch(err => {
        console.error("Failed to fetch posts:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []); 

  const handlePostCreated = () => {
    fetchPosts(); 
    
    // 새 글 작성 후 'study' 섹션으로 스크롤
    const studyElement = document.getElementById('study');
    if (studyElement) {
      const headerOffset = 80; 
      const elementPosition = studyElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // ⬅️ 2. 선택된 카테고리 기준으로 포스트 필터링
  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

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
            이 포트폴리오는 Vercel에 Go (백엔드)와 React/Tailwind (프론트엔드)를
            <br />
            함께 배포하는 것을 테스트하기 위해 만들어졌습니다.
          </p>
        </section>

        {/* ⬅️ 3. "study" 섹션 UI 전체 수정 
        */}
        <section id="study" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold border-b-4 border-indigo-500 pb-4">
            공부 및 실습 (Study)
          </h2>
          
          {/* 3-1. 카테고리 탭 버튼 UI */}
          <div className="flex flex-wrap gap-4 my-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-semibold transition-all
                  ${selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 3-2. 필터링된 포스트 카드 목록 */}
          <div className="mt-8 grid gap-6">
            {isLoading ? (
              <p className="text-gray-500">포스트를 불러오는 중...</p>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                // 3-3. <a> 태그로 감싸서 GitHub 링크 연결
                <a
                  key={post.id}
                  href={post.linkUrl} // ⬅️ GitHub 링크
                  target="_blank"     // ⬅️ 새 탭에서 열기
                  rel="noopener noreferrer"
                  className="block bg-gray-800 p-6 rounded-lg shadow-xl transition-all hover:-translate-y-1 hover:shadow-indigo-500/30"
                >
                  <h3 className="text-2xl font-semibold text-indigo-400">{post.title}</h3>
                  {/* 요약글(content)이 있을 때만 표시 */}
                  {post.content && (
                    <p className="mt-2 text-gray-300 whitespace-pre-wrap">{post.content}</p>
                  )}
                </a>
              ))
            ) : (
              <p className="text-gray-500">
                {selectedCategory === 'All' 
                  ? "아직 작성된 게시글이 없습니다. '글쓰기' 탭에서 첫 글을 작성해보세요!"
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

        <section id="write" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold border-b-4 border-indigo-500 pb-4">
            새 글 작성하기 (관리자용)
          </h2>
          <div className="mt-8">
            <PostEditor onPostCreated={handlePostCreated} />
          </div>
        </section>

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