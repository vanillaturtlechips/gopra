import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Code2, Layers, Rocket, Calendar, User, 
  ExternalLink, Github, Target, AlertCircle, Youtube, 
  Image as ImageIcon, Terminal, ShieldCheck, Monitor
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
  
  // URL 인코딩된 타이틀을 찾기 위해 decodeURIComponent 사용
  const project = projects.find((p: Project) => p.title === decodeURIComponent(title || ""));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) return <div className="min-h-screen flex items-center justify-center text-white bg-[#0a0a0a]">Project not found.</div>;

  // 미디어 분류 (유튜브 vs 이미지)
  const videoMedia = project.gallery?.filter(m => m.type === 'video') || [];
  const imageMedia = project.gallery?.filter(m => m.type === 'image') || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      <MouseSpotlight />
      <div className="fixed inset-0 z-[-1]">
        <Aurora colorStops={AURORA_COLORS} amplitude={1.0} speed={0.2} blend={0.5} />
      </div>

      {/* 상단 네비게이션 */}
      <nav className="sticky top-0 z-50 flex items-center h-16 px-6 bg-[#0a0a0a]/60 backdrop-blur-xl border-b border-white/5">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Portfolio</span>
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pb-32 pt-16 relative z-10">
        
        {/* [1] 헤더 섹션 (아이콘 및 타이틀) */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex items-center gap-6 mb-8">
            <div className="text-6xl p-4 bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center w-24 h-24">
              {project.icon}
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight font-heading leading-tight">
                {project.title}
              </h1>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mt-2 ${project.projectType === 'Team' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                {project.projectType} Project
              </div>
            </div>
          </div>
          
          {/* [2] 요약 속성 테이블 (노션 스타일) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="bg-[#0a0a0a]/40 p-5 flex items-center gap-4 text-sm">
              <span className="w-24 text-gray-500 flex items-center gap-2 font-medium"><Calendar size={14}/> Duration</span>
              <span className="text-gray-200">2025.01 - 2025.03</span>
            </div>
            <div className="bg-[#0a0a0a]/40 p-5 flex items-center gap-4 text-sm">
              <span className="w-24 text-gray-500 flex items-center gap-2 font-medium"><User size={14}/> Role</span>
              <span className="text-gray-200">DevSecOps Engineer</span>
            </div>
            <div className="bg-[#0a0a0a]/40 p-5 flex items-center gap-4 md:col-span-2 text-sm">
              <span className="w-24 text-gray-500 flex items-center gap-2 font-medium"><Code2 size={14}/> Stack</span>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {(project.links.github || project.links.demo) && (
              <div className="bg-[#0a0a0a]/40 p-5 flex items-center gap-4 md:col-span-2 text-sm">
                <span className="w-24 text-gray-500 flex items-center gap-2"><ExternalLink size={14}/> Links</span>
                <div className="flex gap-4">
                  {project.links.github && (
                    <a href={project.links.github} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-white transition-colors flex items-center gap-1 font-bold">
                      <Github size={14}/> GitHub
                    </a>
                  )}
                  {project.links.demo && (
                    <a href={project.links.demo} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-white transition-colors flex items-center gap-1 font-bold">
                      <Monitor size={14}/> Live Demo
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* [3] 본문 상세 내용 및 멀티미디어 */}
        <div className="space-y-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          
          {/* 기술 개요 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Terminal size={24} className="text-indigo-500"/> Engineering Deep Dive
            </h2>
            <div className="relative p-10 rounded-3xl bg-white/[0.02] border border-white/5 leading-relaxed text-lg text-gray-300 font-light shadow-2xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 rounded-l-3xl" />
              <p className="whitespace-pre-line">
                {project.detailedDescription}
              </p>
            </div>
          </section>

          {/* 유튜브 데모 섹션 (여러 개 대응) */}
          {videoMedia.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Youtube size={24} className="text-red-500"/> Demo Showcases
              </h2>
              <div className="grid grid-cols-1 gap-12">
                {videoMedia.map((video, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black group relative">
                      <iframe
                        width="100%"
                        height="100%"
                        src={video.url}
                        title={video.caption}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="opacity-90 group-hover:opacity-100 transition-opacity"
                      ></iframe>
                    </div>
                    {video.caption && <p className="text-center text-sm text-gray-500 italic">#{idx + 1} {video.caption}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 이미지 갤러리 섹션 (여러 장 대응) */}
          {imageMedia.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <ImageIcon size={24} className="text-blue-500"/> Infrastructure & Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {imageMedia.map((img, idx) => (
                  <div key={idx} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#161b22] transition-all duration-500 hover:scale-[1.03] hover:shadow-indigo-500/10 hover:shadow-2xl">
                    <img 
                      src={img.url} 
                      alt={img.caption} 
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <p className="text-xs text-white font-bold tracking-widest uppercase">{img.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 트러블슈팅 리포트 (데이터가 있는 경우만) */}
          {project.problemSolving && project.problemSolving.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <AlertCircle size={24} className="text-orange-400"/> Critical Problem Solving
              </h2>
              <div className="space-y-6">
                {project.problemSolving.map((ps, idx) => (
                  <div key={idx} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all group">
                    <div className="flex items-center gap-3 mb-4 text-indigo-300">
                      <ShieldCheck size={20} />
                      <h3 className="text-xl font-bold">{ps.summary}</h3>
                    </div>
                    <div className="grid gap-6">
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">The Problem</span>
                        <p className="text-gray-300 leading-relaxed">{ps.problem}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">The Solution</span>
                        <p className="text-gray-200 leading-relaxed">{ps.solution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5 text-center">
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          © 2025 Myong Ii Lee • {project.title} Case Study
        </p>
      </footer>
    </div>
  );
};

export default ProjectDetail;