const navLinks = [
  { to: 'about', label: '자기소개' },
  { to: 'study', label: '공부 및 실습' },
  { to: 'project', label: '프로젝트' },
  { to: 'write', label: '글쓰기' }, // ⬅️ '글쓰기' 섹션 링크 추가
  { to: 'contact', label: '연락처' },
]

export default function Header() {
  return (
    <header className="sticky top-0 w-full h-20 bg-gray-900 bg-opacity-80 backdrop-blur-sm shadow-lg z-50">
      <nav className="max-w-4xl mx-auto h-full flex items-center justify-between px-8">
        
        {/* 로고 (홈으로 스크롤) - <a> 태그로 변경 */}
        <a 
          href="#about" // ⬅️ 'to'를 'href'로 변경
          // smooth, duration, spy 속성 제거
          className="text-2xl font-bold text-indigo-400 cursor-pointer hover:text-indigo-300"
        >
          myong21.site
        </a>

        {/* 네비게이션 링크 - <a> 태그로 변경 */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={`#${link.to}`} // ⬅️ 'to'를 'href'로 변경
              // smooth, duration, spy, offset, activeClass 속성 제거
              className="text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

