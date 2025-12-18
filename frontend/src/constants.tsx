import type { Project } from './types';
import { 
  SiGo, SiNextdotjs, SiNodedotjs, SiPython, SiTypescript, 
  SiDocker, SiKubernetes, SiArgo, SiHelm, SiGithubactions, 
  SiTerraform, SiRust, SiOracle, SiSpring, SiGnubash
} from "react-icons/si"; 
import { FaAws } from "react-icons/fa";
import { Globe, Lock, Search, Network } from 'lucide-react';

export const AURORA_COLORS = ["#3A29FF", "#FF94B4", "#FF3232"];

export const categoryImages: Record<string, string> = {
  'All': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80',
  'devops': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=2000&q=80',
  'GOlang': 'https://images.unsplash.com/photo-1649180556628-9ba704115795?q=80&w=2000&auto=format&fit=crop',
  'DataBase': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=2000&auto=format&fit=crop',
  'Network': 'https://images.unsplash.com/photo-1558494949-efc53075a3bd?auto=format&fit=crop&w=2000&q=80',
  'Operating System': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2000&auto=format&fit=crop',
  'Data Structure and Algorithm': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2000&auto=format&fit=crop'
};

export const skills = [
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
  { name: 'eBPF', icon: <img src="/images/ebpf.png" alt="eBPF" className="w-12 h-12 object-contain" />, color: '#EB5C1C', category: 'DevSecOps' },
  { name: 'ArgoCD', icon: <SiArgo />, color: '#EF7B4D', category: 'DevSecOps' },
  { name: 'GitHub Actions', icon: <SiGithubactions />, color: '#2088FF', category: 'DevSecOps' },
  { name: 'Semgrep', icon: <img src="/images/semgrep.png" alt="Semgrep" className="w-12 h-12 object-contain" />, color: '#358A7F', category: 'DevSecOps' },
  { name: 'Trivy', icon: <img src="/images/trivy.png" alt="Trivy" className="w-12 h-12 object-contain" />, color: '#00A0E1', category: 'DevSecOps' },
  { name: 'Spring Cloud', icon: <SiSpring />, color: '#6DB33F', category: 'Cloud & Infra' },
];

export const coreCompetencies = [
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
    icon: <img src="/images/ebpf.png" alt="eBPF" className="w-10 h-10 object-contain" />, 
  },
  {
    id: 3,
    title: "DevSecOps Platform",
    subtitle: "보안 내재화 및 DX 향상",
    desc: "Security-by-Design 원칙을 적용하고 개발자 경험(DX)을 최우선으로 고려한 통합 개발자 플랫폼을 개발하였습니다.",
    icon: <img src="/images/trivy.png" alt="Trivy" className="w-10 h-10 object-contain" />,
  },
  {
    id: 4,
    title: "Infrastructure as Code",
    subtitle: "선언적 인프라 자동화",
    desc: "Terraform과 Helm을 사용하여 인프라를 코드로 관리(IaC)하며, 환경 일관성 보장 및 배포 자동화를 구현하였습니다.",
    icon: <SiTerraform size={40} className="text-purple-500" />,
  },
];

export const experiences = [
  {
    date: '2025.09 - 2026.04',
    title: 'Cloud Native & DevSecOps 엔지니어링',
    company: '개인 연구 및 핵심 프로젝트',
    description: '단순한 기능 구현을 넘어, "안정적이고 확장 가능한 시스템이란 무엇인가"에 대한 답을 찾기 위해 치열하게 고민했던 기록입니다.',
    tasks: [
      '온프레미스와 클라우드를 연결해보며, 레거시 환경과 현대적 아키텍처가 공존할 때 발생하는 복잡성과 해결 방안을 깊이 연구했습니다.',
      '겉핥기식 튜닝이 아닌, eBPF로 커널 내부를 직접 들여다보며 시스템의 성능 병목이 어디서 시작되는지 근본적인 원리를 파고들었습니다.',
      '보안이 개발의 걸림돌이 아닌 가속 페달이 되기 위해서는 "보이지 않는 보안(Invisible Security)"이 플랫폼에 녹아들어야 함을 깨달았습니다.',
      '인프라를 코드로 관리(IaC)하는 과정에서, 휴먼 에러를 줄이고 운영의 일관성을 지키는 것이 엔지니어링의 핵심 책임임을 배웠습니다.',
    ]
  },
  {
    date: '2025.11',
    title: 'SoftBank Hackathon (Creating the future with cloud)',
    company: 'SoftBank',
    description: '짧은 시간 안에 아이디어를 실제 서비스로 구현하며, 비즈니스를 지탱하는 "단단한 인프라"의 중요성을 체감했습니다.',
    tasks: [
      '이상적인 아키텍처와 현실적인 마감 기한 사이에서, MVP를 위한 최적의 인프라 스펙을 결정하며 트레이드오프(Trade-off)를 조율하는 감각을 익혔습니다.',
      '팀 내 유일한 인프라 담당자로서, "내 설정 하나가 서비스 전체의 생사를 가를 수 있다"는 막중한 책임감과 함께 배포 자동화의 위력을 경험했습니다.',
      '개발자들이 인프라 걱정 없이 로직에만 집중할 수 있는 환경을 만들어주었을 때, 팀 전체의 생산성이 폭발적으로 증가하는 것을 목격했습니다.',
    ]
  },
  {
    date: '2025.07 - 현재',
    title: 'Cloudbro Open Project',
    company: 'Cloudbro (HoneyBeePF 프로젝트)',
    description: '현업 SRE 엔지니어들과 함께하며, "기술적으로 뛰어난 도구"보다 "운영하기 편한 도구"가 더 가치 있음을 배웠습니다.',
    tasks: [
      'Rust와 eBPF라는 생소한 기술과 씨름하며, 로우 레벨(Low-level) 데이터가 어떻게 상위 레벨의 인사이트로 변환되는지 그 데이터의 흐름을 깊이 이해하게 되었습니다.',
      'Helm Chart를 직접 설계하면서, "내가 작성한 코드는 결국 다른 동료가 사용하는 인터페이스(UI)"라는 마음가짐으로 사용자 경험(DX)을 고민하게 되었습니다.',
      '오픈소스 표준(OpenTelemetry)을 준수하는 것이 장기적인 유지보수성과 생태계 확장에 얼마나 필수적인 요소인지 깨닫는 계기가 되었습니다.',
    ]
  },
  {
    date: '2025.02 - 2025.06',
    title: 'Security Academy education program',
    company: 'KISIA (Intellisia 프로젝트)',
    description: '보안 관제 경험에서 느꼈던 답답함을 해결하기 위해, "개발 단계에서부터 안전한" 플랫폼을 직접 설계하고 만들었습니다.',
    tasks: [
      '보안 도구(Trivy, Semgrep)를 파이프라인에 심으면서, 개발 속도를 저해하지 않으면서도 안전을 지키는 "균형 잡힌 아키텍처"를 고민했습니다.',
      '수동 배포의 불안함을 GitOps(ArgoCD)로 해결하며, 코드로 관리되는 인프라가 주는 "심리적 안정감"과 "운영 효율성"을 몸소 체험했습니다.',
      '개발자가 인프라 팀을 거치지 않고도 주도적으로 서비스를 배포할 수 있는 환경을 구축하며, 플랫폼 엔지니어링이 나아가야 할 방향성을 확립했습니다.',
    ]
  },
];

export const projects: Project[] = [
  { 
    title: 'HoneyBeePF',
    projectType: 'Team',
    description: 'Rust와 eBPF 기반의 Kubernetes 환경을 위한 경량 관측성 플랫폼입니다.',
    detailedDescription: `기존 모니터링 도구(Sidecar 패턴 등)의 높은 리소스 오버헤드 문제를 해결하기 위해 eBPF(Extended Berkeley Packet Filter) 기술을 도입했습니다.\n\n커널 레벨에서 시스템 콜과 네트워크 패킷을 직접 추적하여 애플리케이션 수정 없이 깊이 있는 가시성을 제공하며, 수집된 데이터는 OpenTelemetry 표준을 준수하여 Grafana로 시각화됩니다.`,
    tags: ['Rust', 'eBPF', 'Kubernetes', 'Prometheus'],
    icon: <img src="/images/ebpf.png" alt="eBPF" className="w-10 h-10 object-contain" />,
    links: { docs: "https://honeybeepf.io" },
    problemSolving: [{ id: "hb-1", summary: "사이드카 패턴 오버헤드 제거 (Zero-Cost Abstraction)", problem: "기존 Sidecar 방식의 에이전트는 각 파드마다 컨테이너를 추가해야 하므로 클러스터 전체 리소스 사용량이 급증하는 문제가 있음.", cause: "User Space와 Kernel Space 간의 잦은 Context Switching 및 중복된 네트워크 스택 처리", metric: "노드 당 CPU 사용률 15% 감소 목표", solution: "Rust 기반 eBPF 프로그램을 통해 커널 레벨에서 직접 메트릭 수집 (DaemonSet 방식)", process: "1. aya 프레임워크를 사용하여 eBPF 프로브 개발\n2. kprobes/tracepoints를 이용해 필요한 syscall 만 선택적으로 후킹", evaluation: "기존 대비 CPU 오버헤드 90% 이상 절감 및 네트워크 지연 시간(Latency) 최소화 달성", remarks: "Rust의 메모리 안전성과 eBPF의 고성능을 결합하여 안정적인 모니터링 환경 구축" }]
  },
  { 
    title: '12-STREETS',
    projectType: 'Team',
    description: '대규모 트래픽 처리를 위한 Docker & Kubernetes 기반 이커머스 인프라 구축 프로젝트입니다.',
    detailedDescription: `실제 상용 환경을 모사하여 On-Premise 환경에서 직접 Kubernetes 클러스터를 구축했습니다.\n\nMySQL 이중화(HA) 구성으로 데이터 안정성을 확보하고, ArgoCD를 이용한 GitOps 배포 파이프라인을 통해 배포 자동화 및 버전 관리를 구현했습니다. 또한 Nginx Ingress Controller와 MetalLB를 통해 외부 트래픽을 효율적으로 라우팅했습니다.`,
    tags: ['Kubernetes', 'Docker', 'ArgoCD', 'MySQL'],
    icon: <SiKubernetes size={40} />,
    links: { github: "https://github.com/vanillaturtlechips/12-streets" },
    problemSolving: [
      { id: "st-1", summary: "K8s Master Node HA 구성 및 Leader Election 검증", problem: "단일 마스터 노드 장애 시 클러스터 전체 제어 불능 상태가 되는 SPOF(Single Point of Failure) 위험", cause: "초기 클러스터 설계 시 Control Plane 이중화 미고려", metric: "마스터 노드 1대 다운 시 API Server 가용성 유지 여부", solution: "Keepalived와 HAProxy를 이용한 마스터 노드 3중화 및 VIP 구성", process: "1. 3대의 마스터 노드에 etcd 클러스터링 구성\n2. Keepalived로 VIP 설정 및 헬스 체크 스크립트 적용\n3. 강제로 리더 노드를 종료시키는 카오스 테스트 수행", evaluation: "리더 노드 장애 발생 시 3초 이내에 예비 노드가 리더로 승격되며 서비스 중단 없이 API 요청 처리 성공", remarks: "분산 시스템에서의 합의 알고리즘(Raft)과 리더 선출 과정에 대한 깊은 이해 획득" },
      { id: "st-2", summary: "DB 연결 실패 및 환경 변수 주입 문제 해결", problem: "배포된 애플리케이션이 K8s 환경 변수가 아닌 로컬 설정(localhost)을 참조하여 DB 연결 실패", cause: "Spring Boot 프로파일 설정 우선순위 문제 및 isLocal 플래그 로직 오류", metric: "Pod 재시작 횟수(CrashLoopBackOff) 및 에러 로그 발생 빈도", solution: "환경 변수(env) 주입 여부에 따른 동적 프로파일 선택 로직 개선", process: "1. K8s ConfigMap/Secret으로 DB 접속 정보 주입\n2. 애플리케이션 구동 시 System.getenv 확인 로직 수정\n3. Liveness Probe 설정으로 DB 연결 실패 시 자동 재시작 구성", evaluation: "배포 성공률 100% 달성 및 환경별(Dev/Prod) 설정 분리 완벽 구현", remarks: "코드 레벨과 인프라 설정 간의 의존성을 명확히 분리하는 12-Factor App 원칙 적용" }
    ]
  },
  { 
    title: 'Intellisia Platform',
    projectType: 'Team',
    description: '보안 취약점 점검을 자동화하고 개발 프로세스에 통합한 DevSecOps 플랫폼입니다.',
    detailedDescription: `개발자가 코드를 푸시하는 순간부터 배포까지 보안 검사를 자동 수행하는 올인원 플랫폼입니다.\n\nNext.js로 개발된 사용자 대시보드에서 파이프라인 상태를 시각화하며, GitHub Actions와 연동하여 Trivy(이미지 스캔), Semgrep(코드 스캔) 결과를 리포팅합니다.`,
    tags: ['Next.js', 'DevSecOps', 'GitHub Actions', 'AWS'],
    icon: <img src="/images/trivy.png" alt="Trivy" className="w-10 h-10 object-contain" />,
    links: { github: "https://github.com/GRPC-OK/Intellisia" },
    problemSolving: [{ id: "int-1", summary: "CI/CD 파이프라인 속도 최적화 (병렬 처리)", problem: "보안 스캔 단계가 추가되면서 전체 배포 시간이 2배 이상 증가하여 개발 피드백 루프가 느려짐.", cause: "모든 Job이 순차적(Sequential)으로 실행되도록 구성된 워크플로우", metric: "전체 파이프라인 실행 시간 15분 -> 5분 단축 목표", solution: "GitHub Actions의 needs 키워드를 활용한 의존성 관리 및 병렬(Parallel) 실행 구조로 변경", process: "1. 빌드, 테스트, 보안 스캔(SAST/Image) 단계를 독립적인 Job으로 분리\n2. 캐싱(Actions Cache) 적용으로 중복 다운로드 제거", evaluation: "파이프라인 실행 시간 6분으로 약 60% 단축, 개발 생산성 향상", remarks: "속도와 보안 사이의 트레이드오프를 기술적으로 해결한 사례" }]
  },
  { 
    title: 'SoftBank Hackathon',
    projectType: 'Team',
    description: 'Spring Cloud 기반의 마이크로서비스 아키텍처로 구현한 클라우드 네이티브 서비스입니다.',
    detailedDescription: `SoftBank 주관 해커톤에서 개발한 프로젝트로, 확장성과 유연성을 극대화하기 위해 MSA 패턴을 적용했습니다.\n\nEureka Server를 통한 서비스 디스커버리, Spring Cloud Gateway를 이용한 단일 진입점 관리, 그리고 Prometheus & Grafana를 활용한 통합 모니터링 환경을 구축했습니다.`,
    tags: ['Spring Cloud', 'Java', 'Docker', 'Grafana'],
    icon: <SiSpring size={40} />,
    links: {},
    problemSolving: [{ id: "sb-1", summary: "마이크로서비스 간 통신 장애 및 디스커버리 지연 해결", problem: "서비스 스케일 아웃 시 Gateway가 새로운 인스턴스를 즉시 인식하지 못해 503 에러 발생", cause: "Eureka Client의 Heartbeat 주기와 Gateway의 캐시 갱신 주기 불일치", metric: "서비스 등록 후 트래픽 수신 가능까지의 지연 시간(Lag)", solution: "Eureka Instance 설정 튜닝 (lease-renewal-interval-in-seconds 등)", process: "1. 갱신 주기를 기본 30초에서 5초로 단축하여 감지 속도 향상\n2. Gateway의 로드밸런싱 정책을 RoundRobin으로 명시적 설정", evaluation: "인스턴스 추가/삭제 시 10초 이내에 라우팅 테이블 갱신 확인, 무중단 배포 가능해짐", remarks: "분산 시스템에서의 '일관성(Consistency)'과 '가용성(Availability)' 간의 조율 경험" }]
  },
  {
    title: 'Datalocker',
    projectType: 'Side',
    description: '개인 데이터 보안 및 로컬 암호화 저장소 프로젝트입니다.',
    detailedDescription: `Rust의 강력한 메모리 안전성과 Tauri의 경량화된 프레임워크를 활용하여 개발된 크로스 플랫폼 데스크탑 애플리케이션입니다.\n\nSQLite Cipher를 이용한 데이터베이스 암호화를 적용하여 로컬에 저장되는 모든 민감 데이터를 보호하며, OS Native Keychain과 연동하여 마스터 키 관리에 대한 보안성을 강화했습니다.`,
    tags: ['Rust', 'Tauri', 'SQLite', 'Security'],
    icon: <Lock size={40} />,
    links: { github: "https://github.com/vanillaturtlechips/datalocker" },
    problemSolving: [{ id: "dl-1", summary: "로컬 데이터베이스 암호화 및 성능 최적화", problem: "일반 SQLite 사용 시 데이터 파일이 평문으로 저장되어 탈취 시 정보 유출 위험 발생", cause: "SQLite 기본 드라이버는 암호화 기능을 제공하지 않음", metric: "암호화 적용 후 쿼리 Latency 증가율 10% 미만 유지", solution: "SQLCipher 통합 및 Rust 바인딩(Rusqlite) 적용", process: "1. Tauri 백엔드에서 DB 커넥션 생성 시 PRAGMA key 설정을 통해 암호화 키 주입\n2. 메모리 상에서만 복호화가 이루어지도록 로직 구성", evaluation: "강력한 AES-256 암호화를 적용하면서도 체감 성능 저하 없는 안전한 저장소 구축", remarks: "Client-Side Encryption의 중요성과 키 관리의 어려움(Key Management)을 경험" }]
  },
  { 
    title: 'Gopra Portfolio', 
    projectType: 'Side',
    description: 'React, Go, Docker로 구축한 현대적인 인터랙티브 포트폴리오 사이트입니다.',
    detailedDescription: `React와 Tailwind CSS를 활용하여 Glassmorphism UI를 구현하고, 백엔드는 Go언어로 API를 개발했습니다. \n\nDocker Multi-stage build를 통해 이미지 사이즈를 최적화했으며, GitHub Actions를 통해 CI/CD 파이프라인을 구축하여 자동 배포 환경을 마련했습니다.`,
    tags: ['Go', 'React', 'Docker', 'Terraform'],
    icon: <Globe size={40} />,
    links: { github: "https://github.com/vanillaturtlechips/gopra", demo: "https://myong12.site" },
    problemSolving: [
      { id: "case-1", summary: "Docker 빌드 속도 72% 개선 (5m → 1.5m)", problem: "CI/CD 파이프라인에서 Docker 이미지 빌드 및 배포 시간이 평균 5분 이상 소요되어, 잦은 수정 사항 반영 시 생산성이 저하되는 문제가 발생했습니다.", cause: "단일 스테이지 빌드 방식을 사용하여 불필요한 빌드 도구와 종속성이 최종 이미지에 포함되었고, 레이어 캐싱이 효율적으로 동작하지 않았습니다.", metric: "평균 빌드 시간 5분 30초, 이미지 크기 1.2GB로 스토리지 비용 및 네트워크 전송 지연 발생", solution: "Docker Multi-stage Build 도입 및 GitHub Actions 캐시 전략 최적화 (BuildKit 사용)", process: "1. 빌드 스테이지(Builder)와 실행 스테이지(Runner)를 분리하여 Go 바이너리만 최종 이미지에 복사하도록 Dockerfile 수정\n2. GitHub Actions workflow에 docker/build-push-action의 캐시 백엔드(GHA) 적용", evaluation: "빌드 시간 1분 30초로 단축(약 72% 개선), 이미지 크기 30MB로 경량화(약 97% 감소) 달성", remarks: "이미지 크기가 줄어들면서 ECR 저장 비용 절감 및 파드 시작 속도(Startup time) 또한 개선되는 부수 효과를 얻음." },
      { id: "case-2", summary: "API 응답 지연 문제 해결 (Redis 캐싱)", problem: "메인 페이지 로딩 시 포트폴리오 데이터 조회 API 응답이 간헐적으로 2초 이상 소요됨.", cause: "DB 연결 풀(Connection Pool) 고갈 및 복잡한 조인 쿼리로 인한 병목 현상 확인", metric: "P99 Latency 2.4s", solution: "Redis를 도입하여 읽기 빈도가 높은 데이터에 대한 캐싱 레이어 적용", process: "1. Redis 인스턴스 구축 및 Go 애플리케이션 연동\n2. Write-Through 전략으로 데이터 일관성 유지 로직 구현", evaluation: "P99 Latency 200ms 미만으로 단축 (90% 개선)", remarks: "캐시 전략 도입으로 DB 부하가 현저히 줄어듦." }
    ]
  },
  { 
    title: 'Security Infra Setup',
    projectType: 'Side',
    description: '리눅스 기반의 방화벽 및 침입 탐지 시스템(IDS)을 구축하여 내부망을 보호하는 보안 인프라 프로젝트입니다.',
    detailedDescription: `VMware 상에서 가상 네트워크를 구성하고, iptables를 이용한 패킷 필터링 정책을 수립했습니다.\n\nSnort IDS를 도입하여 악성 트래픽을 탐지하고, Wireshark를 통해 네트워크 패킷을 심층 분석하여 보안 위협에 대응하는 체계를 마련했습니다.`,
    tags: ['Linux', 'Network', 'Security', 'Snort'],
    icon: <Network size={40} />,
    links: {},
    problemSolving: [{ id: "sec-1", summary: "가상 네트워크 IP 충돌 및 통신 불가 문제 해결", problem: "VMware Bridged 모드 사용 시 호스트 네트워크와 IP 대역 충돌로 인한 외부 통신 단절", cause: "DHCP 할당 범위 내에 고정 IP를 설정하여 중복 발생", metric: "네트워크 패킷 손실률(Packet Loss) 0% 달성", solution: "네트워크 대역 설계(Subnetting) 및 정적 IP 할당 정책 수립", process: "1. 내부망(Private)과 외부망(Public) 인터페이스 분리\n2. 체계적인 IP 관리 대장 작성 및 문서화", evaluation: "안정적인 네트워크 통신 환경 확보 및 인프라 설계 역량 강화", remarks: "기초 네트워크 이론(OSI 7 Layer)을 실제 환경에 적용해본 경험" }]
  },
  { 
    title: 'Vulnerability Script',
    projectType: 'Side',
    description: '주요정보통신기반시설 기술적 취약점 가이드를 준수하는 자동화 점검 스크립트 개발 프로젝트입니다.',
    detailedDescription: `수동으로 진행되던 서버 취약점 점검을 Shell Script로 자동화하여 점검 시간을 획기적으로 단축했습니다.\n\nOS 설정 파일, 권한, 불필요한 서비스 등을 자동으로 스캔하고, HTML/Text 형태의 보고서를 생성하여 관리자가 즉시 조치할 수 있도록 지원합니다.`,
    tags: ['Shell Script', 'Linux', 'Automation'],
    icon: <SiGnubash size={40} />,
    links: {},
    problemSolving: [{ id: "vul-1", summary: "대용량 파일 검색 시 시스템 부하 최적화", problem: "루트 디렉토리(/)부터 전체 검색(find) 실행 시 CPU 부하 급증 및 점검 시간 과다 소요", cause: "불필요한 시스템 디렉토리(/proc, /sys 등)까지 검색 범위에 포함됨", metric: "스크립트 실행 시간 및 CPU Load Average", solution: "검색 제외 경로(-prune) 설정 및 타겟 디렉토리 한정", process: "1. 점검 항목별로 필수적인 경로만 지정하도록 로직 개선\n2. I/O 부하를 줄이기 위해 nice 명령어로 프로세스 우선순위 조정", evaluation: "점검 속도 5배 향상 및 운영 중인 서비스에 영향 없이 점검 가능해짐", remarks: "엔지니어링에서 '효율성'과 '정확성'을 동시에 고려해야 함을 배움" }]
  },
  { 
    title: 'Malware Analysis',
    projectType: 'Side',
    description: '실제 악성코드(랜섬웨어, 봇넷 등)를 격리된 샌드박스 환경에서 분석하고 보고서를 작성했습니다.',
    detailedDescription: `가상 머신을 이용해 안전한 분석 환경을 구축하고, 정적 분석(문자열, PE 헤더)과 동적 분석(프로세스, 레지스트리, 네트워크 행위)을 수행했습니다.\n\n악성코드의 동작 원리를 파악하고 침해 사고 발생 시 대응 방안을 도출하는 역량을 길렀습니다.`,
    tags: ['Security', 'Forensic', 'Wireshark', 'Reverse Engineering'],
    icon: <Search size={40} />,
    links: {},
    problemSolving: [] 
  },
];