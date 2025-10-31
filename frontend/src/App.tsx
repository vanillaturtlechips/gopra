import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react'

//--- Post 구조체 (App.tsx 최상단) ---
interface Post {
  id: number;
  title: string;
  content: string;
}

//=================================================================
// 1. Header 컴포넌트 (App.tsx 파일 내부에 포함)
//=================================================================
// ( ... Header 컴포넌트 코드는 이전과 동일 ... )
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
          myong21.site
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
// 2. PostEditor 컴포넌트 (App.tsx 파일 내부에 포함)
//=================================================================
interface PresignedUploadResponse {
  uploadUrl: string;
  finalUrl: string;
}

interface PostEditorProps {
  onPostCreated: () => void;
}

function PostEditor({ onPostCreated }: PostEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ( ... handleSubmit 함수는 이전과 동일 ... )
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('제목과 내용을 모두 입력해주세요.');
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
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error('게시글 등록에 실패했습니다.');
      }

      setTitle('');
      setContent('');
      onPostCreated(); 
      
      alert('게시글이 성공적으로 등록되었습니다!');

    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
    } finally {
      setIsSubmitting(false);
    }
  };


  /**
   * 2. 이미지 업로드 핸들러 (수정됨)
   */
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // --- 1. Go API에 업로드 허가 요청 (file.size 추가) ---
      const presignResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // ⬇️ 1. 파일 크기(size)를 함께 전송
        body: JSON.stringify({ 
          filename: file.name,
          contentType: file.type,
          size: file.size // ⬅️ 파일 크기 추가
        }),
      });

      if (!presignResponse.ok) {
        const errText = await presignResponse.text();
        throw new Error(`이미지 업로드 URL 요청 실패: ${errText}`);
      }

      const data: PresignedUploadResponse = await presignResponse.json();
      
      // --- 2. Vercel Blob에 파일 직접 업로드 ---
      const uploadResponse = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type, 
          'x-ms-blob-type': 'BlockBlob',
          // ⬇️ 2. Vercel Blob API는 여기에 Content-Length도 요구함
          // (브라우저가 자동으로 추가해주는 경우가 많지만, 명시적으로 추가)
          'Content-Length': file.size.toString(),
        },
        body: file,
      });
      
      if (!uploadResponse.ok) {
         const errText = await uploadResponse.text();
         throw new Error(`Vercel Blob 업로드 실패: ${errText}`);
      }

      // --- 3. 에디터에 마크다운 삽입 ---
      const markdownImage = `\n![${file.name}](${data.finalUrl})\n`;
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

  // ( ... PostEditor의 나머지 함수들(insertTextAtCursor, triggerFileInput)과 JSX는 이전과 동일 ... )
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
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-300">
          내용 (Markdown 지원)
        </label>
        <textarea
          id="content"
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 마크다운 형식으로 입력하세요..."
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-3 font-mono"
        />
      </div>
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
          {isUploading ? '업로드 중...' : '이미지 첨부'}
        </button>
        {isUploading && <span className="ml-4 text-sm text-gray-400">이미지 처리 중...</span>}
      </div>
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
// 3. 메인 App 컴포넌트
//=================================================================
// ( ... App 컴포넌트의 나머지 코드는 이전과 동일 ... )
function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true); 

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

        <section id="study" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold border-b-4 border-indigo-500 pb-4">
            공부 및 실습 (Study)
          </h2>
          <div className="mt-8 grid gap-6">
            {isLoading ? (
              <p className="text-gray-500">포스트를 불러오는 중...</p>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="bg-gray-800 p-6 rounded-lg shadow-xl transition-transform hover:-translate-y-1">
                  <h3 className="text-2xl font-semibold text-indigo-400">{post.title}</h3>
                  <p className="mt-2 text-gray-300 whitespace-pre-wrap">{post.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">아직 작성된 게시글이 없습니다. '글쓰기' 탭에서 첫 글을 작성해보세요!</p>
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
            새 글 작성하기
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
        <p className="text-gray-500">© 2025 myong21.site. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App