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
// ✅ [수정 1] 배경 깜빡임 방지를 위해 색상 배열을 컴포넌트 외부로 분리
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
  
  // ✅ [추가] 핵심 역량 (Core Competencies) 데이터
  const coreCompetencies = [
    {
      id: 1,
      title: "Hybrid Cloud Architecture",
      subtitle: "확장 가능한 하이브리드 클라우드",
      desc: "3-Tier 온프레미스 환경과 AWS EKS를 연동하여, 유연하고 확장성 높은 하이브리드 클라우드 인프라를 주도적으로 설계하고 구축할 수 있습니다.",
      icon: <SiKubernetes size={40} className="text-blue-500" />,
    },
    {
      id: 2,
      title: "Deep Observability",
      subtitle: "eBPF 기반 심층 관측성",
      desc: "단순 모니터링을 넘어, eBPF 기술을 활용해 커널 레벨에서 시스템 성능을 분석하고 병목 구간을 디버깅하는 애플리케이션을 개발했습니다.",
      icon: <FaBeer size={40} className="text-orange-500" />,
    },
    {
      id: 3,
      title: "DevSecOps Platform",
      subtitle: "보안 내재화 및 DX 향상",
      desc: "Security-by-Design 원칙을 적용하고 개발자 경험(DX)을 최우선으로 고려한 통합 개발자 플랫폼을 개발하였습니다.",
      icon: <VscShield size={40} className="text-green-500" />,
    },
    {
      id: 4,
      title: "Infrastructure as Code",
      subtitle: "선언적 인프라 자동화",
      desc: "Terraform과 Helm을 사용하여 인프라를 코드로 관리(IaC)하며, 환경 일관성 보장 및 배포 자동화를 구현하였습니다  .",
      icon: <SiTerraform size={40} className="text-purple-500" />,
    },
  ];

  // ✅ [수정] 활동 내역 (Key Activities) - 국문 버전 적용
const experiences = [
  {
    date: '2025.09 - 2026.04',
    title: 'AWS Cloud School',
    company: '한국전파진흥원',
    description: 'AWS에서 주관하는 부트캠프에 참여하였습니다.',
    tasks: [
      '온프레미스와 클라우드를 연결해보며, 레거시 환경과 현대적 아키텍처가 공존할 때 발생하는 복잡성과 해결 방안을 확인했습니다..',
      '보안이 개발의 걸림돌이 아닌 가속 페달이 되기 위해서는 "보이지 않는 보안(Invisible Security)"이 플랫폼에 녹아들어야 함을 깨달았습니다.',
      '인프라를 코드로 관리(IaC)하는 과정에서, 휴먼 에러를 줄이고 운영의 일관성을 지키는 것이 엔지니어링의 핵심 책임임을 배웠습니다.',
    ]
  },
  {
    date: '2025.11',
    title: 'SoftBank Hackathon (Creating the future with cloud)',
    company: 'SoftBank',
    description: '즐거운 배포라는 주제의 해커톤에 참여하여 짧은 시간 안에 아이디어를 실제 서비스로 구현했습니다.',
    tasks: [
      '이상적인 아키텍처와 현실적인 마감 기한 사이에서, MVP를 위한 최적의 인프라 스펙을 결정하며 트레이드오프(Trade-off)를 조율하는 감각을 익혔습니다.',
      '개발자들이 인프라 걱정 없이 로직에만 집중할 수 있는 환경을 만들어주었을 때, 팀 전체의 생산성이 폭발적으로 증가하는 것을 확인했습니다.',
      '즐거운 배포라는 것은 개발자 입장이 아닌 사용자 입장도 중요하단 사실을 이번 활동을 통해 깨달았습니다.'
    ]
  },
  {
    date: '2025.07 - 현재',
    title: 'Cloudbro Open Project',
    company: 'Cloudbro',
    description: '현업 SRE 엔지니어들과 함께하며, Cloudbro Open Project 2기에 활동하였습니다.',
    tasks: [
      'Rust와 eBPF라는 생소한 기술과 씨름하며, 로우 레벨(Low-level) 데이터가 어떻게 상위 레벨의 인사이트로 변환되는지 그 데이터의 흐름을 이해하게 되었습니다.',
      'Helm Chart를 직접 설계하면서, "내가 작성한 코드는 결국 다른 동료가 사용하는 인터페이스(UI)"라는 마음가짐으로 사용자 경험(DX)을 고민하게 되었습니다.',
      '오픈소스 표준(OpenTelemetry)을 준수하는 것이 장기적인 유지보수성과 생태계 확장에 얼마나 필수적인 요소인지 깨닫는 계기가 되었습니다.',
    ]
  },
  {
    date: '2025.02 - 2025.06',
    title: 'Security Academy education program',
    company: 'KISIA',
    description: 'KISIA에서 진행하는 교육 프로그램에 참여하면서 엔지니어에 대한 마인드셋을 확립하였습니다.',
    tasks: [
      '보안 도구(Trivy, Semgrep)를 파이프라인에 심으면서, 개발 속도를 저해하지 않으면서도 안전을 지키는 아키텍처를 고민했습니다.',
      '수동 배포의 불안함을 GitOps(ArgoCD)로 해결하며, 코드로 관리되는 인프라가 주는 운영 효율성을 체험했습니다.',
      '개발자가 인프라 팀을 거치지 않고도 주도적으로 서비스를 배포할 수 있는 환경을 구축하며, 플랫폼 엔지니어링이 나아가야 할 방향성을 확립했습니다.',
    ]
  },
  {
    date: '2025.01 - 현재',
    title: 'Open Source Contributor & Study',
    company: 'OWASP',
    description: '혼자만의 공부에 그치지 않고, 글로벌 보안 커뮤니티와 호흡하며 지식을 나누고 확장하는 즐거움을 배우고 있습니다.',
    tasks: [
      '파편화된 DevSecOps 지식들을 정리하고 문서화하면서, 내가 아는 것을 남이 이해할 수 있게 설명하는 능력의 중요성을 배웠습니다.',
      '이론으로만 존재하던 글로벌 보안 표준들이 실제 현업 환경에서는 어떻게 변형되고 적용되어야 하는지, 그 간극을 메우는 방법을 배우고 있습니다.',
    ]
  },
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
  
  useEffect(() => { fetchPosts(); }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("wkdqkdgud@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const filteredPosts = selectedStudyCategory === 'All'
    ? posts
    : posts.filter(post => normalizeCategory(post.category) === normalizeCategory(selectedStudyCategory));
  

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
    // ✅ [추가] 메뉴에 Core(역량) 섹션 추가
    { label: 'Core', ariaLabel: 'Go to Competencies section', link: '#competencies' },
    { label: 'Skills', ariaLabel: 'Go to Skills section', link: '#skills' },
    { label: 'Activity', ariaLabel: 'Go to Experience section', link: '#experience' }, // Experience -> Activity로 명칭 변경 제안
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
        colorStops={AURORA_COLORS} // ✅ 상수 전달로 리렌더링 시 깜빡임 방지
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
                  플랫폼이 안정적으로 구축될때 행복한 엔지니어입니다. 
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

          {/* Core Competencies Section */}
          <section id="competencies" className="min-h-screen pt-32">
            <FadeInSection>
              <div className="mb-16">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-heading">
                  Core Competencies
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl">
                  시스템의 깊은 곳부터 클라우드 아키텍처까지, 저를 정의하는 핵심 역량입니다.
                </p>
              </div>

              {/* 역량 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coreCompetencies.map((item, idx) => (
                  <FadeInSection key={item.id} delay={idx * 100}>
                    <div className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 group">
                      <div className="mb-6 p-4 bg-black/30 rounded-2xl w-fit border border-white/5 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-indigo-400 font-medium mb-4">{item.subtitle}</p>
                      <p className="text-gray-400 leading-relaxed text-lg">
                        {item.desc}
                      </p>
                    </div>
                  </FadeInSection>
                ))}
              </div>
            </FadeInSection>
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

          {/* ✅ [수정] Key Activities Section (구 Experience) */}
          <section id="experience" className="min-h-[80vh] pt-32">
            <FadeInSection>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-16 font-heading">
                Key Activities
              </h2>
              <div className="space-y-12 border-l border-white/10 ml-4 pl-12 relative">
                {experiences.map((exp, index) => (
                  <div key={index} className="relative">
                    {/* 타임라인 점 */}
                    <div className="absolute -left-[53px] top-2 w-5 h-5 rounded-full bg-indigo-500 border-4 border-[#0a0a0a] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    
                    {/* 날짜 뱃지 */}
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-2 border border-indigo-500/20">
                      {exp.date}
                    </span>

                    {/* 제목 및 설명 */}
                    <h3 className="text-3xl font-bold text-white mb-1">{exp.title}</h3>
                    <p className="text-lg text-gray-400 mb-4">{exp.company}</p>
                    <p className="text-gray-500 mb-6 max-w-2xl">{exp.description}</p>

                    {/* 활동 리스트 (Bullet Points) */}
                    <ul className="space-y-4">
                      {exp.tasks.map((task, i) => (
                        <li key={i} className="flex items-start text-gray-300 group">
                          {/* 화살표 아이콘으로 교체하여 활동성 강조 */}
                          <ArrowRight className="mr-3 mt-1.5 min-w-[16px] text-indigo-500 group-hover:translate-x-1 transition-transform" size={16} />
                          <span className="text-lg leading-relaxed group-hover:text-white transition-colors">
                            {task}
                          </span>
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
                    {/* ✅ [수정] 스크롤 튀는 현상 방지를 위해 a href="#" 제거하고 div로 변경 */}
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
                  {copied ? "Email Copied!" : "wkdqkdgud@gmail.com"}
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