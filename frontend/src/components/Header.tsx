import { Link } from 'react-scroll' // react-router-dom의 Link가 아닙니다!

const navLinks = [
  { to: 'about', label: '자기소개' },
  { to: 'study', label: '공부 및 실습' },
  { to: 'project', label: '프로젝트' },
  { to: 'contact', label: '연락처' },
]

export default function Header() {
  return (
    <header className="sticky top-0 w-full h-20 bg-gray-900 bg-opacity-80 backdrop-blur-sm shadow-lg z-50">
      <nav className="max-w-4xl mx-auto h-full flex items-center justify-between px-8">
        
        {/* 로고 (홈으로 스크롤) */}
        <Link 
          to="about" // '자기소개' 섹션(Element의 name)으로 이동
          smooth={true} // 부드럽게 스크롤
          duration={500} // 0.5초
          spy={true}
          className="text-2xl font-bold text-indigo-400 cursor-pointer hover:text-indigo-300"
        >
          myong21.site
        </Link>

        {/* 네비게이션 링크 */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              smooth={true}
              duration={500}
              spy={true}
              offset={-80} // 헤더 높이(80px)만큼 오프셋
              activeClass="text-indigo-400 border-b-2 border-indigo-400" // 활성 섹션일 때 스타일
              className="text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}