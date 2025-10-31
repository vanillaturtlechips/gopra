// frontend/scripts/sync.mjs
import fs from 'fs';
import path from 'path';

// 1. 환경 변수 로드
const {
  VERCEL_PROJECT_URL,
  PORTFOLIO_API_TOKEN,
  VERCEL_GIT_REPO_OWNER, // Vercel이 자동으로 제공
  VERCEL_GIT_REPO_SLUG,   // Vercel이 자동으로 제공 (gopra)
  CONTENT_ROOT_PATH,      // 우리가 설정한 "study-content"
} = process.env;

// 2. 동기화할 카테고리 목록
const TARGET_CATEGORIES = [
  'Devops',
  'GOlang',
  'DataBase',
  'Network',
  'Operating-System',
  'Data-Structure-and-Algorithm'
];

// 3. GitHub 링크 생성을 위한 기본 URL
const GITHUB_BASE_URL = `https://github.com/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}/blob/main`;

// 4. 스크립트 기준 콘텐츠 폴더 경로 설정
// (현재 위치: /frontend/scripts/ -> /frontend/ -> / (root) -> /study-content/)
// 'process.cwd()'는 'frontend' 폴더를 가리킵니다.
const CONTENT_DIR = path.join(process.cwd(), '..', CONTENT_ROOT_PATH);

// 5. API 요청 시 사용할 인증 헤더
const AUTH_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${PORTFOLIO_API_TOKEN}`,
};

/**
 * 로컬 파일 시스템을 스캔하여 .md 파일 목록을 가져옵니다.
 */
function getLocalFiles() {
  console.log(`Scanning for .md files in: ${CONTENT_DIR}`);
  const files = [];

  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn(`Content directory not found: ${CONTENT_DIR}. Skipping local file scan.`);
    return [];
  }

  for (const category of TARGET_CATEGORIES) {
    const categoryDir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryDir)) {
      // 해당 카테고리 폴더가 없으면 건너뜀
      continue;
    }

    // 폴더 내 .md 파일만 필터링 (README.md 제외)
    const mdFiles = fs.readdirSync(categoryDir).filter(
      file => file.endsWith('.md') && !file.endsWith('README.md')
    );

    for (const file of mdFiles) {
      // DB에 저장할 경로 (예: "study-content/devops/docker.md")
      const relativePath = `${CONTENT_ROOT_PATH}/${category}/${file}`;
      files.push({
        title: file.replace('.md', ''),
        category: category,
        linkUrl: `${GITHUB_BASE_URL}/${relativePath}`, // 최종 GitHub 링크
        content: '', // 요약글은 이 스크립트에서 파싱하지 않음
      });
    }
  }
  console.log(`Found ${files.length} .md files locally.`);
  return files;
}

/**
 * Vercel DB에서 현재 게시물 목록을 가져옵니다.
 */
async function getDatabasePosts() {
  console.log('Fetching posts from Vercel DB...');
  try {
    const response = await fetch(`${VERCEL_PROJECT_URL}/api/posts`);
    if (!response.ok) {
      console.error(`Failed to fetch posts: ${response.statusText}`);
      return [];
    }
    const posts = await response.json();
    console.log(`Found ${posts.length} posts in DB.`);
    return posts;
  } catch (e) {
    console.error('Error fetching from DB:', e.message);
    return [];
  }
}

/**
 * 메인 동기화 로직
 */
async function syncPortfolio() {
  console.log('--- Starting Portfolio Sync ---');

  // Vercel 필수 변수 확인
  const missingVars = [
    !VERCEL_PROJECT_URL && 'VERCEL_PROJECT_URL',
    !PORTFOLIO_API_TOKEN && 'PORTFOLIO_API_TOKEN',
    !VERCEL_GIT_REPO_OWNER && 'VERCEL_GIT_REPO_OWNER',
    !VERCEL_GIT_REPO_SLUG && 'VERCEL_GIT_REPO_SLUG',
    !CONTENT_ROOT_PATH && 'CONTENT_ROOT_PATH'
  ].filter(Boolean);

  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(', ')}. Aborting sync.`);
    // Vercel 자동 변수가 없다는 것은 로컬 dev 환경일 수 있으므로 빌드를 막지 않음
    if (process.env.NODE_ENV !== 'development') {
        process.exit(1); // Vercel 빌드 시에는 실패 처리
    }
    console.warn('Continuing build without sync (likely local dev)...');
    return;
  }

  const [localFiles, dbPosts] = await Promise.all([
    getLocalFiles(),
    getDatabasePosts(),
  ]);

  // linkUrl (GitHub URL)을 고유 키로 사용하여 비교
  const localMap = new Map(localFiles.map(f => [f.linkUrl, f]));
  const dbMap = new Map(dbPosts.map(p => [p.linkUrl, p]));

  // 1. 로컬에만 있는 파일 찾기 (DB에 '추가'해야 함)
  const postsToAdd = localFiles.filter(f => !dbMap.has(f.linkUrl));

  // 2. DB에만 있는 포스트 찾기 (로컬에서 '삭제'된 것임)
  const postsToDelete = dbPosts.filter(p => !localMap.has(p.linkUrl));

  // 3. '추가' 작업 실행
  for (const post of postsToAdd) {
    console.log(`[+] ADDING: ${post.title} (Category: ${post.category})`);
    try {
      const res = await fetch(`${VERCEL_PROJECT_URL}/api/posts`, {
        method: 'POST',
        headers: AUTH_HEADER,
        body: JSON.stringify(post),
      });
      if (!res.ok) console.error(`Failed to add ${post.title}: ${await res.text()}`);
    } catch (e) {
      console.error(`Failed to add ${post.title}:`, e.message);
    }
  }

  // 4. '삭제' 작업 실행
  for (const post of postsToDelete) {
    console.log(`[-] DELETING: ${post.title} (ID: ${post.id})`);
    try {
      const res = await fetch(`${VERCEL_PROJECT_URL}/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: AUTH_HEADER,
      });
      if (!res.ok) console.error(`Failed to delete ${post.title}: ${await res.text()}`);
    } catch (e) {
      console.error(`Failed to delete ${post.title}:`, e.message);
    }
  }

  console.log('--- Sync Complete ---');
}

// 스크립트 실행
await syncPortfolio();