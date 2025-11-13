import { useState, useEffect } from 'react';
import Aurora from './components/Aurora';
import './components/Aurora.css';
import StaggeredMenu from './components/StaggeredMenu';

// lucide-react에서 실제로 존재하는 아이콘들만 임포트
import { 
  Cloud, Cpu, Container, GitBranch, Github, 
  Heart, Rocket, Server, Anchor, Box 
} from 'lucide-react';

// Post 인터페이스
interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  linkUrl: string;
}

// 카테고리 정규화 함수
function normalizeCategory(category: string): string {
  return category.toLowerCase().replace(/[\s-]/g, '');
}

// App 컴포넌트
export default function App() {
  
  // ❗️ STUDY 섹션 상태 정의 (Cannot find name 오류 해결)
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudyCategory, setSelectedStudyCategory] = useState('All'); 
  
  const studyCategories = [
    'All','devops','GOlang','DataBase','Network','Operating System','Data Structure and Algorithm'
  ];
  
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
  
  // ❗️ filteredPosts 로직 정의 (Cannot find name 오류 해결)
  const filteredPosts = selectedStudyCategory === 'All'
    ? posts
    : posts.filter(post =>
        normalizeCategory(post.category) === normalizeCategory(selectedStudyCategory)
      );
  
  // Skills: lucide-react에 실제로 있는 아이콘으로 수정
  const skills = [
    { name: 'AWS', icon: <Cloud size={32} /> },
    { name: 'Azure', icon: <Server size={32} /> }, 
    { name: 'Kubernetes', icon: <Anchor size={32} /> },
    { name: 'Docker', icon: <Container size={32} /> },
    { name: 'Helm', icon: <Box size={32} /> },
    { name: 'Terraform', icon: <GitBranch size={32} /> }, 
    { name: 'Ansible', icon: <Heart size={32} /> },
    { name: 'GitHub Actions', icon: <Rocket size={32} /> },
    { name: 'Jenkins', icon: <Cpu size={32} /> },
  ];

  const experiences = [
    {
      date: 'Sep 2025 - Present',
      title: 'DevOps Independent Projects',
      company: 'Self-Driven Projects • Remote',
      tasks: [
        'Setting up and automating CI/CD pipelines with GitHub Actions',
        'Implementing containerization workflows using Docker',
        'Exploring orchestration with Kubernetes for scalable deployments',
      ]
    },
  ];

  const [selectedProjectCategory, setSelectedProjectCategory] = useState('All');
  const projectCategories = [
    'All', 'AWS', 'Terraform', 'Docker', 'Kubernetes', 'Go', 'React'
  ];
  const projects = [
    { 
      title: 'Gopra Portfolio (This Site)', 
      description: 'Go + React 기반의 포트폴리오. Docker Compose로 빌드/배포 자동화.',
      image: '', tags: ['Go', 'React', 'Docker', 'Terraform'] 
    },
    { 
      title: 'Serverless Todo App', 
      description: 'AWS Lambda, API Gateway, DynamoDB를 사용한 서버리스 투두 앱.',
      image: '', tags: ['AWS'] 
    },
    { 
      title: 'K8s Cluster Setup', 
      description: 'Terraform과 Ansible을 사용하여 자동화된 K8s 클러스터 구축.',
      image: '', tags: ['Kubernetes', 'Terraform'] 
    },
  ];
  const filteredProjects = selectedProjectCategory === 'All'
    ? projects
    : projects.filter(p => p.tags.includes(selectedProjectCategory));

  const menuItems = [
    { label: 'About', ariaLabel: 'Go to About section', link: '#about' },
    { label: 'Skills', ariaLabel: 'Go to Skills section', link: '#skills' },
    { label: 'Experience', ariaLabel: 'Go to Experience section', link: '#experience' },
    { label: 'Projects', ariaLabel: 'Go to Projects section', link: '#projects' },
    { label: 'Study', ariaLabel: 'Go to Study section', link: '#study' },
    { label: 'Contact', ariaLabel: 'Go to Contact section', link: '#contact' },
  ];
  
  const GITHUB_URL = "https://github.com/your-github";

  const socialItems = [
    { label: 'GitHub', link: GITHUB_URL },
    { label: 'LinkedIn', link: 'https://linkedin.com/in/your-linkedin' },
  ];

  return (
    <>
      {/* 레이어 1: "순수 검은색 배경" (z-[-2]) */}
      <div 
        className="fixed inset-0 z-[-2] w-full h-full bg-black"
      />

      {/* 레이어 2: "오로라" (z-[-1]) */}
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} 
        amplitude={1.0}
        speed={0.2}
        blend={0.5}
      />
      
      {/* StaggeredMenu: 버튼/로고/패널 디자인 수정됨 */}
      <StaggeredMenu
        isFixed={true}
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#fff"
        openMenuButtonColor="#1a1a1a"
        changeMenuColorOnOpen={true}
        colors={['#ffffff', '#f0f0f0']}
        accentColor="#3A29FF"
        githubUrl={GITHUB_URL}
      />

      {/* 레이어 3: "콘텐츠" (z-0) */}
      <div className="relative z-0 w-full min-h-screen text-gray-300 font-sans">
        
        <main className="max-w-5xl mx-auto p-8">

          {/* About 섹션 */}
          <section id="about" className="min-h-screen flex flex-col items-center justify-center text-center pt-40 md:pt-20 -mt-20">
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight">
              Myong Ii Lee
            </h1>
            <p className="mt-6 text-2xl md:text-3xl font-medium text-indigo-400">
              DevSecOps & Cloud Engineer
            </p>
            <p className="mt-8 text-lg max-w-2xl text-gray-400">
              새로운 기술을 만날 때마다 심장이 뛰는 개발자, 이명일입니다. 보안 관제에서 시작된 왜?라는 질문을 품고 개발의 세계로 뛰어들었습니다.
              문제를 발견하는 것을 넘어, 직접 코드로 해결하고 더 나은 시스템을 만드는 과정에서 큰 성취감을 느낍니다.
              도전적인 과제를 해결하고, 아이디어를 현실로 구현하는 데 열정을 쏟고 있습니다.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="#contact"
                className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg transition-all 
                           hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-indigo-500/50"
              >
                Let's Connect
              </a>
              <a
                href={GITHUB_URL}
                target="_blank" rel="noopener noreferrer"
                title="GitHub"
                className="w-14 h-14 rounded-full bg-gray-700 bg-opacity-20 backdrop-blur-lg flex items-center justify-center 
                           text-white transition-all hover:bg-opacity-40 hover:shadow-xl hover:shadow-indigo-500/50 hover:-translate-y-1"
              >
                <Github size={28} />
              </a>
              <a
                href="https://linkedin.com/in/your-linkedin"
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                   className="w-6 h-6 mx-auto cursor-pointer"> 
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6.75m0 0l-3-3m3 3l3-3" />
              </svg>
              <span className="cursor-pointer">Scroll to explore</span>
            </div>
          </section>

          {/* Skills 섹션 */}
          <section id="skills" className="min-h-screen pt-20">
            <h2 className="text-4xl font-bold text-center text-white">
              Technical Skills
            </h2>
            <p className="mt-4 text-lg text-center text-gray-400 max-w-2xl mx-auto">
              A curated selection of my expertise in DevOps and Cloud Computing.
            </p>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 flex flex-col items-center justify-center gap-4 
                             transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/40 
                             ring-1 ring-white/10 text-indigo-300 hover:text-white"
                >
                  <div className="text-4xl">{skill.icon}</div> 
                  <p className="font-semibold text-white">{skill.name}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg transition-all 
                                 hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-indigo-500/50"
              >
                Show All (37)
              </button>
            </div>
          </section>

          {/* Experience 섹션 */}
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
                  <div key={index} className="relative group"> 
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

          {/* Projects 섹션 */}
          <section id="projects" className="min-h-screen pt-20">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Featured Projects
              </h2>
              <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Innovative solutions combining cloud infrastructure, automation, and modern development practices
              </p>
            </div>

            <div className="my-16 rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-8 backdrop-blur-xl shadow-2xl ring-1 ring-white/10 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h3 className="text-lg font-bold text-white">
                  Filter by Technology
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {projectCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedProjectCategory(category)}
                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform
                      ${selectedProjectCategory === category
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/50 scale-105'
                        : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/80 hover:shadow-lg hover:scale-105 hover:text-white'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <a
                  key={project.title}
                  href="#"
                  className="group relative block rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-gray-800/50 backdrop-blur-lg ring-1 ring-white/10 border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:shadow-indigo-500/30 transition-all duration-500">
                    <div className="relative h-48 bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                      {project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="text-center">
                          <svg className="w-20 h-20 mx-auto text-indigo-400/50 mb-3 group-hover:scale-110 group-hover:text-indigo-400 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">Project Preview</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-900/50 to-purple-900/50 text-indigo-300 font-medium text-xs ring-1 ring-indigo-500/30 group-hover:ring-indigo-400/50 transition-all"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                        <span className="text-xs text-gray-500 group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </span>
                        <svg className="w-5 h-5 text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/0 group-hover:ring-white/20 transition-all duration-500 pointer-events-none" />
                  </div>
                </a>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-20">
                <svg className="w-24 h-24 mx-auto text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-xl text-gray-500">No projects found for this category</p>
                <p className="text-sm text-gray-600 mt-2">Try selecting a different filter</p>
              </div>
            )}
          </section>

          <section id="study" className="min-h-screen pt-20">
            <h2 className="text-4xl font-bold text-center text-white">
              My Study & Blogs
            </h2>
            <p className="mt-4 text-lg text-center text-gray-400 max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on DevOps, cloud technologies, and software development.
            </p>
            <div className="my-12 rounded-2xl bg-gray-600/20 p-6 md:p-8 backdrop-blur-xl shadow-xl ring-1 ring-white/10">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">
                Filter by tags
              </h3>
              <div className="flex flex-wrap gap-3">
                {studyCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedStudyCategory(category)}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all
                      ${selectedStudyCategory === category
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-gray-600 hover:shadow-lg hover:shadow-indigo-500/30'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              '{selectedStudyCategory}' 카테고리 ({filteredPosts.length}개 게시글)
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
                    className="block bg-gray-700/50 rounded-lg shadow-xl transition-all 
                               hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/40 
                               overflow-hidden ring-1 ring-white/10"
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
                  {selectedStudyCategory === 'All'
                    ? "아직 작성된 게시글이 없습니다."
                    : `'${selectedStudyCategory}' 카테고리에 게시글이 없습니다.`
                  }
                </p>
              )}
            </div>
          </section>

          <section id="contact" className="min-h-screen pt-20">
            <h2 className="text-4xl font-bold text-center text-white">
              Connect With Me
            </h2>
            <p className="mt-4 text-lg text-center text-gray-400 max-w-2xl mx-auto">
              Have a project in mind or a question? Reach out and let's turn your ideas into reality.
            </p>
            <div className="mt-16 max-w-4xl mx-auto bg-gray-700/20 backdrop-blur-xl rounded-xl shadow-2xl p-8 md:p-12 ring-1 ring-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Contact Info</h3>
                  <div>
                    <p className="text-gray-400">Email Me:</p>
                    <a href="mailto:your-email@gmail.com" className="text-indigo-400 font-medium hover:underline">
                      your-email@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-400">GitHub:</p>
                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-medium hover:underline">
                      github.com/your-github
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

        <footer className="text-center p-8 border-t border-gray-700 mt-20">
          <p className="text-gray-500">© 2025 myong12.site All rights reserved.</p>
        </footer>
      </div>
    </>
  )
}