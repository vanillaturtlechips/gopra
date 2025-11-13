import { useState, useEffect } from 'react';
import Aurora from './components/Aurora';
import './components/Aurora.css';
import StaggeredMenu from './components/StaggeredMenu';
import FlowingMenu from './components/FlowingMenu'; 
import Lanyard from './components/Lanyard';
import { Github } from 'lucide-react';
import { 
  SiGo, SiNextdotjs, SiNodedotjs, SiPython, SiTypescript, 
  SiDocker, SiKubernetes, SiArgo, SiHelm, SiGithubactions, 
  SiTerraform 
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { VscShield } from "react-icons/vsc";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  linkUrl: string;
}

function normalizeCategory(category: string): string {
  return category.toLowerCase().replace(/[\s-]/g, '');
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedStudyCategory, setSelectedStudyCategory] = useState('All'); 
  const studyCategories = [
    'All','devops','GOlang','DataBase','Network','Operating System','Data Structure and Algorithm'
  ];

  const [activeSkillTab, setActiveSkillTab] = useState('All');
  const skillCategories = ['All', 'Languages', 'Cloud & Infra', 'DevSecOps'];

  const skills = [
    { name: 'GoLang', icon: <SiGo />, color: '#00ADD8', category: 'Languages' },
    { name: 'Python', icon: <SiPython />, color: '#3776AB', category: 'Languages' },
    { name: 'TypeScript', icon: <SiTypescript />, color: '#3178C6', category: 'Languages' },
    { name: 'Node.js', icon: <SiNodedotjs />, color: '#339933', category: 'Languages' },
    { name: 'Next.js', icon: <SiNextdotjs />, color: '#ffffff', category: 'Languages' },
    
    { name: 'AWS', icon: <FaAws />, color: '#FF9900', category: 'Cloud & Infra' },
    { name: 'Terraform', icon: <SiTerraform />, color: '#7B42BC', category: 'Cloud & Infra' },
    { name: 'Docker', icon: <SiDocker />, color: '#2496ED', category: 'Cloud & Infra' },
    { name: 'Kubernetes', icon: <SiKubernetes />, color: '#326CE5', category: 'Cloud & Infra' },
    { name: 'Helm Chart', icon: <SiHelm />, color: '#0F1689', category: 'Cloud & Infra' },
    
    { name: 'ArgoCD', icon: <SiArgo />, color: '#EF7B4D', category: 'DevSecOps' },
    { name: 'GitHub Actions', icon: <SiGithubactions />, color: '#2088FF', category: 'DevSecOps' },
    { name: 'Semgrep', icon: <VscShield />, color: '#358A7F', category: 'DevSecOps' },
    { name: 'Trivy', icon: <VscShield />, color: '#00A0E1', category: 'DevSecOps' },
  ];

  const filteredSkills = activeSkillTab === 'All' 
    ? skills 
    : skills.filter(s => s.category === activeSkillTab);
  
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
  
  const filteredPosts = selectedStudyCategory === 'All'
    ? posts
    : posts.filter(post =>
        normalizeCategory(post.category) === normalizeCategory(selectedStudyCategory)
      );
  
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
  
  const categoryImages: Record<string, string> = {
    'devops': 'https://images.unsplash.com/photo-1667372393119-c81c0e83039d?q=80&w=2000&auto=format&fit=crop',
    'GOlang': 'https://images.unsplash.com/photo-1649180556628-9ba704115795?q=80&w=2000&auto=format&fit=crop',
    'DataBase': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=2000&auto=format&fit=crop',
    'Network': 'https://images.unsplash.com/photo-1558494949-efc53075a3bd?q=80&w=2000&auto=format&fit=crop',
    'Operating System': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2000&auto=format&fit=crop',
    'Data Structure and Algorithm': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2000&auto=format&fit=crop'
  };

  return (
    <>
      <div className="fixed inset-0 z-[-2] w-full h-full bg-black" />

      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} 
        amplitude={1.0}
        speed={0.2}
        blend={0.5}
      />
      
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#fff"
        openMenuButtonColor="#1a1a1a"
        changeMenuColorOnOpen={true}
        accentColor="#3A29FF"
        githubUrl={GITHUB_URL}
      />

      <div className="relative z-0 w-full min-h-screen text-gray-300 font-sans">
        
        <main className="max-w-6xl mx-auto p-8">

          {/* About Section - 첫 화면에 카드 표시 */}
          <section id="about" className="min-h-screen flex flex-col items-center justify-center text-center pt-40 md:pt-20 -mt-20 relative overflow-hidden">
            
            {/* Lanyard - 화면 상단에 고정 */}
            <div className="absolute top-0 left-0 right-0 h-[70vh] z-20 pointer-events-none">
              <div className="w-full h-full pointer-events-auto">
                <Lanyard 
                  position={[0, 0, 15]} 
                  gravity={[0, -40, 0]} 
                  fov={25}
                  transparent={true}
                />
              </div>
            </div>

            {/* 텍스트 컨텐츠 */}
            <div className="relative z-10 pointer-events-none select-none mt-32">
              <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight pointer-events-auto">
                Myong Ii Lee
              </h1>
              <p className="mt-6 text-2xl md:text-3xl font-medium text-indigo-400 pointer-events-auto">
                DevSecOps & Cloud Engineer
              </p>
              <p className="mt-8 text-lg max-w-2xl text-gray-400 mx-auto pointer-events-auto">
                새로운 기술을 만날 때마다 심장이 뛰는 개발자, 이명일입니다. 보안 관제에서 시작된 왜?라는 질문을 품고 개발의 세계로 뛰어들었습니다.
                문제를 발견하는 것을 넘어, 직접 코드로 해결하고 더 나은 시스템을 만드는 과정에서 큰 성취감을 느낍니다.
                도전적인 과제를 해결하고, 아이디어를 현실로 구현하는 데 열정을 쏟고 있습니다.
              </p>
            </div>

            {/* 버튼들 */}
            <div className="relative z-30 mt-10 flex items-center justify-center gap-4">
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
            <div className="absolute bottom-10 text-gray-500 animate-bounce z-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                   className="w-6 h-6 mx-auto cursor-pointer"> 
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6.75m0 0l-3-3m3 3l3-3" />
              </svg>
              <span className="cursor-pointer">Scroll to explore</span>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="min-h-screen pt-20 relative flex flex-col items-center">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                Technical Arsenal
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                안정적이고 확장 가능한 시스템을 구축하기 위한 저의 무기들입니다.<br/>
                <span className="text-sm text-gray-500">아이콘에 마우스를 올려보세요.</span>
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {skillCategories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSkillTab(tab)}
                  className={`
                    px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border
                    ${activeSkillTab === tab 
                      ? 'bg-white/10 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105' 
                      : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 w-full px-4">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.name}
                  className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-white/10 hover:bg-white/[0.05] hover:-translate-y-2"
                >
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
                    style={{ backgroundColor: skill.color }}
                  />
                  
                  <div 
                    className="relative z-10 text-5xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    style={{ color: skill.color }}
                  >
                    <div className="transition-transform duration-500 group-hover:animate-pulse">
                      {skill.icon}
                    </div>
                  </div>

                  <h3 className="relative z-10 text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">
                    {skill.name}
                  </h3>
                  
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent group-hover:w-1/2 transition-all duration-500 opacity-50"
                    style={{ 
                      backgroundImage: `linear-gradient(90deg, transparent, ${skill.color}, transparent)` 
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Experience Section */}
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

          {/* Projects Section */}
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

          {/* Study Section */}
          <section id="study" className="min-h-screen pt-20">
            <h2 className="text-4xl font-bold text-center text-white">
              My Study & Blogs
            </h2>
            <p className="mt-4 text-lg text-center text-gray-400 max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on DevOps, cloud technologies, and software development.
            </p>
            
            <div className="my-12">
              <FlowingMenu 
                items={studyCategories} 
                selectedItem={selectedStudyCategory}
                onSelect={setSelectedStudyCategory}
                images={categoryImages}
              />
            </div>
            
            <p className="text-sm text-gray-500 mb-6 mt-8">
              '{selectedStudyCategory}' 카테고리 ({filteredPosts.length}개 게시글)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                <p className="text-gray-500 col-span-full text-center py-10">포스트를 불러오는 중...</p>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <a
                    key={post.id}
                    href={post.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block rounded-2xl overflow-hidden shadow-xl 
                               transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl 
                               bg-gradient-to-br from-gray-800/50 to-gray-900/50 ring-1 ring-white/10"
                    style={{ 
                      animation: 'slideInUp 0.5s ease-out forwards',
                      animationDelay: `${index * 100}ms`, 
                      opacity: 0 
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative p-6 space-y-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                       bg-indigo-900/50 text-indigo-300 ring-1 ring-indigo-500/30">
                        {post.category}
                      </span>
                      <h3 className="mt-4 text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text 
                                     group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 
                                     transition-all duration-300">
                        {post.title}
                      </h3>
                      {post.content && (
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors">
                          {post.content}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                        <span className="text-xs text-gray-500 group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Post
                        </span>
                        <svg className="w-5 h-5 text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center py-10">
                  {selectedStudyCategory === 'All'
                    ? "아직 작성된 게시글이 없습니다."
                    : `'${selectedStudyCategory}' 카테고리에 게시글이 없습니다.`
                  }
                </p>
              )}
            </div>
          </section>

          {/* Contact Section - 마지막 섹션에도 카드 표시 */}
          <section id="contact" className="min-h-screen pt-20 relative">
            <h2 className="text-4xl font-bold text-center text-white mb-4">
              Connect With Me
            </h2>
            <p className="text-lg text-center text-gray-400 max-w-2xl mx-auto mb-12">
              Trigger a communication workflow to get in touch.
            </p>
            
            {/* Contact 섹션 카드 - 더블클릭으로 나타나는 기능 추가 가능 */}
            <div className="relative h-[600px] w-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="text-gray-500 mb-8">
                    <p className="text-sm mb-4">💌 명함을 더블클릭해서 연락처를 확인하세요!</p>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <a
                      href="mailto:your-email@example.com"
                      className="px-6 py-3 rounded-full bg-indigo-600/20 text-indigo-300 font-semibold 
                                 border border-indigo-500/30 transition-all hover:bg-indigo-600 hover:text-white 
                                 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/50"
                    >
                      📧 Email
                    </a>
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full bg-gray-700/20 text-gray-300 font-semibold 
                                 border border-gray-600/30 transition-all hover:bg-gray-700 hover:text-white 
                                 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-500/50"
                    >
                      <Github className="inline mr-2" size={18} />
                      GitHub
                    </a>
                    <a
                      href="https://linkedin.com/in/your-linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full bg-blue-600/20 text-blue-300 font-semibold 
                                 border border-blue-500/30 transition-all hover:bg-blue-600 hover:text-white 
                                 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/50"
                    >
                      💼 LinkedIn
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact 섹션의 Lanyard */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full pointer-events-auto">
                  <Lanyard 
                    position={[0, 0, 15]} 
                    gravity={[0, -40, 0]} 
                    fov={25}
                    transparent={true}
                    onCardDoubleClick={() => {
                      alert('📇 Contact Info:\n\nEmail: your-email@example.com\nGitHub: github.com/your-github\nLinkedIn: linkedin.com/in/your-linkedin');
                    }}
                  />
                </div>
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