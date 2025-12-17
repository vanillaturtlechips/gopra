import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import Aurora from './components/Aurora';
import './components/Aurora.css';
import StaggeredMenu from './components/StaggeredMenu';
import FlowingMenu from './components/FlowingMenu'; 
import { Github, Check, Mail, ArrowRight, Linkedin, Terminal, Cpu, Globe, Code2 } from 'lucide-react';
import { 
  SiGo, SiNextdotjs, SiNodedotjs, SiPython, SiTypescript, 
  SiDocker, SiKubernetes, SiArgo, SiHelm, SiGithubactions, 
  SiTerraform, SiRust, SiOracle 
} from "react-icons/si"; 
import { FaAws, FaBeer } from "react-icons/fa";
import { VscShield } from "react-icons/vsc";

// --- Types ---
interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  linkUrl: string;
}

// --- Constants ---
// ✅ [수정 1] Aurora 색상 배열을 컴포넌트 외부 상수로 분리 (리렌더링 시 깜빡임 방지)
const AURORA_COLORS = ["#3A29FF", "#FF94B4", "#FF3232"];

// --- Helper Functions ---
function normalizeCategory(category: string): string {
  return category.toLowerCase().replace(/[\s-]/g, '');
}

const MouseSpotlight = () => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (divRef.current) {
        divRef.current.style.background = `radial-gradient(600px at ${e.clientX}px ${e.clientY}px, rgba(29, 78, 216, 0.15), transparent 80%)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={divRef}
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
    />
  );
};

// 스크롤 등장 효과
const FadeInSection = ({ children, delay = 0 }: { children: ReactNode, delay?: number }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (domRef.current) observer.unobserve(domRef.current);
        }
      });
    });
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      {children}
    </div>
  );
};

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // 타이핑 효과 텍스트 (간단화)
  const typeWriterText = "DevSecOps Engineer"; 

  const [selectedStudyCategory, setSelectedStudyCategory] = useState('All'); 
  const studyCategories = [
    'All','devops','GOlang','DataBase','Network','Operating System','Data Structure and Algorithm'
  ];

  const [activeSkillTab, setActiveSkillTab] = useState('All');
  const skillCategories = ['All', 'Languages', 'Cloud & Infra', 'DevSecOps'];

  const skills = [
    { name: 'GoLang', icon: <SiGo />, color: '#00ADD8', category: 'Languages' },
    { name: 'Rust', icon: <SiRust />, color: '#DEA584', category: 'Languages' },
    { name: 'Python', icon: <SiPython />, color: '#3776AB', category: 'Languages' },
    { name: 'TypeScript', icon: <SiTypescript />, color: '#3178C6', category: 'Languages' },
    { name: 'Node.js', icon: <SiNodedotjs />, color: '#339933', category: 'Languages' },
    { name: 'Next.js', icon: <SiNextdotjs />, color: '#ffffff', category: 'Languages' },
    
    { name: 'AWS', icon: <FaAws />, color: '#FF9900', category: 'Cloud & Infra' },
    { name: 'Oracle Cloud', icon: <SiOracle />, color: '#F80000', category: 'Cloud & Infra' },
    { name: 'Terraform', icon: <SiTerraform />, color: '#7B42BC', category: 'Cloud & Infra' },
    { name: 'Docker', icon: <SiDocker />, color: '#2496ED', category: 'Cloud & Infra' },
    { name: 'Kubernetes', icon: <SiKubernetes />, color: '#326CE5', category: 'Cloud & Infra' },
    { name: 'Helm Chart', icon: <SiHelm />, color: '#0F1689', category: 'Cloud & Infra' },
    
    { name: 'eBPF', icon: <FaBeer />, color: '#EB5C1C', category: 'DevSecOps' },
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
  
  useEffect(() => { fetchPosts(); }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("your-email@example.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const filteredPosts = selectedStudyCategory === 'All'
    ? posts
    : posts.filter(post => normalizeCategory(post.category) === normalizeCategory(selectedStudyCategory));
  
  const experiences = [
    {
      date: 'Sep 2025 - Present',
      title: 'DevOps Independent Projects',
      company: 'Self-Driven Projects • Remote',
      description: 'Building scalable infrastructure and automated pipelines.',
      tasks: [
        'Architecting CI/CD pipelines reducing deployment time by 40% using GitHub Actions',
        'Orchestrating microservices with Kubernetes & Helm for high availability',
        'Implementing Infrastructure as Code (IaC) with Terraform regarding AWS best practices',
      ]
    },
  ];

  const [selectedProjectCategory, setSelectedProjectCategory] = useState('All');
  const projectCategories = ['All', 'AWS', 'Terraform', 'Docker', 'Kubernetes', 'Go', 'React'];
  const projects = [
    { 
      title: 'Gopra Portfolio', 
      description: 'Modern interactive portfolio built with React, Go, and Docker. Features clean glassmorphism UI and automated deployment pipelines.',
      image: '', tags: ['Go', 'React', 'Docker', 'Terraform'],
      icon: <Globe size={40} />
    },
    { 
      title: 'Serverless Todo', 
      description: 'High-performance serverless application using AWS Lambda, API Gateway, and DynamoDB. Fully automated infrastructure.',
      image: '', tags: ['AWS'],
      icon: <Cpu size={40} />
    },
    { 
      title: 'K8s Cluster Auto', 
      description: 'Production-grade Kubernetes cluster provisioning using Terraform and Ansible. Includes monitoring stack setup.',
      image: '', tags: ['Kubernetes', 'Terraform'],
      icon: <Terminal size={40} />
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
  
  const GITHUB_URL = "https://github.com/vanillaturtlechips";
  const socialItems = [{ label: 'GitHub', link: GITHUB_URL }, { label: 'LinkedIn', link: 'https://www.linkedin.com/in/%EB%AA%85%EC%9D%BC-%EC%9D%B4-342075399/' }];
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
      <MouseSpotlight />
      
      <div className="fixed inset-0 z-[-2] w-full h-full bg-[#0a0a0a]" />

      <Aurora
        colorStops={AURORA_COLORS} // ✅ [수정 1] 상수로 선언된 배열 전달
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

      <div className="relative z-0 w-full min-h-screen text-gray-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-8">

          {/* About Section */}
          <section id="about" className="min-h-screen flex flex-col items-start justify-center relative overflow-hidden">
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            
            <FadeInSection>
              <div className="relative z-10 max-w-4xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] w-12 bg-indigo-500" />
                  <span className="text-indigo-400 font-medium tracking-wider text-sm uppercase">Portfolio 2025</span>
                </div>
                
                <h1 className="text-7xl md:text-9xl font-bold text-white tracking-tighter mb-8 font-heading leading-[0.9]">
                  Myong Ii Lee
                </h1>
                
                <div className="h-20 md:h-24 mb-8">
                  <span className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 font-heading">
                    I am a {typeWriterText}
                  </span>
                </div>

                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed font-light mb-12">
                  새로운 기술을 만날 때마다 심장이 뛰는 개발자입니다. 
                  <strong className="text-white font-medium"> 보안 관제</strong>에서 시작된 호기심을 
                  <strong className="text-white font-medium"> 클라우드 아키텍처</strong>와 
                  <strong className="text-white font-medium"> 자동화</strong>로 확장시켰습니다.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a href="#contact" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold transition-all hover:bg-indigo-50">
                    Let's Connect
                    <ArrowRight className="inline ml-2 transition-transform group-hover:translate-x-1" size={20} />
                  </a>
                  <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="px-8 py-4 border border-white/20 rounded-full font-medium hover:bg-white/10 transition-all text-white flex items-center gap-2">
                    <Github size={20} /> GitHub
                  </a>
                </div>
              </div>
            </FadeInSection>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
               <span className="text-xs uppercase tracking-widest">Scroll</span>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="min-h-screen pt-32 relative flex flex-col">
            <FadeInSection>
              <div className="mb-16">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-heading">Technical Arsenal</h2>
                <p className="text-xl text-gray-400 max-w-2xl">
                  안정적이고 확장 가능한 시스템을 구축하기 위한 저의 무기들입니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-12">
                {skillCategories.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSkillTab(tab)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-sm
                      ${activeSkillTab === tab 
                        ? 'bg-white/10 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(79,70,229,0.2)]' 
                        : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredSkills.map((skill, idx) => (
                  <FadeInSection delay={idx * 50} key={skill.name}>
                    <div className="group relative h-40 flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-1">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                           style={{ background: `radial-gradient(circle at center, ${skill.color}, transparent 70%)` }} />
                      <div className="relative z-10 text-5xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" style={{ color: skill.color }}>
                        {skill.icon}
                      </div>
                      <h3 className="relative z-10 text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                        {skill.name}
                      </h3>
                    </div>
                  </FadeInSection>
                ))}
              </div>
            </FadeInSection>
          </section>

          {/* Experience Section */}
          <section id="experience" className="min-h-screen pt-32">
            <FadeInSection>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-16 font-heading">Experience</h2>
              <div className="space-y-12 border-l border-white/10 ml-4 pl-12 relative">
                {experiences.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[53px] top-2 w-5 h-5 rounded-full bg-indigo-500 border-4 border-[#0a0a0a] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-2 border border-indigo-500/20">
                      {exp.date}
                    </span>
                    <h3 className="text-3xl font-bold text-white mb-1">{exp.title}</h3>
                    <p className="text-lg text-gray-400 mb-4">{exp.company}</p>
                    <p className="text-gray-500 mb-6 max-w-2xl">{exp.description}</p>
                    <ul className="space-y-3">
                      {exp.tasks.map((task, i) => (
                        <li key={i} className="flex items-start text-gray-400 group">
                          <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-indigo-400 transition-colors" />
                          <span className="group-hover:text-gray-300 transition-colors">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </FadeInSection>
          </section>

          {/* Projects Section */}
          <section id="projects" className="min-h-screen pt-32">
            <FadeInSection>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div>
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-heading">Featured Projects</h2>
                  <p className="text-xl text-gray-400">Innovative solutions in Cloud & DevOps</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {projectCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedProjectCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedProjectCategory === category ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <FadeInSection delay={index * 100} key={project.title}>
                    {/* ✅ [수정 2] a href="#" 대신 div로 변경하여 스크롤 튀는 현상 방지 */}
                    <div className="group relative block h-full bg-gray-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-indigo-500/30 hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.2)] cursor-pointer">
                      <div className="p-8 h-full flex flex-col">
                        <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-colors duration-300">
                          {project.icon || <Code2 size={32} />}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                        <p className="text-gray-400 leading-relaxed mb-6 flex-grow">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-white/5">
                          {project.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-md bg-white/5 text-xs font-medium text-gray-400 border border-white/5">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </FadeInSection>
                ))}
              </div>
            </FadeInSection>
          </section>

          {/* Study Section */}
          <section id="study" className="min-h-screen pt-32">
             <FadeInSection>
                <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-16 font-heading">Tech Blog</h2>
                <div className="mb-12">
                  <FlowingMenu 
                    items={studyCategories} 
                    selectedItem={selectedStudyCategory}
                    onSelect={setSelectedStudyCategory}
                    images={categoryImages}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {isLoading ? (
                      <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"/>
                        <p>Loading posts...</p>
                      </div>
                   ) : filteredPosts.length > 0 ? (
                      filteredPosts.map((post, i) => (
                        <FadeInSection key={post.id} delay={i * 50}>
                           <a href={post.linkUrl} target="_blank" rel="noopener noreferrer" className="block p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{post.category}</span>
                              <h3 className="text-xl font-bold text-white mt-2 mb-3 group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                              <p className="text-gray-400 text-sm line-clamp-2">{post.content || "No description provided."}</p>
                           </a>
                        </FadeInSection>
                      ))
                   ) : (
                      <div className="col-span-full text-center text-gray-500 py-10">
                         작성된 글이 없습니다.
                      </div>
                   )}
                </div>
             </FadeInSection>
          </section>

          {/* Contact Section */}
          <section id="contact" className="min-h-[70vh] flex flex-col items-center justify-center text-center">
            <FadeInSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Available for opportunities
              </div>
              
              <h2 className="text-6xl md:text-8xl font-bold text-white mb-8 font-heading tracking-tight">
                Let's Build <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-indigo-600">Something Scalable.</span>
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
                <button
                  onClick={handleCopyEmail}
                  className="relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all flex items-center gap-3"
                >
                  {copied ? <Check size={20} /> : <Mail size={20} />}
                  {copied ? "Email Copied!" : "your-email@example.com"}
                </button>
                
                <div className="flex gap-4">
                  <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:-translate-y-1 transition-all">
                    <Github size={24} />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:-translate-y-1 transition-all">
                    <Linkedin size={24} />
                  </a>
                </div>
              </div>
            </FadeInSection>
          </section>

        </main>

        <footer className="border-t border-white/5 py-12 bg-black/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2025 Myong Ii Lee. Crafted with Go & React.</p>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-2">
              Back to Top <ArrowRight size={14} className="-rotate-90" />
            </a>
          </div>
        </footer>
      </div>
    </>
  )
}
