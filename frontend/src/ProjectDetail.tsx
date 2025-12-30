// frontend/src/ProjectDetail.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Code2, Calendar, User, 
  ExternalLink, Github, Terminal, Youtube, 
  Image as ImageIcon, ShieldCheck, Monitor,
  ChevronLeft, ChevronRight, X, AlertCircle
} from 'lucide-react';
import { projects, AURORA_COLORS } from './constants';
import type { Project } from './types';
import Aurora from './components/Aurora';

// 메인 페이지와 동일한 마우스 스포트라이트 효과
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

const ProjectDetail: React.FC = () => {
  const { title } = useParams<{ title: string }>();
  const navigate = useNavigate();
  
  // URL 인코딩된 타이틀 디코딩 및 프로젝트 찾기
  const decodedTitle = decodeURIComponent(title || "");
  const projectIndex = projects.findIndex((p: Project) => p.title === decodedTitle);
  const project = projects[projectIndex];

  // 이미지 라이트박스 상태 관리
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  if (!project) return <div className="min-h-screen flex items-center justify-center text-white bg-[#0a0a0a]">Project not found.</div>;

  // 미디어 분류
  const videoMedia = project.gallery?.filter(m => m.type === 'video') || [];
  const imageMedia = project.gallery?.filter(m => m.type === 'image') || [];

  // 다음/이전 프로젝트 계산
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  // 이미지 슬라이드 핸들러
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      <MouseSpotlight />
      <div className="fixed inset-0 z-[-1]">
        <Aurora colorStops={AURORA_COLORS} amplitude={1.0} speed={0.2} blend={0.5} />
      </div>

      {/* [1] 이미지 라이트박스 오버레이 (버튼 포함) */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setLightboxIndex(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50">
            <X size={40} />
          </button>

          {imageMedia.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 md:left-8 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all z-50 group"
              >
                <ChevronLeft size={48} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 md:right-8 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all z-50 group"
              >
                <ChevronRight size={48} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}

          <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center gap-6" onClick={e => e.stopPropagation()}>
            <img 
              src={imageMedia[lightboxIndex].url} 
              alt={imageMedia[lightboxIndex].caption} 
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
            {imageMedia[lightboxIndex].caption && (
              <p className="text-white text-lg font-medium bg-black/50 px-6 py-2 rounded-full backdrop-blur-md">
                {imageMedia[lightboxIndex].caption}
              </p>
            )}
            <div className="text-gray-500 text-sm font-bold tracking-widest">
              {lightboxIndex + 1} / {imageMedia.length}
            </div>
          </div>
        </div>
      )}

      {/* 상단 네비게이션: 포트폴리오 프로젝트 섹션으로 바로 이동 */}
      <nav className="sticky top-0 z-50 flex items-center h-20 px-6 bg-[#0a0a0a]/60 backdrop-blur-xl border-b border-white/5">
        <Link 
          to="/#projects" 
          className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-tight">Back to Projects</span>
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pb-20 pt-16 relative z-10">
        
        {/* 헤더 섹션 */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex items-center gap-8 mb-10">
            <div className="text-6xl p-5 bg-[#161b22] rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center w-28 h-28 group-hover:scale-110 transition-transform">
              {project.icon}
            </div>
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none mb-4">
                {project.title}
              </h1>
              <div className={`inline-flex px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase border ${project.projectType === 'Team' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}>
                {project.projectType} Project
              </div>
            </div>
          </div>
          
          {/* 요약 테이블 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="bg-[#161b22]/80 p-6 flex items-center gap-4 text-sm">
              <span className="w-24 text-gray-500 flex items-center gap-2 font-bold uppercase tracking-wider"><Calendar size={14}/> Duration</span>
              <span className="text-white font-medium">2025.01 - 2025.03</span>
            </div>
            <div className="bg-[#161b22]/80 p-6 flex items-center gap-4 text-sm">
              <span className="w-24 text-gray-500 flex items-center gap-2 font-bold uppercase tracking-wider"><User size={14}/> Role</span>
              <span className="text-white font-medium">DevSecOps Engineer</span>
            </div>
            <div className="bg-[#161b22]/80 p-6 flex items-center gap-4 md:col-span-2 text-sm border-t border-white/5">
              <span className="w-24 text-gray-500 flex items-center gap-2 font-bold uppercase tracking-wider"><Code2 size={14}/> Stack</span>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {(project.links.github || project.links.demo) && (
              <div className="bg-[#161b22]/80 p-6 flex items-center gap-4 md:col-span-2 text-sm border-t border-white/5">
                <span className="w-24 text-gray-500 flex items-center gap-2 font-bold uppercase tracking-wider"><ExternalLink size={14}/> Links</span>
                <div className="flex gap-6">
                  {project.links.github && (
                    <a href={project.links.github} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-white transition-colors flex items-center gap-2 font-black tracking-tight">
                      <Github size={16}/> GITHUB
                    </a>
                  )}
                  {project.links.demo && (
                    <a href={project.links.demo} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-white transition-colors flex items-center gap-2 font-black tracking-tight">
                      <Monitor size={16}/> LIVE DEMO
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 본문 콘텐츠 */}
        <div className="space-y-32 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          
          {/* 기술 개요 */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-4">
              <Terminal size={32} className="text-indigo-500"/> Engineering Deep Dive
            </h2>
            <div className="relative p-12 rounded-[2rem] bg-[#161b22] border border-white/10 leading-relaxed text-xl text-gray-200 font-medium shadow-inner">
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500/50 rounded-l-[2rem]" />
              <p className="whitespace-pre-line">
                {project.detailedDescription}
              </p>
            </div>
          </section>

          {/* 유튜브 데모 */}
          {videoMedia.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-4">
                <Youtube size={32} className="text-red-500"/> Demo Showcases
              </h2>
              <div className="grid grid-cols-1 gap-16">
                {videoMedia.map((video, idx) => (
                  <div key={idx} className="space-y-6">
                    <div className="aspect-video w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black group">
                      <iframe
                        width="100%"
                        height="100%"
                        src={video.url}
                        title={video.caption}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="opacity-80 group-hover:opacity-100 transition-opacity"
                      ></iframe>
                    </div>
                    {video.caption && <p className="text-center text-sm text-gray-500 font-bold tracking-widest uppercase">{video.caption}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 이미지 갤러리 - 클릭 시 라이트박스 활성화 */}
          {imageMedia.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-4">
                <ImageIcon size={32} className="text-blue-500"/> Infrastructure & Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {imageMedia.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative rounded-3xl overflow-hidden border border-white/10 bg-[#161b22] cursor-zoom-in transition-all duration-500 hover:scale-[1.02] hover:border-indigo-500/50"
                  >
                    <img 
                      src={img.url} 
                      alt={img.caption} 
                      className="w-full h-72 object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-8">
                      <p className="text-xs text-white font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                        {img.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 트러블슈팅 */}
          {project.problemSolving && project.problemSolving.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-4">
                <AlertCircle size={32} className="text-orange-400"/> Critical Problem Solving
              </h2>
              <div className="space-y-8">
                {project.problemSolving.map((ps, idx) => (
                  <div key={idx} className="p-10 rounded-[2.5rem] bg-[#161b22] border border-white/10 hover:border-indigo-500/30 transition-all shadow-xl group">
                    <div className="flex items-center gap-4 mb-8 text-indigo-300">
                      <ShieldCheck size={28} />
                      <h3 className="text-2xl font-bold tracking-tight">{ps.summary}</h3>
                    </div>
                    <div className="grid gap-10">
                      <div>
                        <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] block mb-4">The Problem</span>
                        <p className="text-gray-300 leading-relaxed text-lg font-medium">{ps.problem}</p>
                      </div>
                      <div className="p-8 rounded-3xl bg-indigo-500/5 border border-indigo-500/20">
                        <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] block mb-4">The Solution</span>
                        <p className="text-white leading-relaxed text-lg font-bold">{ps.solution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* [2] 하단 프로젝트 이동 네비게이션 */}
          <section className="pt-20 border-t border-white/10">
            <div className="flex flex-col sm:flex-row gap-6">
              {prevProject ? (
                <Link 
                  to={`/project/${encodeURIComponent(prevProject.title)}`}
                  className="flex-1 p-8 rounded-[2rem] bg-[#161b22] border border-white/5 hover:border-indigo-500/50 transition-all group flex flex-col items-start shadow-xl"
                >
                  <span className="text-gray-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 group-hover:text-indigo-400">
                    <ChevronLeft size={16} /> Previous Project
                  </span>
                  <span className="text-2xl font-bold text-white group-hover:translate-x-2 transition-transform line-clamp-1">
                    {prevProject.title}
                  </span>
                </Link>
              ) : <div className="flex-1" />}

              {nextProject ? (
                <Link 
                  to={`/project/${encodeURIComponent(nextProject.title)}`}
                  className="flex-1 p-8 rounded-[2rem] bg-[#161b22] border border-white/5 hover:border-indigo-500/50 transition-all group flex flex-col items-end text-right shadow-xl"
                >
                  <span className="text-gray-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 group-hover:text-indigo-400">
                    Next Project <ChevronRight size={16} />
                  </span>
                  <span className="text-2xl font-bold text-white group-hover:-translate-x-2 transition-transform line-clamp-1">
                    {nextProject.title}
                  </span>
                </Link>
              ) : <div className="flex-1" />}
            </div>
          </section>

        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5 text-center">
        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em]">
          © 2025 Myong Ii Lee • {project.title} Case Study
        </p>
      </footer>
    </div>
  );
};

export default ProjectDetail;