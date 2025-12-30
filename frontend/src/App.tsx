// frontend/src/App.tsx
import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ProjectDetail from './ProjectDetail';
import Aurora from './components/Aurora';
import './components/Aurora.css';
import StaggeredMenu from './components/StaggeredMenu';
import FlowingMenu from './components/FlowingMenu'; 
import { 
  Github, Check, Mail, ArrowRight, Linkedin, Globe, Code2, X, ExternalLink,
  Lightbulb, AlertTriangle, Target, Wrench, Activity, CheckCircle, MessageSquareQuote, 
  ArrowLeft, FileText, Layers, Play, Maximize2, Search, Network, Lock,
  ChevronLeft, ChevronRight
} from 'lucide-react';

import type { Post, Project, ProblemSolving } from './types';
import { 
  AURORA_COLORS, categoryImages, coreCompetencies, 
  skills, experiences, projects 
} from './constants';

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
  return <div ref={divRef} className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300" />;
};

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
    if (domRef.current) observer.observe(domRef.current);
    return () => { if (domRef.current) observer.unobserve(domRef.current); };
  }, []);
  return (
    <div ref={domRef} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
      {children}
    </div>
  );
};

// --- Project Modal Component (수정됨: 이미지 이동 버튼 추가) ---
const ProjectModal = ({ project, onClose }: { project: Project, onClose: () => void }) => {
  const [view, setView] = useState<'overview' | 'troubleshooting'>('overview');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeProblem, setActiveProblem] = useState<ProblemSolving | null>(null);
  const navigate = useNavigate();

  const imageMedia = project.gallery?.filter(m => m.type === 'image') || [];

  useEffect(() => {
    setView('overview'); setLightboxIndex(null); setActiveProblem(null);
  }, [project]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + imageMedia.length) % imageMedia.length);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % imageMedia.length);
    }
  };

  if (!project) return null;

  const solvingSteps = (activeProblem: ProblemSolving | null) => activeProblem ? [
    { label: "1. 문제 정의", icon: <AlertTriangle size={20} className="text-red-400" />, content: activeProblem.problem, color: "border-red-500/50 text-red-400" },
    { label: "2. 원인 분석", icon: <Activity size={20} className="text-orange-400" />, content: activeProblem.cause, color: "border-orange-500/50 text-orange-400" },
    { label: "3. 측정 (심각성)", icon: <Target size={20} className="text-yellow-400" />, content: activeProblem.metric, color: "border-yellow-500/50 text-yellow-400" },
    { label: "4. 해결책 도출", icon: <Lightbulb size={20} className="text-blue-400" />, content: activeProblem.solution, color: "border-blue-500/50 text-blue-400" },
    { label: "5. 해결 과정", icon: <Wrench size={20} className="text-indigo-400" />, content: activeProblem.process, color: "border-indigo-500/50 text-indigo-400" },
    { label: "6. 결과 평가", icon: <CheckCircle size={20} className="text-green-400" />, content: activeProblem.evaluation, color: "border-green-500/50 text-green-400" },
    { label: "7. 비고 및 회고", icon: <MessageSquareQuote size={20} className="text-purple-400" />, content: activeProblem.remarks, color: "border-purple-500/50 text-purple-400" },
  ] : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      {/* 라이트박스 오버레이 (버튼 포함) */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 animate-in fade-in duration-200" onClick={() => setLightboxIndex(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[160]"><X size={32} /></button>
          
          {imageMedia.length > 1 && (
            <>
              <button onClick={handlePrevImage} className="absolute left-4 md:left-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[160] group">
                <ChevronLeft size={40} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button onClick={handleNextImage} className="absolute right-4 md:right-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[160] group">
                <ChevronRight size={40} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}

          <div className="relative max-w-[85vw] max-h-[85vh] flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
            <img src={imageMedia[lightboxIndex].url} alt="Full size" className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl" />
            <p className="text-white font-bold bg-black/40 px-4 py-2 rounded-full">{imageMedia[lightboxIndex].caption}</p>
            <div className="text-gray-500 text-xs font-bold tracking-widest">{lightboxIndex + 1} / {imageMedia.length}</div>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-5xl h-[85vh] bg-[#0d1117] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {view === 'overview' && !activeProblem && (
          <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="relative h-64 sm:h-80 w-full bg-gradient-to-br from-[#0d1117] to-indigo-950/30 flex items-center justify-center shrink-0 border-b border-white/5">
              <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"><X size={24} /></button>
              {project.architectureImage ? <img src={project.architectureImage} alt={`${project.title} Architecture`} className="w-full h-full object-cover opacity-90" /> : <div className="scale-[3] text-indigo-500/30">{project.icon}</div>}
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-transparent">
                <div className="flex items-center gap-3 mb-2"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${project.projectType === 'Team' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>{project.projectType} Project</span></div>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-3 font-heading">{project.title}</h3>
                <div className="flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10 font-medium">{tag}</span>)}</div>
              </div>
            </div>
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 content-start">
              <div className="lg:col-span-2 space-y-8">
                <div><h4 className="text-xl font-bold text-white mb-4">Project Overview</h4><p className="text-gray-400 leading-relaxed whitespace-pre-line text-lg">{project.detailedDescription}</p></div>
                <div><h4 className="text-xl font-bold text-white mb-4">Architecture & Media</h4>
                  {project.gallery && project.gallery.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.gallery.map((media, idx) => (
                        <div key={idx} className="group relative rounded-xl overflow-hidden border border-white/10 bg-[#161b22] hover:border-indigo-500/50 transition-all cursor-pointer aspect-video" 
                             onClick={() => {
                               if (media.type === 'image') {
                                 const imgIdx = imageMedia.findIndex(m => m.url === media.url);
                                 setLightboxIndex(imgIdx);
                               } else {
                                 window.open(media.url, '_blank');
                               }
                             }}>
                          {media.type === 'image' ? <><img src={media.url} alt={media.caption} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" /><div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"><Maximize2 className="text-white" size={24} /></div></> : <>{media.thumbnail ? <img src={media.thumbnail} alt={media.caption} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" /> : <div className="w-full h-full flex items-center justify-center bg-[#0d1117]"><Play className="text-red-500" size={40} /></div>}<div className="absolute inset-0 flex items-center justify-center"><div className="p-3 rounded-full bg-black/50 border border-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform"><Play className="text-white fill-white" size={20} /></div></div></>}
                          {media.caption && <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent"><p className="text-xs text-white font-medium truncate px-2">{media.caption}</p></div>}
                          <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-[10px] font-bold text-white uppercase border border-white/10">{media.type}</div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-gray-500 text-sm bg-black/20 p-4 rounded-xl border border-white/5">등록된 미디어가 없습니다.</p>}
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#161b22] border border-white/5">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Links</h4>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => { onClose(); navigate(`/project/${encodeURIComponent(project.title)}`); }}
                      className="flex items-center gap-3 text-white bg-indigo-600/20 hover:bg-indigo-600/40 transition-all p-3 rounded-lg border border-indigo-500/30 group"
                    >
                      <FileText size={20} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-indigo-100">Full Details (Notion Style)</span>
                      <ArrowRight size={14} className="ml-auto text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                    {project.links.github && <a href={project.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white hover:text-indigo-400 transition-colors p-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10"><Github size={20} /><span className="font-medium">View Code</span><ExternalLink size={14} className="ml-auto opacity-50" /></a>}
                    {project.links.docs && <a href={project.links.docs} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white hover:text-indigo-400 transition-colors p-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10"><Code2 size={20} /><span className="font-medium">Documentation</span><ExternalLink size={14} className="ml-auto opacity-50" /></a>}
                    {project.links.demo && <a href={project.links.demo} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white hover:text-indigo-400 transition-colors p-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10"><Globe size={20} /><span className="font-medium">Live Demo</span><ExternalLink size={14} className="ml-auto opacity-50" /></a>}
                  </div>
                </div>
                {project.problemSolving && project.problemSolving.length > 0 && (
                  <div className="rounded-2xl bg-[#161b22] border border-white/5 overflow-hidden">
                    <div className="p-4 bg-[#1f2430] border-b border-white/5 flex items-center gap-2"><img src="/images/trivy.png" alt="Troubleshooting" className="w-5 h-5 object-contain" /><span className="text-sm font-bold text-gray-300">Troubleshooting Cases ({project.problemSolving.length})</span></div>
                    <div className="p-2 space-y-1">{project.problemSolving.map((item, idx) => <button key={idx} onClick={() => setActiveProblem(item)} className="w-full text-left p-4 rounded-xl hover:bg-white/5 hover:border-white/10 border border-transparent transition-all group relative"><div className="flex items-center justify-between mb-1"><span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1"><Layers size={12} /> CASE #{idx + 1}</span><ArrowRight size={14} className="text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" /></div><h5 className="text-white font-bold text-sm leading-snug group-hover:text-indigo-200 transition-colors line-clamp-2">{item.summary}</h5></button>)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeProblem !== null && (
          <div className="flex flex-col h-full bg-[#0d1117] animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-20"><button onClick={() => setActiveProblem(null)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group px-3 py-2 rounded-lg hover:bg-white/5"><ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /><span className="font-medium text-sm">Back to List</span></button><div className="flex gap-2"><button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"><X size={20} /></button></div></div>
            <div className="flex-1 overflow-y-auto custom-scrollbar"><div className="max-w-4xl mx-auto p-8 sm:p-12"><div className="mb-12 border-b border-white/10 pb-8"><div className="flex items-center gap-3 mb-4 text-indigo-400"><FileText size={24} /><span className="font-bold tracking-widest uppercase text-sm">Engineering Report</span></div><h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{activeProblem.summary}</h2><div className="flex flex-wrap gap-4 text-sm text-gray-400"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span><span>Status: Resolved</span></div><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span><span>Impact: High</span></div></div></div><div className="space-y-12">{solvingSteps(activeProblem).map((step, idx) => <div key={idx} className="relative pl-8 sm:pl-0"><div className="hidden sm:block absolute left-[27px] top-10 bottom-[-48px] w-px bg-white/5 last:hidden"></div><div className="flex flex-col sm:flex-row gap-6"><div className="shrink-0"><div className={`w-14 h-14 rounded-2xl bg-[#161b22] border border-white/10 flex items-center justify-center shadow-lg relative z-10 ${step.color}`}>{step.icon}</div></div><div className="grow pt-1"><h3 className={`text-lg font-bold mb-3 flex items-center gap-3 ${step.color.split(' ')[1]}`}>{step.label}</h3><div className="bg-[#161b22] border border-white/5 rounded-xl p-6 shadow-sm hover:border-white/10 transition-colors"><p className="text-gray-300 leading-8 text-[16px] whitespace-pre-line">{step.content}</p></div></div></div></div>)}</div><div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">End of Report</div></div></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStudyCategory, setSelectedStudyCategory] = useState('All'); 
  const [activeSkillTab, setActiveSkillTab] = useState('All');
  const [selectedProjectCategory, setSelectedProjectCategory] = useState('All');
  
  // ✅ 페이지네이션 상태 (와이드 구조이므로 3개씩 끊기)
  const [projectPage, setProjectPage] = useState(1);
  const projectsPerPage = 3;

  const { hash } = useLocation();

  const studyCategories = ['All','devops','GOlang','DataBase','Network','Operating System','Data Structure and Algorithm'];
  const skillCategories = ['All', 'Languages', 'Cloud & Infra', 'DevSecOps'];
  const projectCategories = ['All', 'AWS', 'Terraform', 'Docker', 'Kubernetes', 'Go', 'React', 'Security', 'DevSecOps'];
  const GITHUB_URL = "https://github.com/vanillaturtlechips";
  const socialItems = [{ label: 'GitHub', link: GITHUB_URL }, { label: 'LinkedIn', link: 'https://www.linkedin.com/in/%EB%AA%85%EC%9D%BC-%EC%9D%B4-342075399/' }];
  const menuItems = [{ label: 'About', ariaLabel: 'Go to About section', link: '#about' }, { label: 'Core', ariaLabel: 'Go to Competencies section', link: '#competencies' }, { label: 'Skills', ariaLabel: 'Go to Skills section', link: '#skills' }, { label: 'Activity', ariaLabel: 'Go to Experience section', link: '#experience' }, { label: 'Projects', ariaLabel: 'Go to Projects section', link: '#projects' }, { label: 'Study', ariaLabel: 'Go to Study section', link: '#study' }, { label: 'Contact', ariaLabel: 'Go to Contact section', link: '#contact' }];

  // ✅ 해시 스크롤 처리 (상세 페이지에서 돌아올 때)
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [hash]);

  useEffect(() => {
    fetch('/api/posts').then(res => res.json()).then(data => { setPosts(data); setIsLoading(false); }).catch(e => { console.error(e); setIsLoading(false); });
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("wkdqkdgud@gmail.com"); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const filteredPosts = selectedStudyCategory === 'All' ? posts : posts.filter((post: Post) => normalizeCategory(post.category) === normalizeCategory(selectedStudyCategory));
  const filteredSkills = activeSkillTab === 'All' ? skills : skills.filter(s => s.category === activeSkillTab);
  
  // ✅ 프로젝트 필터링 및 페이지네이션 로직
  const filteredProjects = selectedProjectCategory === 'All' ? projects : projects.filter((p: Project) => p.tags.includes(selectedProjectCategory));
  const displayedProjects = filteredProjects.slice((projectPage - 1) * projectsPerPage, projectPage * projectsPerPage);

  return (
    <>
      <MouseSpotlight />
      <Routes>
        <Route path="/" element={
          <>
            {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
            <div className="fixed inset-0 z-[-2] w-full h-full bg-[#0a0a0a]" />
            <Aurora colorStops={AURORA_COLORS} amplitude={1.0} speed={0.2} blend={0.5} />
            <StaggeredMenu position="right" items={menuItems} socialItems={socialItems} displaySocials={true} displayItemNumbering={true} menuButtonColor="#fff" openMenuButtonColor="#1a1a1a" changeMenuColorOnOpen={true} accentColor="#3A29FF" githubUrl={GITHUB_URL} />

            <div className="relative z-0 w-full min-h-screen text-gray-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
              <main className="max-w-7xl mx-auto px-6 md:px-12 py-8">
                
                {/* #about */}
                <section id="about" className="min-h-screen flex flex-col items-start justify-center relative overflow-hidden">
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
                  <FadeInSection>
                    <div className="relative z-10 max-w-4xl">
                      <div className="flex items-center gap-3 mb-6"><div className="h-[1px] w-12 bg-indigo-500" /><span className="text-indigo-400 font-medium tracking-wider text-sm uppercase">Portfolio 2025</span></div>
                      <h1 className="text-7xl md:text-9xl font-bold text-white tracking-tighter mb-8 font-heading leading-[0.9]">Myong Ii Lee</h1>
                      <div className="h-20 md:h-24 mb-8"><span className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 font-heading">I am a DevSecOps Engineer</span></div>
                      <p className="text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed font-light mb-12">플랫폼이 안정적으로 구축될때 행복한 엔지니어입니다. <strong className="text-white font-medium"> 보안 관제</strong>에서 시작된 호기심을 <strong className="text-white font-medium"> 클라우드 아키텍처</strong>와 <strong className="text-white font-medium"> 자동화</strong>로 확장시켰습니다.</p>
                      <div className="flex flex-wrap gap-4"><a href="#contact" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold transition-all hover:bg-indigo-50">Let's Connect<ArrowRight className="inline ml-2 transition-transform group-hover:translate-x-1" size={20} /></a><a href={GITHUB_URL} target="_blank" rel="noreferrer" className="px-8 py-4 border border-white/20 rounded-full font-medium hover:bg-white/10 transition-all text-white flex items-center gap-2"><Github size={20} /> GitHub</a></div>
                    </div>
                  </FadeInSection>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500"><span className="text-xs uppercase tracking-widest">Scroll</span></div>
                </section>

                {/* #competencies */}
                <section id="competencies" className="min-h-screen pt-32">
                  <FadeInSection>
                    <div className="mb-16">
                      <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-heading">Core Competencies</h2>
                      <p className="text-xl text-gray-400 max-w-2xl font-medium">시스템의 깊은 곳부터 클라우드 아키텍처까지, 저를 정의하는 핵심 역량입니다.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {coreCompetencies.map((item, idx) => (
                        <FadeInSection key={item.id} delay={idx * 100}>
                          <div className="h-full p-8 rounded-3xl bg-[#161b22] border border-white/10 hover:border-indigo-500/30 transition-all duration-300 group shadow-lg">
                            <div className="mb-6 p-4 bg-black/30 rounded-2xl w-fit border border-white/5 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                            <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                            <p className="text-indigo-400 font-bold mb-4">{item.subtitle}</p>
                            <p className="text-gray-200 leading-relaxed text-lg font-medium">{item.desc}</p>
                          </div>
                        </FadeInSection>
                      ))}
                    </div>
                  </FadeInSection>
                </section>

                {/* #skills */}
                <section id="skills" className="min-h-screen pt-32 relative flex flex-col">
                  <FadeInSection>
                    <div className="mb-16">
                      <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-heading">Technical Arsenal</h2>
                      <p className="text-xl text-gray-400 max-w-2xl font-medium">안정적이고 확장 가능한 시스템을 구축하기 위한 저의 무기들입니다.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-12">
                      {skillCategories.map((tab) => (
                        <button key={tab} onClick={() => setActiveSkillTab(tab)} className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border backdrop-blur-sm ${activeSkillTab === tab ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>{tab}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {filteredSkills.map((skill, idx) => (
                        <FadeInSection delay={idx * 50} key={skill.name}>
                          <div className="group relative h-40 flex flex-col items-center justify-center p-6 rounded-2xl border border-white/10 bg-[#161b22] backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-white/30 hover:-translate-y-1">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ background: `radial-gradient(circle at center, ${skill.color}, transparent 70%)` }} />
                            <div className="relative z-10 text-5xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" style={{ color: skill.color }}>{skill.icon}</div>
                            <h3 className="relative z-10 text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{skill.name}</h3>
                          </div>
                        </FadeInSection>
                      ))}
                    </div>
                  </FadeInSection>
                </section>

                {/* #experience */}
                <section id="experience" className="min-h-[80vh] pt-32">
                  <FadeInSection>
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-16 font-heading">Key Activities</h2>
                    <div className="space-y-12 border-l border-white/10 ml-4 pl-12 relative">
                      {experiences.map((exp, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-[53px] top-2 w-5 h-5 rounded-full bg-indigo-500 border-4 border-[#0a0a0a] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold mb-2 border border-indigo-500/30">{exp.date}</span>
                          <h3 className="text-3xl font-bold text-white mb-1">{exp.title}</h3>
                          <p className="text-lg text-indigo-400 font-bold mb-4">{exp.company}</p>
                          <p className="text-gray-200 mb-6 max-w-2xl font-medium leading-relaxed">{exp.description}</p>
                          <ul className="space-y-4">
                            {exp.tasks.map((task, i) => (
                              <li key={i} className="flex items-start text-gray-300 group"><ArrowRight className="mr-3 mt-1.5 min-w-[16px] text-indigo-500 group-hover:translate-x-1 transition-transform" size={16} /><span className="text-lg leading-relaxed group-hover:text-white transition-colors font-medium">{task}</span></li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </FadeInSection>
                </section>

                {/* ✅ #projects - 가로 와이드 카드 및 페이지네이션 */}
                <section id="projects" className="min-h-screen pt-32">
                  <FadeInSection>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                      <div>
                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-heading">Featured Projects</h2>
                        <p className="text-xl text-gray-400 font-medium">Innovative solutions in Cloud & DevOps</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {projectCategories.map((category) => (
                          <button key={category} onClick={() => { setSelectedProjectCategory(category); setProjectPage(1); }} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedProjectCategory === category ? 'bg-white text-black shadow-lg shadow-white/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{category}</button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-10">
                      {displayedProjects.map((project, index) => (
                        <FadeInSection delay={index * 150} key={project.title}>
                          <div 
                            onClick={() => setSelectedProject(project)} 
                            className="group relative flex flex-col md:flex-row items-stretch min-h-[380px] bg-[#161b22] border border-white/20 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] cursor-pointer"
                          >
                            <div className="md:w-[40%] relative overflow-hidden bg-[#0d1117] flex items-center justify-center p-10">
                              <div className="relative z-10 transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                                {project.icon || <Code2 size={70} className="text-indigo-500" />}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent" />
                            </div>

                            <div className="md:w-[60%] p-10 md:p-14 flex flex-col justify-center">
                              <div className="flex items-center gap-3 mb-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${project.projectType === 'Team' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}>
                                  {project.projectType} Project
                                </span>
                              </div>
                              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading tracking-tight group-hover:text-indigo-400 transition-colors leading-none">
                                {project.title}
                              </h3>
                              <p className="text-xl text-gray-300 leading-relaxed mb-8 font-medium line-clamp-2">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-8">
                                {project.tags.map(tag => (
                                  <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 text-indigo-300 text-xs font-bold border border-white/5">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                                View Case Study <ArrowRight size={18} />
                              </div>
                            </div>
                          </div>
                        </FadeInSection>
                      ))}
                    </div>

                    <div className="flex justify-center items-center gap-4 mt-16">
                      {[1, 2].map((num) => (
                        <button key={num} onClick={() => setProjectPage(num)} className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center font-black text-lg ${projectPage === num ? 'bg-white text-black border-white scale-110 shadow-2xl' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'}`}>
                          0{num}
                        </button>
                      ))}
                    </div>
                  </FadeInSection>
                </section>

                {/* #study */}
                <section id="study" className="min-h-screen pt-32">
                  <FadeInSection><h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-16 font-heading">Tech Blog</h2><div className="mb-12"><FlowingMenu items={studyCategories} selectedItem={selectedStudyCategory} onSelect={setSelectedStudyCategory} images={categoryImages} /></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{isLoading ? (<div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"/><p className="font-bold">Loading insights...</p></div>) : filteredPosts.length > 0 ? (filteredPosts.map((post: Post, i) => (<FadeInSection key={post.id} delay={i * 50}><a href={post.linkUrl} target="_blank" rel="noopener noreferrer" className="block p-8 rounded-[2rem] bg-[#161b22] border border-white/10 hover:border-indigo-500/30 transition-all group shadow-lg"><span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{post.category}</span><h3 className="text-2xl font-bold text-white mt-3 mb-4 group-hover:text-indigo-400 transition-colors">{post.title}</h3><p className="text-gray-300 text-base font-medium line-clamp-2 leading-relaxed">{post.content || "No description provided."}</p></a></FadeInSection>))) : (<div className="col-span-full text-center text-gray-500 py-10 font-bold">작성된 글이 없습니다.</div>)}</div></FadeInSection>
                </section>

                {/* #contact */}
                <section id="contact" className="min-h-[70vh] flex flex-col items-center justify-center text-center">
                  <FadeInSection>
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-black mb-10 shadow-sm">
                      <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>Available for opportunities
                    </div>
                    <h2 className="text-7xl md:text-9xl font-bold text-white mb-10 font-heading tracking-tight leading-none">Let's Build <br /><span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-indigo-600">Something Scalable.</span></h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                      <button onClick={handleCopyEmail} className="relative px-10 py-5 bg-white text-black rounded-full font-black text-xl hover:bg-gray-200 transition-all flex items-center gap-4 shadow-2xl">{copied ? <Check size={24} /> : <Mail size={24} />}{copied ? "Email Copied!" : "wkdqkdgud@gmail.com"}</button>
                      <div className="flex gap-4">
                        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="p-5 rounded-full bg-[#161b22] border border-white/10 text-white hover:bg-white/10 hover:-translate-y-1 transition-all shadow-lg"><Github size={28} /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-5 rounded-full bg-[#161b22] border border-white/10 text-white hover:bg-white/10 hover:-translate-y-1 transition-all shadow-lg"><Linkedin size={28} /></a>
                      </div>
                    </div>
                  </FadeInSection>
                </section>
                
              </main>
              
              <footer className="border-t border-white/5 py-16 bg-black/60 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-gray-400 text-sm font-bold tracking-tight">© 2025 Myong Ii Lee. Crafted with Go & React.</p>
                  <a href="#" className="text-gray-400 hover:text-white text-sm font-bold transition-colors flex items-center gap-3">Back to Top <ArrowRight size={16} className="-rotate-90" /></a>
                </div>
              </footer>

            </div>
          </>
        } />
        <Route path="/project/:title" element={<ProjectDetail />} />
      </Routes>
    </>
  );
}