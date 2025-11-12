import { useState, useEffect } from 'react';

// 1. Post 인터페이스
interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  linkUrl: string;
}

// 2. 네비게이션 링크
const navLinks = [
  { to: 'about', label: 'About' },
  { to: 'skills', label: 'Skills' },
  { to: 'experience', label: 'Experience' },
  { to: 'study', label: 'Study' },
  { to: 'contact', label: 'Contact' },
];

// 3. 스크롤 유틸리티 함수
const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
  e.preventDefault();
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    const headerOffset = 80; // 헤더 높이
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};


// 4. Header 컴포넌트
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    handleScrollClick(e, targetId);
    setIsMenuOpen(false); 
  };

  return (
    <header className="sticky top-0 w-full h-20 bg-gray-900 bg-opacity-80 backdrop-blur-sm shadow-lg z-50">
      <nav className="max-w-5xl mx-auto h-full flex items-center justify-between px-8">
        <a
          href="#about"
          onClick={(e) => onLinkClick(e, 'about')} 
          className="text-2xl font-bold text-indigo-400 cursor-pointer hover:text-indigo-300"
        >
          myong12.site
        </a>

        {/* 데스크탑 메뉴 */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={`#${link.to}`}
              onClick={(e) => onLinkClick(e, link.to)}
              className="text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors font-medium"
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
      
      {/* 모바일 메뉴 패널 */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-gray-800 shadow-lg py-2">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={`#${link.to}`}
              onClick={(e) => onLinkClick(e, link.to)}
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

// 5. 스터디 카테고리
function normalizeCategory(category: string): string {
  return category.toLowerCase().replace(/[\s-]/g, '');
}
const categories = [
  'All',
  'devops',
  'GOlang',
  'DataBase',
  'Network',
  'Operating System',
  'Data Structure and Algorithm'
];

// 6. App 컴포넌트
export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchPosts = () => {
    setIsLoading(true);
    fetch('/api/posts')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
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

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(post =>
        normalizeCategory(post.category) === normalizeCategory(selectedCategory)
      );
  
  // 하드코딩된 스킬 데이터
  const skills = [
    { name: 'AWS', icon: '☁️' },
    { name: 'Azure', icon: 'Ⓜ️' },
    { name: 'Kubernetes', icon: '☸️' },
    { name: 'Docker', icon: '🐳' },
    { name: 'Helm', icon: '⛑️' },
    { name: 'Terraform', icon: '🔩' },
    { name: 'Ansible', icon: '🅰️' },
    { name: 'GitHub Actions', icon: '🚀' },
    { name: 'Jenkins', icon: '🤵' },
    { name: 'GitLab CI', icon: '🦊' },
    { name: 'ArgoCD', icon: '🔄' },
    { name: 'Prometheus', icon: '📊' },
  ];

  // 하드코딩된 경험 데이터
  const experiences = [
    {
      date: 'Sep 2025 - Present',
      title: 'DevOps Independent Projects',
      company: 'Self-Driven Projects • Remote',
      tasks: [
        'Setting up and automating CI/CD pipelines with GitHub Actions',
        'Implementing containerization workflows using Docker',
        'Exploring orchestration with Kubernetes for scalable deployments',
        'Deploying applications to cloud environments (AWS & Azure)',
        'Applying Infrastructure as Code (IaC) principles with Terraform and Ansible',
        'Configuring monitoring & observability using Prometheus and Grafana'
      ]
    },
  ];

  return (
    // ⬇️ [디자인 수정 1]
    // 배경에 미묘한 그라데이션을 추가하여 깊이감을 줍니다.
    <div className="w-full min-h-screen bg-[#0f172a] text-gray-300 font-sans
                    bg-gradient-to-tr from-[#0f172a] via-[#0f172a] to-[#1e1b4b]">
      
      <Header />

      <main className="max-w-5xl mx-auto p-8">

        {/* =================================
        섹션 1: About (Hero)
        =================================
        */}
        <section id="about" className="min-h-screen flex flex-col items-center justify-center text-center -mt-20">
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight">
            Myong G. Kim
          </h1>
          <p className="mt-6 text-2xl md:text-3xl font-medium text-indigo-400">
            DevOps & Cloud Engineer
          </p>
          <p className="mt-8 text-lg max-w-2xl text-gray-400">
            새로운 기술을 만나면 설레는 개발자입니다.
            이 포트폴리오는 Vercel에서 벗어나 Go (백엔드)와 React (프론트엔드)를
            직접 VPS에 배포하기 위해 만들어졌습니다. (GitOps 방식)
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="#contact"
              onClick={(e) => handleScrollClick(e, 'contact')}
              className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg transition-all 
                         hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-indigo-500/50" // ⬅️ Glow 효과
            >
              Let's Connect
            </a>

            {/* ⬇️ [디자인 수정 2] "GH" 텍스트 대신 실제 SVG 아이콘 사용 */}
            <a
              href="https://github.com/your-github" // TODO: 본인 GitHub 주소로 변경
              target="_blank" rel="noopener noreferrer"
              title="GitHub"
              className="w-14 h-14 rounded-full bg-gray-700 bg-opacity-20 backdrop-blur-lg flex items-center justify-center 
                         text-white transition-all hover:bg-opacity-40 hover:shadow-xl hover:shadow-indigo-500/50 hover:-translate-y-1"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 16.418 5.136 20.16 9.25 21.508V18.66C7.545 19.065 6.833 17.81 6.57 17.15C6.38 16.665 5.86 15.69 5.405 15.395C5.04 15.165 4.5 14.65 5.385 14.63C6.275 14.605 6.78 15.42 7.02 15.825C7.99 17.48 9.7 17.02 10.365 16.72C10.455 16.08 10.72 15.615 11.025 15.345C8.82 15.105 6.48 14.24 6.48 10.815C6.48 9.87 6.825 9.09 7.37 8.5C7.28 8.265 6.97 7.32 7.465 6.135C7.465 6.135 8.29 5.88 10.35 7.215C11.14 7.005 11.985 6.9 12.83 6.9C13.675 6.9 14.52 7.005 15.31 7.215C17.37 5.88 18.195 6.135 18.195 6.135C18.69 7.32 18.38 8.265 18.29 8.5C18.835 9.09 19.18 9.87 19.18 10.815C19.18 14.25 16.83 15.105 14.625 15.345C15.015 15.69 15.3 16.32 15.3 17.22V21.508C19.414 20.16 22.55 16.418 22.55 12C22.55 6.477 18.073 2 12.55 2H12Z" />
              </svg>
            </a>
            
            {/* ⬇️ [디자인 수정 2] "IN" 텍스트 대신 실제 SVG 아이콘 사용 */}
            <a
              href="https://linkedin.com/in/your-linkedin" // TODO: 본인 LinkedIn 주소로 변경
              target="_blank" rel="noopener noreferrer"
              title="LinkedIn"
              className="w-14 h-14 rounded-full bg-gray-700 bg-opacity-20 backdrop-blur-lg flex items-center justify-center 
                         text-white transition-all hover:bg-opacity-40 hover:shadow-xl hover:shadow-indigo-500/50 hover:-translate-y-1"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0H5C2.239 0 0 2.239 0 5V19C0 21.761 2.239 24 5 24H19C21.761 24 24 21.761 24 19V5C24 2.239 21.761 0 19 0ZM8 19H5V8H8V19ZM6.5 6.732C5.534 6.732 4.75 5.942 4.75 4.968C4.75 3.994 5.534 3.204 6.5 3.204C7.466 3.204 8.25 3.994 8.25 4.968C8.25 5.942 7.467 6.732 6.5 6.732ZM20 19H17V13.396C17 10.028 13 10.283 13 13.396V19H10V8H13V9.765C13.971 8.169 17 7.917 17 11.036V19Z" />
              </svg>
            </a>
          </div>

          <div className="absolute bottom-10 text-gray-500 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6.75m0 0l-3-3m3 3l3-3" />
            </svg>
            Scroll to explore
          </div>
        </section>

        {/* =================================
        섹션 2: Skills
        =================================
        */}
        <section id="skills" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold text-center text-white">
            Technical Skills
          </h2>
          <p className="mt-4 text-lg text-center text-gray-400 max-w-2xl mx-auto">
            A curated selection of my expertise in DevOps and Cloud Computing.
          </p>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="bg-gray-700 bg-opacity-20 backdrop-blur-lg rounded-xl p-6 flex flex-col items-center justify-center gap-4 
                           transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/40" // ⬅️ Glow 효과
              >
                <div className="text-4xl">{skill.icon}</div> 
                <p className="font-semibold text-white">{skill.name}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg transition-all 
                               hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-indigo-500/50" // ⬅️ Glow 효과
            >
              Show All (37)
            </button>
          </div>
        </section>

        {/* =================================
        섹션 3: Experience (수직 타임라인)
        =================================
        */}
        <section id="experience" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold text-center text-white">
            Professional Experience & Projects
          </h2>
          <p className="mt-4 text-lg text-center text-gray-400 max-w-2xl mx-auto">
            Highlights of my career and key projects showcasing my skills & impact.
          </p>
          
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="relative border-l-2 border-gray-700 ml-6 space-y-16 py-10">
              
              {experiences.map((exp, index) => (
                <div key={index} className="relative group"> {/* ⬅️ group 추가 */}
                  <div className="absolute -left-3.5 mt-2 w-7 h-7 bg-indigo-600 rounded-full border-4 border-gray-800
                              transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/50" />
                  
                  <div className="ml-10 transition-all group-hover:pl-2">
                    <p className="text-sm font-semibold text-indigo-400">{exp.date}</p>
                    <h3 className="mt-1 text-2xl font-bold text-white">{exp.title}</h3>
                    <p className="mt-1 text-md text-gray-400">{exp.company}</p>
                    <ul className="mt-4 space-y-2 text-gray-300 list-disc list-inside">
                      {exp.tasks.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* =================================
        섹션 4: Study (글래스모피즘 필터 적용)
        =================================
        */}
        <section id="study" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold text-center text-white">
            My Study & Blogs
          </h2>
          <p className="mt-4 text-lg text-center text-gray-400 max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on DevOps, cloud technologies, and software development.
          </p>

          <div className="my-12 rounded-2xl bg-gray-700 bg-opacity-20 p-6 md:p-8 backdrop-blur-lg shadow-xl ring-1 ring-gray-500/20">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">
              Filter by tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all
                    ${selectedCategory === category
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-gray-600 hover:shadow-lg hover:shadow-indigo-500/30' // ⬅️ Glow 효과
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            '{selectedCategory}' 카테고리 ({filteredPosts.length}개 게시글)
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {isLoading ? (
              <p className="text-gray-500 col-span-full">포스트를 불러오는 중...</p>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-800 rounded-lg shadow-xl transition-all 
                             hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/40 overflow-hidden" // ⬅️ Glow 효과
                >
                  <div className="p-6">
                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-900 text-indigo-300 font-medium">
                      {post.category}
                    </span>
                    <h3 className="mt-4 text-2xl font-semibold text-white">{post.title}</h3>
                    {post.content && (
                      <p className="mt-2 text-gray-400 whitespace-pre-wrap">{post.content}</p>
                    )}
                  </div>
                </a>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">
                {selectedCategory === 'All'
                  ? "아직 작성된 게시글이 없습니다."
                  : `'${selectedCategory}' 카테고리에 게시글이 없습니다.`
                }
              </p>
            )}
          </div>
        </section>

        {/* =================================
        섹션 5: Contact
        =================================
        */}
        <section id="contact" className="min-h-screen pt-20">
          <h2 className="text-4xl font-bold text-center text-white">
            Connect With Me
          </h2>
          <p className="mt-4 text-lg text-center text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or a question? Reach out and let's turn your ideas into reality.
          </p>

          <div className="mt-16 max-w-4xl mx-auto bg-gray-700 bg-opacity-20 backdrop-blur-lg rounded-xl shadow-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Contact Info</h3>
                <div>
                  <p className="text-gray-400">Email Me:</p>
                  <a href="mailto:your-email@gmail.com" className="text-indigo-400 font-medium hover:underline">
                    your-email@gmail.com {/* TODO: 이메일 변경 */}
                  </a>
                </div>
                <div>
                  <p className="text-gray-400">GitHub:</p>
                  <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-medium hover:underline">
                    github.com/your-github {/* TODO: 깃허브 변경 */}
                  </a>
                </div>
              </div>

              <form className="md:col-span-2 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                  <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm 
                                                         focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg focus:shadow-indigo-500/40 p-3 transition-all" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                  <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm 
                                                          focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg focus:shadow-indigo-500/40 p-3 transition-all" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300">Your Short Message</label>
                  <textarea id="message" rows={5} className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm 
                                                            focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg focus:shadow-indigo-500/40 p-3 transition-all" />
                </div>
                <div className="text-right">
                  <button type="submit" className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg 
                                                    transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/50">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

      </main>

      {/* =================================
      푸터
      =================================
      */}
      <footer className="text-center p-8 border-t border-gray-700 mt-20">
        <p className="text-gray-500">© 2025 myong12.site All rights reserved.</p>
      </footer>
    </div>
  )
}
